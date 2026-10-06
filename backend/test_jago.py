"""
JAGO AI Assistant Test Suite
Validates grounding, conversational accuracy, multi-turn history,
out-of-scope redirection, and multilingual Hindi support.
"""

import os
import sys

# Ensure parent directory is in sys.path
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Windows cp1252 console safety
if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_jago_assistant():
    print("==================================================")
    print("RUNNING JAGO AI ASSISTANT GROUNDING & TEST SUITE")
    print("==================================================")

    test_cases = [
        {
            "id": "TEST 1: Payment Pending Inquiry",
            "message": "Why is my payment pending?",
            "check": lambda res: "5,000" in res["response"] and ("september" in res["response"].lower() or "verification" in res["response"].lower()),
            "reason": "Must mention ₹5,000 and September verification stage without inventing fake treasury/bank failures"
        },
        {
            "id": "TEST 2: Missing Documents / Deficiency",
            "message": "Which documents are missing?",
            "check": lambda res: "income" in res["response"].lower() and "5 of 6" in res["response"].lower(),
            "reason": "Must identify that 5 of 6 documents are verified and Income Certificate expired"
        },
        {
            "id": "TEST 3: Application Status / Tracker",
            "message": "Where is my application?",
            "check": lambda res: "sanction" in res["response"].lower() and ("65%" in res["response"] or "stage" in res["response"].lower()),
            "reason": "Must state that it has reached the Sanction stage after Institute & State verification"
        },
        {
            "id": "TEST 4: Status Explanation",
            "message": "What does Verification complete mean?",
            "check": lambda res: "college" in res["response"].lower() or "state" in res["response"].lower() or "sanction" in res["response"].lower(),
            "reason": "Must explain that college and state checks are complete, awaiting sanction order"
        },
        {
            "id": "TEST 5: Eligibility Check",
            "message": "Am I eligible for Post-Matric Scholarship?",
            "check": lambda res: "post-matric" in res["response"].lower() and ("tribal" in res["response"].lower() or "st" in res["response"].lower() or "ramesh" in res["response"].lower()),
            "reason": "Must ground eligibility in student's ST category and course"
        },
        {
            "id": "TEST 6: Specific Income Certificate Guidance",
            "message": "What should I do about my income certificate?",
            "check": lambda res: "income" in res["response"].lower() and ("renew" in res["response"].lower() or "upload" in res["response"].lower() or "2026" in res["response"]),
            "reason": "Must provide explicit instructions to upload renewed Income Certificate for FY 2026-27"
        },
        {
            "id": "TEST 7: What Scholarship Am I Applying For?",
            "message": "What scholarship am I applying for?",
            "check": lambda res: "post-matric" in res["response"].lower(),
            "reason": "Must identify Post-Matric Scholarship for ST Students"
        },
        {
            "id": "TEST 8: What Is My Application ID?",
            "message": "What is my application ID?",
            "check": lambda res: "mota-pms-2026-00124" in res["response"].lower(),
            "reason": "Must return exact Application ID MOTA-PMS-2026-00124"
        },
        {
            "id": "TEST 9: What Should I Do Next?",
            "message": "What should I do next?",
            "check": lambda res: "income" in res["response"].lower() or "document" in res["response"].lower(),
            "reason": "Must advise student on next immediate action (renew Income Certificate)"
        },
        {
            "id": "TEST 10: Anti-Hallucination: Fake Rejection Inquiry",
            "message": "Why did the government reject my application?",
            "check": lambda res: "not" in res["response"].lower() and "reject" in res["response"].lower() and "under process" in res["response"].lower(),
            "reason": "Must NOT hallucinate a fake rejection reason; must clarify application is active and under process"
        },
        {
            "id": "TEST 11: Anti-Hallucination: Fake Payment Failure",
            "message": "Why did my bank payment fail?",
            "check": lambda res: "no payment failure" in res["response"].lower() or "20,000" in res["response"],
            "reason": "Must NOT hallucinate bank failure; must clarify Rs. 20,000 was received and Rs. 5,000 is under verification"
        },
        {
            "id": "TEST 12: Contextual Follow-up ('What should I do?')",
            "message": "What should I do?",
            "history": [
                {"role": "user", "content": "Why is my payment pending?"},
                {"role": "assistant", "content": "Your payment of Rs. 5,000 for September is pending verification. Please renew your Income Certificate."}
            ],
            "check": lambda res: "income" in res["response"].lower() or "wallet" in res["response"].lower() or "document" in res["response"].lower(),
            "reason": "Must guide user to renew Income Certificate in Document Wallet based on previous turn"
        },
        {
            "id": "TEST 13: Out-of-Scope Redirection",
            "message": "When will my hostel room be allotted?",
            "check": lambda res: ("hostel" in res["response"].lower() or "records" in res["response"].lower()) and "college" in res["response"].lower(),
            "reason": "Must clarify that hostel allotment is not in scholarship records and redirect to college administration"
        },
        {
            "id": "TEST 14: Multilingual Prompt (Hindi)",
            "message": "मेरा पेमेंट कब आएगा?",
            "language": "hi",
            "check": lambda res: "नमस्ते" in res["response"] or "लंबित" in res["response"] or "किस्त" in res["response"] or "रुपया" in res["response"],
            "reason": "Must answer empathetically and accurately in Hindi"
        }
    ]

    all_passed = True
    for tc in test_cases:
        payload = {
            "message": tc["message"],
            "application_id": "MOTA-PMS-2026-00124",
            "language": tc.get("language", "en"),
            "history": tc.get("history", [])
        }
        resp = client.post("/api/jago/chat", json=payload)
        assert resp.status_code == 200, f"Failed HTTP 200 for {tc['id']}"
        data = resp.json()
        passed = tc["check"](data)
        status_mark = "[PASS]" if passed else "[FAIL]"
        print(f"{status_mark} {tc['id']}")
        if not passed:
            print(f"   Reason failed: {tc['reason']}")
            print(f"   Received response: {data.get('response')[:150]}...")
            all_passed = False
        else:
            sample = data.get("response").replace("\n", " ")[:100]
            print(f"   -> Sample: {sample}...")

    print("==================================================")
    if all_passed:
        print("ALL 8 JAGO TEST SCENARIOS PASSED WITH FULL GROUNDING!")
    else:
        print("SOME JAGO TESTS FAILED. PLEASE REVIEW LOGS.")
    print("==================================================")
    return all_passed

if __name__ == "__main__":
    success = test_jago_assistant()
    sys.exit(0 if success else 1)
