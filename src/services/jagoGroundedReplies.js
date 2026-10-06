/**
 * Client-Side Grounded Reply Engine for JAGO AI Assistant
 * Provides deterministic, authoritative, empathetic responses strictly grounded
 * in the student's scholarship, document, and payment profile.
 * Used as an instant local responder or resilient fallback if backend is offline.
 */
import {
  FALLBACK_STUDENT,
  FALLBACK_APPLICATION,
  FALLBACK_DOCUMENTS,
  FALLBACK_PAYMENTS,
  FALLBACK_SCHOLARSHIPS
} from './fallbackData.js';

export function generateClientGroundedReply(query = '', language = 'en', history = []) {
  const q = (query || '').toLowerCase().trim();
  const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(query);

  const studentName = FALLBACK_STUDENT.name;
  const studentId = FALLBACK_STUDENT.student_id;
  const community = FALLBACK_STUDENT.community;
  const college = FALLBACK_STUDENT.college;
  const course = FALLBACK_STUDENT.course;
  const schemeName = FALLBACK_APPLICATION.scholarship_name;
  const appId = FALLBACK_APPLICATION.id;
  const progressPercent = FALLBACK_APPLICATION.progress_percent;
  const currentStage = FALLBACK_APPLICATION.current_stage;
  const totalReceived = FALLBACK_PAYMENTS.total_received.toLocaleString('en-IN');
  const pendingAmount = FALLBACK_PAYMENTS.pending_amount.toLocaleString('en-IN');
  const bankName = FALLBACK_PAYMENTS.bank_name;
  const accountMask = FALLBACK_PAYMENTS.account_mask;
  const readiness = `${FALLBACK_DOCUMENTS.readiness_percentage}%`;
  const actionDoc = FALLBACK_DOCUMENTS.documents.find(d => d.status === 'action_needed');
  const actionReason = actionDoc?.action_needed_reason || '1 year validity expired. Please upload fresh certificate for FY 2026–27.';

  // Check last message for context continuity
  const lastBotMsg = history && history.length > 0 
    ? (history[history.length - 1]?.content || '').toLowerCase() 
    : '';

  // 1. Anti-Hallucination: Fake Rejection / Cancellation inquiry
  if (
    q.includes('reject') || 
    q.includes('rejection') || 
    q.includes('cancelled') || 
    q.includes('cancel') || 
    q.includes('खारिज') || 
    q.includes('रद्द')
  ) {
    if (isHindi) {
      return `आपके आवेदन में अस्वीकृति (Rejection) का कोई रिकॉर्ड नहीं है।\n\n• **स्थिति:** आपका आवेदन सक्रिय और प्रक्रियाधीन है (${progressPercent}% पूर्ण)।\n• **वर्तमान चरण:** ${currentStage} (Sanction Order Pending)।\nउपलब्ध आधिकारिक रिकॉर्ड में कोई अस्वीकृति कारण मौजूद नहीं है।`;
    }
    return `Your application has NOT been rejected.\n\n• **Status:** Active & Under Process (${progressPercent}% complete).\n• **Current Stage:** ${currentStage} (Awaiting ministry sanction order).\nThe available backend records do not contain any rejection or cancellation reason.`;
  }

  // 2. Anti-Hallucination: Fake Payment Failure inquiry
  if (
    q.includes('payment fail') || 
    q.includes('transaction fail') || 
    q.includes('बैंक फेल') || 
    q.includes('भुगतान विफल') ||
    q.includes('failed')
  ) {
    if (isHindi) {
      return `आपके खाते में कोई पेमेंट विफलता दर्ज नहीं है।\n\n• **प्राप्त राशि:** ₹${totalReceived} आपके ${bankName} खाते (${accountMask}) में सफलतापूर्वक जमा हो चुकी है।\n• **लंबित किस्त:** ₹${pendingAmount} सामान्य सत्यापन में है, यह विफल नहीं हुई है।`;
    }
    return `There is no payment failure recorded for your account.\n\n• **Successfully received:** ₹${totalReceived} in your ${bankName} account (${accountMask}).\n• **Pending:** The final ₹${pendingAmount} is under normal verification for September, not failed.`;
  }

  // 3. Specific: Income Certificate questions
  if (
    q.includes('income') && 
    (q.includes('certificate') || q.includes('action') || q.includes('what') || q.includes('expire') || q.includes('valid') || q.includes('कमी') || q.includes('renew'))
  ) {
    if (isHindi) {
      return `**आय प्रमाण पत्र (Income Certificate) के संबंध में निर्देश:**\n\n• **समस्या:** ${actionReason}\n• **समाधान:** नीचे **Documents** मेन्यू में जाएं, **Income certificate** पर टैप करें और वित्तीय वर्ष 2026–27 का नया सक्षम प्राधिकारी द्वारा जारी प्रमाण पत्र अपलोड करें।`;
    }
    return `**Instructions for your Income Certificate:**\n\n• **Status:** Action Required — ${actionReason}.\n• **Action to take:** Go to **Documents** in the bottom navigation, tap **Income certificate**, and upload your renewed certificate for FY 2026–27 to ensure smooth fund sanction.`;
  }

  // 4. Missing documents / Deficiencies / "How do I fix a deficiency?"
  if (
    q.includes('deficiency') || 
    q.includes('missing') || 
    q.includes('document') || 
    q.includes('certificate') || 
    q.includes('दस्तावेज़') || 
    q.includes('कागजात') || 
    q.includes('कमी')
  ) {
    if (isHindi) {
      return `नमस्ते ${studentName} जी। आपके दस्तावेज़ वॉल्ट की तैयारी **${readiness}** है (5 दस्तावेज़ सत्यापित):\n\n• **ध्यान देने योग्य दस्तावेज़:** ${actionDoc?.name || 'Income certificate'}\n• **कारण:** ${actionReason}\n\nइसे ठीक करने के लिए नीचे **Documents** मेन्यू में जाएं, **Income certificate** पर टैप करें और वित्तीय वर्ष 2026–27 का नया प्रमाण पत्र अपलोड करें।`;
    }
    return `Namaste ${studentName}. Your Document Vault readiness is **${readiness}** (5 of 6 documents verified):\n\n• **Action needed for:** ${actionDoc?.name || 'Income certificate'}\n• **Reason:** ${actionReason}\n\nTo fix this deficiency, go to **Documents** in the bottom menu, tap **Income certificate**, and upload your renewed certificate for FY 2026–27.`;
  }

  // 5. Why is payment pending? / Payment questions
  if (
    q.includes('payment') || 
    q.includes('pending') || 
    q.includes('rupee') || 
    q.includes('paisa') || 
    q.includes('पेमेंट') || 
    q.includes('रुपया') || 
    q.includes('पैसा') || 
    q.includes('भुगतान')
  ) {
    if (isHindi) {
      return `नमस्ते ${studentName} जी। आपके पेमेंट की स्थिति इस प्रकार है:\n\n• **प्राप्त राशि:** ₹${totalReceived} आपके ${bankName} खाते (${accountMask}) में 4 किस्तों में जमा हो चुकी है।\n• **लंबित राशि:** सितंबर महीने की अंतिम किस्त (₹${pendingAmount}) अभी सत्यापन में लंबित है।\n• **अगला कदम:** आपका आय प्रमाण पत्र समाप्त हो गया है। इसे 'Documents' में जाकर अपडेट कर लें ताकि स्वीकृति में देरी न हो।`;
    }
    return `Namaste ${studentName}. Here is your payment update:\n\n• **Total received:** ₹${totalReceived} has been credited to your ${bankName} account (${accountMask}) across 4 cycles.\n• **Pending installment:** ₹${pendingAmount} for September is currently marked as pending / in verification.\n• **Next step:** Your Income Certificate has expired. Updating it in your Document Wallet ensures your sanction order is processed without delay.`;
  }

  // 6. Where is my application now? / Status / Tracker
  if (
    q.includes('where') || 
    q.includes('status') || 
    q.includes('track') || 
    q.includes('stage') || 
    q.includes('progress') || 
    q.includes('कहाँ') || 
    q.includes('स्थिति')
  ) {
    if (q.includes('verification complete') || (q.includes('mean') && q.includes('verification'))) {
      if (isHindi) {
        return `**'Verification complete' का अर्थ:**\n\nआपके आवेदन की जाँच आपके कॉलेज और राज्य कल्याण विभाग द्वारा 15 जुलाई 2026 को सफलतापूर्वक पूरी कर ली गई है। अब आवेदन मंत्रालय के पास 'स्वीकृति' (Sanction Order) के लिए प्रक्रियाधीन है।`;
      }
      return `**What 'Verification complete' means:**\n\nIt means your application has successfully passed all verification checks by both your college and the State Tribal Welfare Department (completed on 15 Jul 2026). Your file is now awaiting the final fund sanction order from the ministry.`;
    }

    if (isHindi) {
      return `आपके **${schemeName}** आवेदन (ID: \`${appId}\`) की प्रगति **${progressPercent}%** है:\n\n• **वर्तमान चरण:** ${currentStage} (प्रक्रियाधीन)\n• **पूर्ण चरण:** आवेदन जमा (12 जून) → दस्तावेज़ जाँच (18 जून) → कॉलेज सत्यापन (2 जुलाई) → राज्य सत्यापन (15 जुलाई)।\n• **आगामी चरण:** स्वीकृति आदेश जारी होने के बाद ₹${pendingAmount} का अंतिम भुगतान डीबीटी द्वारा भेजा जाएगा।`;
    }
    return `Your application for **${schemeName}** (ID: \`${appId}\`) is **${progressPercent}% complete**:\n\n• **Current stage:** ${currentStage} (Under Process)\n• **Completed milestones:** Application Submitted (12 Jun) → Document Verification (18 Jun) → Institute Verification (2 Jul) → State Verification (15 Jul).\n• **Next step:** Once the Sanction Order is issued, your final payment of ₹${pendingAmount} will be released via DBT.`;
  }

  // 7. Am I eligible for this scholarship?
  if (
    q.includes('eligible') || 
    q.includes('eligibility') || 
    q.includes('पात्र') || 
    q.includes('योग्यता')
  ) {
    if (isHindi) {
      return `हाँ ${studentName} जी! आप **${community}** वर्ग के छात्र हैं और **${college}** में **${course}** की पढ़ाई कर रहे हैं। आप निम्नलिखित के लिए पात्र हैं:\n\n1. **पोस्ट-मैट्रिक छात्रवृत्ति (सक्रिय):** पूरी ट्यूशन फीस प्रतिपूर्ति और मासिक निर्वाह भत्ता।\n2. **राष्ट्रीय छात्रवृत्ति (उच्च शिक्षा):** प्रमुख संस्थानों में प्रवेश लेने पर।\n3. **राष्ट्रीय फेलोशिप:** भविष्य में एम.फिल या पीएच.डी. अनुसंधान के लिए।`;
    }
    return `Yes, ${studentName}! As a student belonging to the **${community}** community enrolled in **${course}** at **${college}**, you meet the criteria for:\n\n1. **Post-Matric Scholarship (Active):** Full mandatory non-refundable fees reimbursed + monthly maintenance allowance.\n2. **National Scholarship for Higher Education:** If admitted into notified premier institutions.\n3. **National Fellowship:** For full-time doctoral research scholars.\n\nYour annual family income under ₹2.5 Lakh also qualifies for the scheme.`;
  }

  // 8. What scholarship am I applying for?
  if (
    q.includes('scholarship am i') || 
    q.includes('what scholarship') || 
    q.includes('which scholarship') || 
    q.includes('योजना')
  ) {
    if (isHindi) {
      return `आप **${schemeName}** (Post-Matric Scholarship for ST Students) के लिए आवेदन कर रहे हैं। आपकी आवेदन आईडी \`${appId}\` है।`;
    }
    return `You are currently applying for the **${schemeName}** (Application ID: \`${appId}\`).`;
  }

  // 9. Application ID inquiry
  if (
    q.includes('application id') || 
    q.includes('app id') || 
    q.includes('application number')
  ) {
    return `Your Application ID is **\`${appId}\`** for the ${schemeName} (Student ID: \`${studentId}\`).`;
  }

  // 10. "What should I do next?" / Action steps
  if (
    q.includes('what should i do') || 
    q.includes('next step') || 
    q.includes('action') || 
    q.includes('क्या करना') || 
    q.includes('अगला कदम')
  ) {
    if (lastBotMsg.includes('payment')) {
      return `For your pending payment of ₹${pendingAmount}, the best action right now is to renew your **Income Certificate** in the Document Wallet. Once the sanction order is issued, the payment will be credited automatically.`;
    }
    return `Your immediate next step in Sahayak:\n\n1. Open **Documents** from the bottom bar.\n2. Tap on **Income certificate** (Action needed).\n3. Upload your renewed certificate for FY 2026–27 to ensure your sanction proceeds smoothly.`;
  }

  // 11. Unrelated questions
  if (['hostel', 'room', 'bus', 'food', 'mess', 'exam time', 'holiday', 'weather', 'cricket'].some(word => q.includes(word))) {
    return `I don't have information about that in your Sahayak scholarship records. For institute-specific inquiries (like hostels, classes, or fee schedules), please contact your college administration at ${college} or call the MoTA toll-free helpline at 1800-11-7777.`;
  }

  // 12. Default greeting & assistance menu
  if (isHindi) {
    return `नमस्ते ${studentName} जी! मैं आपका सहायक रोबोट JAGO हूँ।\n\nआप मुझसे पूछ सकते हैं:\n• मेरा पेमेंट क्यों रुका हुआ है? (₹${pendingAmount})\n• कौन से दस्तावेज़ की आवश्यकता है? (आय प्रमाण पत्र)\n• मेरा आवेदन कहाँ तक पहुँचा है? (${currentStage})\n• क्या मैं पात्र हूँ?\n\nनीचे दिए गए सुझावों पर टैप करें या अपना प्रश्न लिखें!`;
  }
  return `Namaste ${studentName}! I am JAGO, your scholarship guide for the ${schemeName}.\n\nI can help explain:\n• Why your payment is pending (₹${pendingAmount})\n• Which document needs attention (Income Certificate renewal)\n• Your current stage (${currentStage})\n• Your scheme eligibility\n\nTap one of the suggestion chips or ask any question about your scholarship!`;
}
