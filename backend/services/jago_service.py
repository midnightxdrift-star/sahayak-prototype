import logging
import httpx
from typing import Dict, Any, Optional, List

from backend.core.config import settings
from backend.data.mock_data import (
    STUDENT_DATA,
    APPLICATIONS_DATA,
    DOCUMENTS_DATA,
    PAYMENTS_DATA,
    SCHOLARSHIPS_DATA
)

logger = logging.getLogger(__name__)

class JagoService:
    @staticmethod
    def get_student_context(application_id: Optional[str] = None, scholarship_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Retrieves the deterministic, authoritative context for the student
        and their active application, documents, and payments.
        """
        app = None
        if application_id:
            app = next((a for a in APPLICATIONS_DATA if a["id"].lower() == application_id.lower()), None)
        if not app and APPLICATIONS_DATA:
            app = APPLICATIONS_DATA[0]
            
        scholarship = None
        if scholarship_id:
            scholarship = next((s for s in SCHOLARSHIPS_DATA if s["id"].lower() == scholarship_id.lower()), None)
        elif app:
            scholarship = next((s for s in SCHOLARSHIPS_DATA if s["id"] == app["scholarship_id"]), None)

        action_needed_docs = [
            d["name"] for d in DOCUMENTS_DATA["documents"] if d["status"] == "action_needed"
        ]
        verified_docs = [
            d["name"] for d in DOCUMENTS_DATA["documents"] if d["status"] == "verified"
        ]

        context = {
            "student_name": STUDENT_DATA["name"],
            "student_id": STUDENT_DATA["student_id"],
            "community": STUDENT_DATA["community"],
            "state": STUDENT_DATA["state"],
            "college": STUDENT_DATA["college"],
            "course": STUDENT_DATA["course"],
            "application_id": app["id"] if app else "None",
            "scholarship_name": scholarship["name"] if scholarship else "None",
            "progress_percent": app["progress_percent"] if app else 0,
            "overall_status": app["status"] if app else "No active application",
            "current_stage": app["current_stage"] if app else "Unknown",
            "sanction_status": app["sanction_status"] if app else "Unknown",
            "payment_status": app["payment_status"] if app else "Unknown",
            "submission_date": app["submitted_date"] if app else "Unknown",
            "stages": app["stages"] if app else [],
            "total_received": PAYMENTS_DATA["total_received"],
            "pending_amount": PAYMENTS_DATA["pending_amount"],
            "bank_name": PAYMENTS_DATA["bank_name"],
            "account_mask": PAYMENTS_DATA["account_mask"],
            "aadhaar_linked": PAYMENTS_DATA["aadhaar_linked"],
            "vault_readiness": f"{DOCUMENTS_DATA['readiness_percentage']}%",
            "verified_documents": verified_docs,
            "action_needed_documents": action_needed_docs,
            "document_action_reason": next(
                (d["action_needed_reason"] for d in DOCUMENTS_DATA["documents"] if d["status"] == "action_needed"),
                None
            ),
            "eligibility_rules": scholarship.get("eligibility_criteria", []) if scholarship else []
        }
        return context

    @classmethod
    async def process_chat(
        cls, 
        message: str, 
        application_id: Optional[str] = None, 
        scholarship_id: Optional[str] = None,
        language: str = "en",
        history: Optional[List[Dict[str, str]]] = None,
        student_id: Optional[str] = None,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Processes student inquiry. Connects to Custom JAGO AI service if configured,
        then Grok API if configured, otherwise provides grounded contextual responses.
        """
        context = cls.get_student_context(application_id, scholarship_id)
        effective_student_id = student_id or context.get("student_id", "STU-2026-8841")
        effective_session_id = session_id or f"sess-{effective_student_id}"

        # 1. Try Custom JAGO API if configured
        if settings.JAGO_API_KEY and settings.JAGO_URL:
            try:
                jago_reply = await cls._call_external_jago_api(
                    message=message,
                    student_id=effective_student_id,
                    session_id=effective_session_id
                )
                if jago_reply:
                    return {
                        "response": jago_reply,
                        "reply": jago_reply,
                        "context_used": context,
                        "source": "jago_external_api"
                    }
            except Exception as e:
                logger.error(f"Custom JAGO API call failed: {e}. Falling back to next service.")

        # 2. Try Grok API if key is present
        if settings.GROK_API_KEY and settings.GROK_API_KEY.strip():
            try:
                grok_reply = await cls._call_grok_api(message, context, language, history)
                if grok_reply:
                    return {
                        "response": grok_reply,
                        "reply": grok_reply,
                        "context_used": context,
                        "source": "grok"
                    }
            except Exception as e:
                logger.error(f"Grok API call failed: {e}. Falling back to grounded service.")

        # 3. Grounded deterministic service fallback
        fallback_reply = cls._generate_grounded_reply(message, context, language, history)
        return {
            "response": fallback_reply,
            "reply": fallback_reply,
            "context_used": context,
            "source": "grounded_service"
        }

    @staticmethod
    async def _call_external_jago_api(
        message: str,
        student_id: str = "STU-2026-8841",
        session_id: str = "sess-default"
    ) -> Optional[str]:
        target_url = f"{settings.JAGO_URL}/api/v1/chat"
        headers = {
            "Content-Type": "application/json",
            "X-JAGO-API-KEY": settings.JAGO_API_KEY
        }
        payload = {
            "studentId": student_id,
            "message": message,
            "sessionId": session_id
        }
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(target_url, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                reply = (
                    data.get("data", {}).get("reply")
                    if isinstance(data.get("data"), dict)
                    else None
                ) or data.get("reply") or data.get("response")
                return reply
            else:
                logger.warning(f"External JAGO API returned status {resp.status_code}: {resp.text}")
                return None

    @staticmethod
    async def _call_grok_api(
        user_message: str, 
        context: Dict[str, Any], 
        language: str = "en",
        history: Optional[List[Dict[str, str]]] = None
    ) -> Optional[str]:
        system_prompt = f"""
You are JAGO, the friendly and compassionate AI scholarship guide inside SAHAYAK, designed specifically for tribal (ST) students under the Ministry of Tribal Affairs (MoTA).

YOUR PRIMARY RULES:
1. Speak simply, warmly, clearly, and concisely. Keep explanations short.
2. Avoid unnecessary bureaucratic or technical jargon.
3. The following backend facts are 100% authoritative. You must NEVER contradict them, alter amounts or dates, or invent approvals/decisions:
- Student: {context['student_name']} (Student ID: {context['student_id']})
- Community: {context['community']}, State: {context['state']}
- College: {context['college']}, Course: {context['course']}
- Active Scheme: {context['scholarship_name']} (Application ID: {context['application_id']})
- Overall Status: {context['overall_status']} ({context['progress_percent']}% complete)
- Current Stage: {context['current_stage']} (Sanction is Pending / Under Process)
- State Verification: Completed on 15 Jul 2026
- Institute Verification: Completed on 2 Jul 2026
- Document Verification: Completed on 18 Jun 2026
- Payment Status: Total received ₹{context['total_received']:,}, Pending amount ₹{context['pending_amount']:,} for September installment (in verification).
- Bank: {context['bank_name']} ({context['account_mask']}), Aadhaar Linkage: {'Active' if context['aadhaar_linked'] else 'Not Linked'}
- Verified Documents: {', '.join(context['verified_documents'])}
- Action Needed Document: {', '.join(context['action_needed_documents'])} ({context['document_action_reason']})
- Eligibility Criteria: {'; '.join(context['eligibility_rules'])}

SPECIFIC SITUATION GUIDELINES:
- If user asks why payment is pending: State that the final ₹{context['pending_amount']:,} installment for September is currently marked as pending / in verification. Do NOT invent fake administrative reasons (such as bank failure or treasury delays). Suggest uploading the renewed Income Certificate to ensure sanction proceeds smoothly.
- If user asks which documents are missing: State that 5 of 6 documents are verified, but the Income Certificate needs renewal because its 1-year validity expired.
- If user asks where their application is: State that Document, Institute, and State verifications are completed, and the application is currently at the Sanction stage.
- If user asks what a status means (e.g. "Verification Complete"): Explain that all administrative checks by the college and state welfare department have been approved, and the file is now waiting for the ministry's fund sanction order.
- If user asks for information NOT present in the portal (e.g., hostel, marks, other exams, or personal questions): Clearly say that this information is not available in their Sahayak scholarship records and recommend contacting their college office.
- If requested language is Hindi (or user writes in Hindi): Answer in warm, simple, conversational Hindi. Otherwise answer in English.
"""

        messages_payload = [{"role": "system", "content": system_prompt}]
        
        # Include recent history if provided
        if history:
            for h in history[-4:]:
                role = "assistant" if h.get("role") in ["assistant", "bot"] else "user"
                messages_payload.append({"role": role, "content": h.get("content", "")})

        messages_payload.append({"role": "user", "content": user_message})

        headers = {
            "Authorization": f"Bearer {settings.GROK_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": settings.GROK_MODEL,
            "messages": messages_payload,
            "temperature": 0.2,
            "max_tokens": 400
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(settings.GROK_API_URL, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                return data["choices"][0]["message"]["content"]
            else:
                logger.warning(f"Grok API returned status {resp.status_code}: {resp.text}")
                return None

    @staticmethod
    def _generate_grounded_reply(
        query: str, 
        ctx: Dict[str, Any], 
        language: str = "en",
        history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        """
        Deterministic, empathetic rule engine answering standard student questions
        strictly grounded in backend facts.
        """
        q = query.lower().strip()
        is_hindi = language == "hi" or any(ord(char) >= 0x0900 and ord(char) <= 0x097F for char in query)
        
        # Check context from previous turn if query is short like "What should I do?"
        last_bot_msg = ""
        if history and len(history) > 0:
            last_bot_msg = history[-1].get("content", "").lower()

        # Anti-Hallucination Guardrail: Rejection / Cancellation inquiry
        if "reject" in q or "rejection" in q or "cancelled" in q or "cancel" in q or "खारिज" in q or "रद्द" in q:
            if is_hindi:
                return (
                    f"आपके आवेदन में अस्वीकृति (Rejection) का कोई रिकॉर्ड नहीं है।\n\n"
                    f"• **स्थिति:** आपका आवेदन सक्रिय और प्रक्रियाधीन है ({ctx['progress_percent']}% पूर्ण)।\n"
                    f"• **वर्तमान चरण:** {ctx['current_stage']} (Sanction Order Pending)।\n"
                    f"उपलब्ध आधिकारिक रिकॉर्ड में कोई अस्वीकृति कारण मौजूद नहीं है।"
                )
            return (
                f"Your application has NOT been rejected.\n\n"
                f"• **Status:** Active & Under Process ({ctx['progress_percent']}% complete).\n"
                f"• **Current Stage:** {ctx['current_stage']} (Awaiting ministry sanction order).\n"
                f"The available backend records do not contain any rejection or cancellation reason."
            )

        # Anti-Hallucination Guardrail: Fake Payment Failure inquiry
        elif "payment fail" in q or "transaction fail" in q or "बैंक फेल" in q:
            if is_hindi:
                return (
                    f"आपके खाते में कोई पेमेंट विफलता दर्ज नहीं है।\n\n"
                    f"• **प्राप्त राशि:** ₹{ctx['total_received']:,} आपके {ctx['bank_name']} खाते में सफलतापूर्वक जमा हो चुकी है।\n"
                    f"• **लंबित किस्त:** ₹{ctx['pending_amount']:,} सामान्य सत्यापन में है, यह विफल नहीं हुई है।"
                )
            return (
                f"There is no payment failure recorded for your account.\n\n"
                f"• **Successfully received:** ₹{ctx['total_received']:,} in your {ctx['bank_name']} account ({ctx['account_mask']}).\n"
                f"• **Pending:** The final ₹{ctx['pending_amount']:,} is under normal verification for September, not failed."
            )

        # Specific: What should I do about Income Certificate?
        elif "income" in q and ("certificate" in q or "action" in q or "what" in q or "expire" in q or "valid" in q):
            if is_hindi:
                return (
                    f"**आय प्रमाण पत्र (Income Certificate) के संबंध में निर्देश:**\n\n"
                    f"• **समस्या:** {ctx['document_action_reason'] or '1 वर्ष की वैधता समाप्त हो चुकी है'}\n"
                    f"• **समाधान:** नीचे **Documents** मेन्यू में जाएं, **Income certificate** पर टैप करें और वित्तीय वर्ष 2026–27 का नया सक्षम प्राधिकारी द्वारा जारी प्रमाण पत्र अपलोड करें।"
                )
            return (
                f"**Instructions for your Income Certificate:**\n\n"
                f"• **Status:** Action Required — {ctx['document_action_reason'] or 'Validity expired beyond 1 year'}.\n"
                f"• **Action to take:** Go to **Documents** in the bottom navigation, tap **Income certificate**, and upload your renewed certificate for FY 2026–27 to ensure smooth fund sanction."
            )

        # 1. Payment pending
        elif "payment" in q or "pending" in q or "rupee" in q or "paisa" in q or "पेमेंट" in q or "रुपया" in q or "पैसा" in q:
            if is_hindi:
                return (
                    f"नमस्ते {ctx['student_name']} जी। आपके पेमेंट की स्थिति इस प्रकार है:\n\n"
                    f"• **प्राप्त राशि:** ₹{ctx['total_received']:,} आपके {ctx['bank_name']} खाते ({ctx['account_mask']}) में 4 किस्तों में जमा हो चुकी है।\n"
                    f"• **लंबित राशि:** सितंबर महीने की अंतिम किस्त (₹{ctx['pending_amount']:,}) अभी सत्यापन में लंबित है।\n"
                    f"• **अगला कदम:** आपका आय प्रमाण पत्र समाप्त हो गया है। इसे 'Documents' में जाकर अपडेट कर लें ताकि स्वीकृति में देरी न हो।"
                )
            return (
                f"Namaste {ctx['student_name']}. Here is your payment update:\n\n"
                f"• **Total received:** ₹{ctx['total_received']:,} has been credited to your {ctx['bank_name']} account ({ctx['account_mask']}) across 4 cycles.\n"
                f"• **Pending installment:** ₹{ctx['pending_amount']:,} for September is currently marked as pending / in verification.\n"
                f"• **Next step:** Your Income Certificate has expired. Updating it in your Document Wallet ensures your sanction order is processed without delay."
            )

        # 2. Missing documents / Deficiencies
        elif "document" in q or "missing" in q or "deficiency" in q or "certificate" in q or "दस्तावेज़" in q or "कागजात" in q or "आय" in q:
            if ctx["action_needed_documents"]:
                docs = ", ".join(ctx["action_needed_documents"])
                if is_hindi:
                    return (
                        f"नमस्ते {ctx['student_name']} जी। आपके दस्तावेज़ वॉल्ट की तैयारी **{ctx['vault_readiness']}** है (5 दस्तावेज़ सत्यापित):\n\n"
                        f"• **ध्यान देने योग्य दस्तावेज़:** {docs}\n"
                        f"• **कारण:** {ctx['document_action_reason']}\n\n"
                        f"इसे ठीक करने के लिए नीचे **Documents** मेन्यू में जाएं, **Income certificate** पर टैप करें और वित्तीय वर्ष 2026–27 का नया प्रमाण पत्र अपलोड करें।"
                    )
                return (
                    f"Namaste {ctx['student_name']}. Your Document Vault readiness is **{ctx['vault_readiness']}** (5 of 6 documents verified):\n\n"
                    f"• **Action needed for:** {docs}\n"
                    f"• **Reason:** {ctx['document_action_reason']}\n\n"
                    f"To fix this, go to **Documents** in the bottom menu, tap **Income certificate**, and upload your renewed certificate for FY 2026–27."
                )
            else:
                return (
                    f"नमस्ते {ctx['student_name']}! आपके सभी दस्तावेज़ सत्यापित हैं।"
                    if is_hindi else
                    f"Great news {ctx['student_name']}! All your documents are verified and ready in your Document Wallet."
                )

        # 3. Where is my application / Timeline
        elif "where" in q or "status" in q or "track" in q or "stage" in q or "progress" in q or "कहाँ" in q or "स्थिति" in q:
            if "verification complete" in q or "verification" in q:
                if is_hindi:
                    return (
                        f"**'Verification complete' का अर्थ:**\n\n"
                        f"आपके आवेदन की जाँच आपके कॉलेज और राज्य कल्याण विभाग द्वारा 15 जुलाई 2026 को सफलतापूर्वक पूरी कर ली गई है। अब आवेदन मंत्रालय के पास 'स्वीकृति' (Sanction Order) के लिए प्रक्रियाधीन है।"
                    )
                return (
                    f"**What 'Verification complete' means:**\n\n"
                    f"It means your application has successfully passed all verification checks by both your college and the State Tribal Welfare Department (completed on 15 Jul 2026). Your file is now awaiting the final fund sanction order from the ministry."
                )
            
            if is_hindi:
                return (
                    f"आपके **{ctx['scholarship_name']}** आवेदन (ID: `{ctx['application_id']}`) की प्रगति **{ctx['progress_percent']}%** है:\n\n"
                    f"• **वर्तमान चरण:** {ctx['current_stage']} (प्रक्रियाधीन)\n"
                    f"• **पूर्ण चरण:** आवेदन जमा (12 जून) → दस्तावेज़ जाँच (18 जून) → कॉलेज सत्यापन (2 जुलाई) → राज्य सत्यापन (15 जुलाई)।\n"
                    f"• **आगामी चरण:** स्वीकृति आदेश जारी होने के बाद ₹{ctx['pending_amount']:,} का अंतिम भुगतान डीबीटी द्वारा भेजा जाएगा।"
                )
            return (
                f"Your application for **{ctx['scholarship_name']}** (ID: `{ctx['application_id']}`) is **{ctx['progress_percent']}% complete**:\n\n"
                f"• **Current stage:** {ctx['current_stage']} (Under Process)\n"
                f"• **Completed milestones:** Application Submitted (12 Jun) → Document Verification (18 Jun) → Institute Verification (2 Jul) → State Verification (15 Jul).\n"
                f"• **Next step:** Once the Sanction Order is issued, your final payment of ₹{ctx['pending_amount']:,} will be released via DBT."
            )

        # 4. Eligibility
        elif "eligible" in q or "eligibility" in q or "पात्र" in q or "योग्यता" in q:
            if is_hindi:
                return (
                    f"हाँ {ctx['student_name']} जी! आप **{ctx['community']}** वर्ग के छात्र हैं और **{ctx['college']}** में **{ctx['course']}** की पढ़ाई कर रहे हैं। आप निम्नलिखित के लिए पात्र हैं:\n\n"
                    f"1. **पोस्ट-मैट्रिक छात्रवृत्ति (सक्रिय):** पूरी ट्यूशन फीस प्रतिपूर्ति और मासिक निर्वाह भत्ता।\n"
                    f"2. **राष्ट्रीय छात्रवृत्ति (उच्च शिक्षा):** प्रमुख संस्थानों में प्रवेश लेने पर।\n"
                    f"3. **राष्ट्रीय फेलोशिप:** भविष्य में एम.फिल या पीएच.डी. अनुसंधान के लिए।"
                )
            return (
                f"Yes, {ctx['student_name']}! As a student belonging to the **{ctx['community']}** community enrolled in **{ctx['course']}** at **{ctx['college']}**, you meet the criteria for:\n\n"
                f"1. **Post-Matric Scholarship (Active):** Full mandatory non-refundable fees reimbursed + monthly maintenance allowance.\n"
                f"2. **National Scholarship for Higher Education:** If admitted into notified premier institutions.\n"
                f"3. **National Fellowship:** For full-time doctoral research scholars.\n\n"
                f"Your annual family income under ₹2.5 Lakh also qualifies for the scheme."
            )

        # 5. What scholarship am I applying for / Which scholarship
        elif "scholarship am i" in q or "what scholarship" in q or "which scholarship" in q or "योजना" in q:
            if is_hindi:
                return (
                    f"आप **{ctx['scholarship_name']}** (Post-Matric Scholarship for ST Students) के लिए आवेदन कर रहे हैं। आपकी आवेदन आईडी `{ctx['application_id']}` है।"
                )
            return (
                f"You are currently applying for the **{ctx['scholarship_name']}** (Application ID: `{ctx['application_id']}`)."
            )

        # 6. What is my application ID
        elif "application id" in q or "app id" in q or "application number" in q:
            return (
                f"Your Application ID is **`{ctx['application_id']}`** for the {ctx['scholarship_name']} (Student ID: `{ctx['student_id']}`)."
            )

        # 7. "What should I do next?" / "What should I do?" (Contextual follow-up)
        elif "what should i do" in q or "next step" in q or "action" in q or "क्या करना" in q or "अगला कदम" in q:
            if "payment" in last_bot_msg:
                return (
                    f"For your pending payment of ₹{ctx['pending_amount']:,}, the best action right now is to renew your **Income Certificate** in the Document Wallet. Once the sanction order is issued, the payment will be credited automatically."
                )
            return (
                f"Your immediate next step in Sahayak:\n\n"
                f"1. Open **Documents** from the bottom bar.\n"
                f"2. Tap on **Income certificate** (Action needed).\n"
                f"3. Upload your renewed certificate for FY 2026–27 to ensure your sanction proceeds smoothly."
            )

        # 8. Unrelated question or unknown info
        elif any(unrelated in q for unrelated in ["hostel", "room", "bus", "food", "mess", "exam time", "holiday", "weather", "cricket"]):
            return (
                f"I don't have information about that in your Sahayak scholarship records. For institute-specific inquiries (like hostels, classes, or fee schedules), please contact your college administration at {ctx['college']} or call the MoTA toll-free helpline at 1800-11-7777."
            )

        # Default supportive guidance
        else:
            if is_hindi:
                return (
                    f"नमस्ते {ctx['student_name']} जी! मैं आपका सहायक रोबोट JAGO हूँ।\n\n"
                    f"आप मुझसे पूछ सकते हैं:\n"
                    f"• मेरा पेमेंट क्यों रुका हुआ है? (₹{ctx['pending_amount']:,})\n"
                    f"• कौन से दस्तावेज़ की आवश्यकता है? (आय प्रमाण पत्र)\n"
                    f"• मेरा आवेदन कहाँ तक पहुँचा है? ({ctx['current_stage']})\n"
                    f"• क्या मैं पात्र हूँ?"
                )
            return (
                f"Namaste {ctx['student_name']}! I am JAGO, your scholarship guide for the {ctx['scholarship_name']}.\n\n"
                f"I can help explain:\n"
                f"• Why your payment is pending (₹{ctx['pending_amount']:,})\n"
                f"• Which document needs attention (Income Certificate)\n"
                f"• Your current stage ({ctx['current_stage']})\n"
                f"• Your scheme eligibility\n\n"
                f"Tap one of the suggestion chips or ask any question about your scholarship!"
            )
