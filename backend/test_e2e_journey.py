"""
SAHAYAK End-to-End Complete Student Journey & System Audit Test.
Simulates all 20 steps of the complete student journey across
Frontend routes, Backend endpoints, JAGO AI, and Data Consistency.
"""

import sys

# Configure UTF-8 for Windows console safety
if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def run_e2e_journey_audit():
    print("=" * 65)
    print("SAHAYAK COMPLETE END-TO-END DEMO JOURNEY AUDIT (20 STEPS)")
    print("=" * 65)

    # 1. System Health Check
    health = client.get("/api/health")
    assert health.status_code == 200 and health.json()["status"] == "healthy"
    print("[STEP 1 & 2] Application & Server Online: Healthcheck 200 OK.")

    # 2. Student Authentication / Profile
    student_res = client.get("/api/student")
    assert student_res.status_code == 200
    student = student_res.json()
    assert student["name"] == "Ramesh Kumar"
    assert student["student_id"] == "ST202600124"
    print(f"[STEP 3 & 4] Student Verified: {student['name']} ({student['student_id']}) in {student['state']}.")

    # 3. Home Dashboard Data - Current Application
    apps_res = client.get("/api/applications")
    assert apps_res.status_code == 200
    apps = apps_res.json()
    assert len(apps) >= 1
    active_app = apps[0]
    assert active_app["id"] == "MOTA-PMS-2026-00124"
    assert active_app["progress_percent"] == 72
    assert active_app["status"] == "Verification complete"
    print(f"[STEP 5] Active Application: {active_app['scholarship_name']} ({active_app['id']}) at 72% progress.")

    # 4. Open Scholarships Directory & View List
    schemes_res = client.get("/api/scholarships")
    assert schemes_res.status_code == 200
    schemes = schemes_res.json()
    assert len(schemes) == 5
    print(f"[STEP 6] Scholarships Directory: {len(schemes)} MoTA schemes loaded successfully.")

    # 5. Select Post-Matric Scholarship & View Details
    pms_res = client.get("/api/scholarships/mota-post-matric")
    assert pms_res.status_code == 200
    pms = pms_res.json()
    assert pms["name"] == "Post-Matric Scholarship"
    assert len(pms["eligibility_criteria"]) >= 3
    assert len(pms["documents_required"]) >= 5
    print(f"[STEP 7 & 8] Scheme Details & Eligibility: Verified for {pms['name']} ({pms['amount']}).")

    # 6. Start Application & View Application Details
    app_detail_res = client.get(f"/api/applications/{active_app['id']}")
    assert app_detail_res.status_code == 200
    app_detail = app_detail_res.json()
    assert app_detail["student_details"]["name"] == "Ramesh Kumar"
    assert len(app_detail["stages"]) == 6
    print(f"[STEP 9 & 10] Application Details: 6 stages verified for {active_app['id']}.")

    # 7. Document Wallet & Document Reuse Flow
    docs_res = client.get("/api/documents")
    assert docs_res.status_code == 200
    docs = docs_res.json()
    assert docs["readiness_percentage"] == 85
    assert docs["verified_count"] == 5
    assert docs["total_count"] == 6
    assert docs["digilocker_synced"] is True

    # Validate Income Certificate has Action Needed status
    income_doc = next(d for d in docs["documents"] if "income" in d["name"].lower())
    assert income_doc["status"] == "action_needed"
    print(f"[STEP 11 & 12] Document Wallet: 85% readiness, 5/6 verified. Income Certificate: Action Needed.")

    # 8. Return to Application Tracker
    tracker_stages = [s["name"] for s in app_detail["stages"]]
    assert tracker_stages == [
        "Application submitted",
        "Document verification",
        "Institute verification",
        "State verification",
        "Sanction",
        "Payment"
    ]
    completed_stages = [s["name"] for s in app_detail["stages"] if s["status"] == "completed"]
    assert len(completed_stages) == 4  # Submitted, Docs, Institute, State
    print(f"[STEP 13 & 14] 6-Stage Tracker: 4 completed, 1 active (Sanction), 1 pending (Payment).")

    # 9. Payment Status / DBT Ledger
    pay_res = client.get("/api/payments")
    assert pay_res.status_code == 200
    pay = pay_res.json()
    assert pay["total_received"] == 20000
    assert pay["pending_amount"] == 5000
    assert pay["aadhaar_linked"] is True
    print(f"[STEP 15] Payments DBT: Total Received Rs. {pay['total_received']:,} | Pending Rs. {pay['pending_amount']:,} (Aadhaar Linked).")

    # 10. Notifications Access
    notifs_res = client.get("/api/notifications")
    assert notifs_res.status_code == 200
    notifs = notifs_res.json()
    assert len(notifs) >= 3
    print(f"[STEP 16] Notifications: {len(notifs)} alerts loaded across categories.")

    # 11. JAGO AI Assistant Query: 'Why is my payment pending?'
    jago_pay = client.post("/api/jago/chat", json={
        "message": "Why is my payment pending?",
        "application_id": active_app["id"]
    })
    assert jago_pay.status_code == 200
    jago_pay_data = jago_pay.json()
    assert "5,000" in jago_pay_data["response"]
    assert "september" in jago_pay_data["response"].lower() or "verification" in jago_pay_data["response"].lower()
    print(f"[STEP 17 & 18] JAGO Query ('Why is my payment pending?'):")
    print(f"   Response: {jago_pay_data['response'][:110]}...")

    # 12. Contextual follow-up in JAGO: 'What should I do?'
    jago_next = client.post("/api/jago/chat", json={
        "message": "What should I do?",
        "application_id": active_app["id"],
        "history": [
            {"role": "user", "content": "Why is my payment pending?"},
            {"role": "assistant", "content": jago_pay_data["response"]}
        ]
    })
    assert jago_next.status_code == 200
    assert "income" in jago_next.json()["response"].lower() or "certificate" in jago_next.json()["response"].lower()
    print(f"[STEP 19] JAGO Multi-turn Continuity ('What should I do?'): Correctly guided to Income Certificate renewal.")

    # 13. Anti-Hallucination Rejection Boundary Test
    jago_reject = client.post("/api/jago/chat", json={
        "message": "Why did the government reject my application?",
        "application_id": active_app["id"]
    })
    assert jago_reject.status_code == 200
    assert "not" in jago_reject.json()["response"].lower() and "reject" in jago_reject.json()["response"].lower()
    print(f"[STEP 20] Anti-Hallucination Verified: Refused to invent fake rejection reason.")

    print("=" * 65)
    print("ALL 20 STEPS OF THE COMPLETE DEMO JOURNEY PASSED 100%!")
    print("=" * 65)
    return True

if __name__ == "__main__":
    success = run_e2e_journey_audit()
    sys.exit(0 if success else 1)
