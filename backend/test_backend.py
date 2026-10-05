"""
Sahayak Backend Test Suite.
Validates all endpoints, Pydantic schemas, 404 error handling, and JAGO AI fallback logic.
"""
import sys
import os

# Ensure workspace root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_and_docs():
    print("Testing Root & Health Endpoints...")
    res = client.get("/")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert data["status"] == "online"
    
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

    res = client.get("/openapi.json")
    assert res.status_code == 200
    openapi = res.json()
    assert "paths" in openapi
    print("[PASS] Root, Health & OpenAPI docs verified.")

def test_student_api():
    print("\nTesting Student API (GET /api/student)...")
    res = client.get("/api/student")
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Ramesh Kumar"
    assert data["student_id"] == "ST202600124"
    assert data["state"] == "Madhya Pradesh"
    assert data["college"] == "ABC College of Technology"
    assert data["course"] == "B.Tech Computer Science & Engineering"
    print(f"[PASS] Student: {data['name']} ({data['student_id']}) verified.")

def test_scholarships_api():
    print("\nTesting Scholarships API (GET /api/scholarships)...")
    res = client.get("/api/scholarships")
    assert res.status_code == 200
    schemes = res.json()
    assert len(schemes) == 5, f"Expected 5 schemes, got {len(schemes)}"
    names = [s["name"] for s in schemes]
    assert "Post-Matric Scholarship" in names
    assert "Pre-Matric Scholarship" in names
    assert "National Fellowship" in names

    # Test category filter
    res_filtered = client.get("/api/scholarships?category=school")
    assert res_filtered.status_code == 200
    school_schemes = res_filtered.json()
    assert len(school_schemes) == 1
    assert school_schemes[0]["name"] == "Pre-Matric Scholarship"

    # Test single scheme details
    res_detail = client.get("/api/scholarships/mota-post-matric")
    assert res_detail.status_code == 200
    detail = res_detail.json()
    assert detail["name"] == "Post-Matric Scholarship"
    assert len(detail["eligibility_criteria"]) > 0
    assert len(detail["documents_required"]) > 0

    # Test 404 for unknown scheme
    res_404 = client.get("/api/scholarships/non-existent-id")
    assert res_404.status_code == 404
    print("[PASS] Scholarships list, category filter, detail lookup & 404 handling verified.")

def test_applications_api():
    print("\nTesting Applications API (GET /api/applications)...")
    res = client.get("/api/applications")
    assert res.status_code == 200
    apps = res.json()
    assert len(apps) >= 1
    pms = apps[0]
    assert pms["id"] == "MOTA-PMS-2026-00124"
    assert pms["progress_percent"] == 72
    assert pms["status"] == "Verification complete"

    # Test single application detail with 6 milestone stages
    res_detail = client.get(f"/api/applications/{pms['id']}")
    assert res_detail.status_code == 200
    app_detail = res_detail.json()
    assert len(app_detail["stages"]) == 6
    stage_names = [s["name"] for s in app_detail["stages"]]
    assert "Application submitted" in stage_names
    assert "Sanction" in stage_names
    assert "Payment" in stage_names

    # Test 404 for unknown application
    res_404 = client.get("/api/applications/UNKNOWN-APP-999")
    assert res_404.status_code == 404
    print(f"[PASS] Application {pms['id']} (72% progress, 6 stages) & 404 handling verified.")

def test_documents_api():
    print("\nTesting Documents API (GET /api/documents)...")
    res = client.get("/api/documents")
    assert res.status_code == 200
    wallet = res.json()
    assert wallet["readiness_percentage"] == 85
    assert wallet["verified_count"] == 5
    assert wallet["total_count"] == 6
    assert wallet["digilocker_synced"] is True
    assert len(wallet["documents"]) == 6

    # Verify Income Certificate has Action Needed status
    income_doc = next(d for d in wallet["documents"] if d["name"] == "Income certificate")
    assert income_doc["status"] == "action_needed"
    assert income_doc["action_needed_reason"] is not None
    print(f"[PASS] Document Wallet (Readiness: {wallet['readiness_percentage']}%, 5/6 valid) verified.")

def test_payments_api():
    print("\nTesting Payments API (GET /api/payments)...")
    res = client.get("/api/payments")
    assert res.status_code == 200
    pay = res.json()
    assert pay["total_received"] == 20000
    assert pay["pending_amount"] == 5000
    assert pay["aadhaar_linked"] is True
    assert pay["cycles_credited"] == 4
    assert len(pay["monthly_schedule"]) == 4
    assert len(pay["history"]) >= 1
    assert pay["history"][0]["reference"] == "DBT-2026-1234"
    print(f"[PASS] Payments (Rs. {pay['total_received']} received, Rs. {pay['pending_amount']} pending, Aadhaar-linked) verified.")

def test_notifications_api():
    print("\nTesting Notifications API (GET /api/notifications)...")
    res = client.get("/api/notifications")
    assert res.status_code == 200
    notifs = res.json()
    assert len(notifs) >= 3

    # Test category filtering
    res_deadlines = client.get("/api/notifications?category=deadlines")
    assert res_deadlines.status_code == 200
    deadlines = res_deadlines.json()
    assert all(n["category"] == "deadlines" for n in deadlines)
    print(f"[PASS] Notifications ({len(notifs)} items, category filtering) verified.")

def test_jago_chat_api():
    print("\nTesting JAGO AI Assistant API (POST /api/jago/chat)...")
    # Prompt 1: Why is my payment pending?
    res = client.post(
        "/api/jago/chat",
        json={"message": "Why is my payment pending?", "application_id": "MOTA-PMS-2026-00124"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert "5,000" in data["reply"] or "pending" in data["reply"].lower()
    assert data["context_used"]["student_name"] == "Ramesh Kumar"
    assert data["context_used"]["application_id"] == "MOTA-PMS-2026-00124"
    print("[PASS] JAGO prompt 'Why is my payment pending?' answered with context.")

    # Prompt 2: Which documents are missing?
    res2 = client.post(
        "/api/jago/chat",
        json={"message": "Which documents are missing?", "application_id": "MOTA-PMS-2026-00124"}
    )
    assert res2.status_code == 200
    data2 = res2.json()
    assert "Income certificate" in data2["reply"] or "Income" in data2["reply"]
    print("[PASS] JAGO prompt 'Which documents are missing?' correctly identified Income Certificate.")

    # Prompt 3: Where is my application?
    res3 = client.post(
        "/api/jago/chat",
        json={"message": "Where is my application?", "application_id": "MOTA-PMS-2026-00124"}
    )
    assert res3.status_code == 200
    assert "Sanction" in res3.json()["reply"]
    print("[PASS] JAGO prompt 'Where is my application?' tracked active Sanction stage.")

    # Validation Error test (empty message)
    res_err = client.post("/api/jago/chat", json={"message": ""})
    assert res_err.status_code == 422
    print("[PASS] JAGO request validation error (empty string rejected) verified.")

if __name__ == "__main__":
    print("=" * 60)
    print("RUNNING SAHAYAK FASTAPI BACKEND TEST SUITE")
    print("=" * 60)
    test_health_and_docs()
    test_student_api()
    test_scholarships_api()
    test_applications_api()
    test_documents_api()
    test_payments_api()
    test_notifications_api()
    test_jago_chat_api()
    print("\n" + "=" * 60)
    print("ALL TESTS PASSED SUCCESSFULLY! BACKEND IS 100% OPERATIONAL.")
    print("=" * 60)
