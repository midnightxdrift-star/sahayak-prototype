"""
Structured Mock Data for SAHAYAK.
Strictly mirrors the 14 Stitch prototype screens and is database-ready.
"""

STUDENT_DATA = {
    "id": "ST202600124",
    "student_id": "ST202600124",
    "name": "Ramesh Kumar",
    "phone": "+91 98765 43210",
    "community": "Scheduled Tribe (Gond)",
    "state": "Madhya Pradesh",
    "college": "ABC College of Technology",
    "course": "B.Tech Computer Science & Engineering",
    "academic_year": "2026–27",
    "language_preference": "hi",
    "avatar_url": None
}

SCHOLARSHIPS_DATA = [
    {
        "id": "mota-pre-matric",
        "name": "Pre-Matric Scholarship",
        "short_description": "For students studying up to Class X.",
        "category": "school",
        "amount": "Up to ₹10,000/year",
        "academic_year": "2026–27",
        "application_period": "Open for 2026–27 (Closes 30 Nov 2026)",
        "is_open": True,
        "icon_type": "school",
        "who_is_it_for": "ST students studying up to Class X.",
        "what_you_need": "School certificates, caste certificate and bank passbook.",
        "eligibility_criteria": [
            "Student must belong to a notified Scheduled Tribe community.",
            "Enrolled full-time in Class IX or X in a government or recognized school.",
            "Annual family income from all sources must not exceed ₹2.5 Lakh per annum.",
            "Student should not be holding any other government pre-matric scholarship."
        ],
        "documents_required": [
            "Aadhaar Card",
            "ST Community Certificate",
            "Parental Income Certificate",
            "Class VIII Marksheet",
            "Student Bank Account Passbook",
            "Passport Size Photograph"
        ],
        "benefits": [
            "Day scholar allowance of ₹2,250 per annum",
            "Hosteller allowance of ₹5,250 per annum",
            "Additional book and uniform allowance"
        ]
    },
    {
        "id": "mota-post-matric",
        "name": "Post-Matric Scholarship",
        "short_description": "For students continuing education after Class X.",
        "category": "college",
        "amount": "Up to ₹25,000/year + Maintenance",
        "academic_year": "2026–27",
        "application_period": "Open for 2026–27 (Closes 31 Dec 2026)",
        "is_open": True,
        "icon_type": "college",
        "who_is_it_for": "ST students pursuing Class XI and above.",
        "what_you_need": "Certificates, academic records and bank details.",
        "eligibility_criteria": [
            "Student must belong to a Scheduled Tribe community.",
            "Enrolled in post-matriculation or post-secondary courses (Classes XI, XII, ITI, Diploma, Degree, PG).",
            "Total annual parental/family income must not exceed ₹2.50 Lakh per annum.",
            "Valid bank account seeded with Aadhaar for Direct Benefit Transfer (DBT)."
        ],
        "documents_required": [
            "Aadhaar Card",
            "ST Community Certificate",
            "Income Certificate (FY 2026–27)",
            "Class X / XII Marksheet",
            "Current Course Admission & Fee Receipt",
            "Bank Passbook / Statement",
            "Passport Size Photograph"
        ],
        "benefits": [
            "100% compulsory non-refundable fees reimbursed directly to institution",
            "Monthly living allowance of up to ₹1,200 for hostellers / ₹550 for day scholars",
            "Book grant and study tour allowances for technical courses"
        ]
    },
    {
        "id": "mota-national-scholarship",
        "name": "National Scholarship",
        "short_description": "For higher education students in premier institutes.",
        "category": "college",
        "amount": "Full Tuition + ₹3,000/mo Living",
        "academic_year": "2026–27",
        "application_period": "Open for 2026–27 (Closes 15 Jan 2027)",
        "is_open": True,
        "icon_type": "certificate",
        "who_is_it_for": "ST students admitted to premier notified institutes.",
        "what_you_need": "Admission proof, fee schedule, certificates.",
        "eligibility_criteria": [
            "ST student who has secured admission in any of the 246 notified institutes of excellence (IIT, IIM, NIT, AIIMS, NLU, etc.).",
            "Family income ceiling up to ₹6.0 Lakh per annum.",
            "Scholarship continues until completion of the course subject to satisfactory academic performance."
        ],
        "documents_required": [
            "Aadhaar Card",
            "ST Certificate issued by competent authority",
            "Income Certificate",
            "Institute Admission Offer Letter",
            "Fee Structure on Institute Letterhead",
            "Bank Details (Aadhaar linked)"
        ],
        "benefits": [
            "Full tuition fee and non-refundable charges reimbursed (up to ₹2.0 Lakhs in private institutes)",
            "Living allowance of ₹3,000 per month",
            "Books and stationery allowance of ₹5,000 per annum",
            "One-time computer/laptop grant of ₹45,000"
        ]
    },
    {
        "id": "mota-national-fellowship",
        "name": "National Fellowship",
        "short_description": "For research and higher studies (M.Phil / Ph.D).",
        "category": "fellowship",
        "amount": "₹31,000 – ₹35,000/month + HRA",
        "academic_year": "2026–27",
        "application_period": "Open for 2026–27 (Closes 28 Feb 2027)",
        "is_open": True,
        "icon_type": "research",
        "who_is_it_for": "ST research scholars pursuing doctoral studies.",
        "what_you_need": "Research registration, university verification, certificates.",
        "eligibility_criteria": [
            "ST candidate who has qualified UGC-NET / CSIR-NET or secured regular admission to M.Phil/Ph.D.",
            "Candidate must have completed Post Graduation with at least 55% marks.",
            "No family income limit for fellowship selection."
        ],
        "documents_required": [
            "Aadhaar Card",
            "ST Certificate",
            "Master's Degree Certificate and Consolidated Marksheet",
            "Ph.D. / M.Phil Registration Confirmation Letter",
            "Research Guide/Supervisor Recommendation",
            "Bank Account Passbook"
        ],
        "benefits": [
            "JRF: ₹31,000/month for first two years",
            "SRF: ₹35,000/month for remaining three years",
            "House Rent Allowance (HRA) as per central government norms",
            "Contingency grant of up to ₹25,000/year for science scholars"
        ]
    },
    {
        "id": "mota-national-overseas",
        "name": "National Overseas Scholarship",
        "short_description": "For higher studies abroad in reputed foreign universities.",
        "category": "fellowship",
        "amount": "Full Tuition + $15,400/yr Living",
        "academic_year": "2026–27",
        "application_period": "Open for 2026–27 (Closes 31 Mar 2027)",
        "is_open": True,
        "icon_type": "globe",
        "who_is_it_for": "ST students pursuing postgraduate studies abroad.",
        "what_you_need": "Valid passport, unconditional admission offer, academic transcripts.",
        "eligibility_criteria": [
            "ST candidate with at least 60% marks or equivalent grade in qualifying degree.",
            "Must have secured unconditional admission in top 500 QS World Ranking university.",
            "Total family income must be under ₹8.0 Lakh per annum.",
            "Age limit below 35 years as on 1st April of selection year."
        ],
        "documents_required": [
            "Aadhaar Card",
            "ST Certificate",
            "Valid Indian Passport",
            "Unconditional Foreign University Admission Letter",
            "GRE / GMAT / IELTS / TOEFL Scorecard",
            "Family Income Certificate",
            "All Undergraduate and Postgraduate Marksheets"
        ],
        "benefits": [
            "Complete actual tuition fee directly paid to foreign university",
            "Annual maintenance allowance of US $15,400 (or £9,900 for UK)",
            "Return economy class airfare",
            "Contingency allowance, visa fees, and medical insurance coverage"
        ]
    }
]

APPLICATIONS_DATA = [
    {
        "id": "MOTA-PMS-2026-00124",
        "student_id": "ST202600124",
        "scholarship_id": "mota-post-matric",
        "scholarship_name": "Post-Matric Scholarship",
        "academic_year": "2026–27",
        "progress_percent": 72,
        "status": "Verification complete",
        "current_stage": "Sanction",
        "sanction_status": "Pending",
        "payment_status": "Pending",
        "submitted_date": "12 Jun 2026",
        "last_updated": "15 Jul 2026",
        "action_needed": "Income Certificate requires renewal (expired on 14 Aug 2026). Upload valid certificate to expedite sanction.",
        "stages": [
            {
                "stage_id": 1,
                "name": "Application submitted",
                "date": "12 Jun 2026",
                "status": "completed",
                "description": "Your application has been submitted successfully."
            },
            {
                "stage_id": 2,
                "name": "Document verification",
                "date": "18 Jun 2026",
                "status": "completed",
                "description": "All documents verified."
            },
            {
                "stage_id": 3,
                "name": "Institute verification",
                "date": "2 Jul 2026",
                "status": "completed",
                "description": "Verified by your institution."
            },
            {
                "stage_id": 4,
                "name": "State verification",
                "date": "15 Jul 2026",
                "status": "completed",
                "description": "Verified by state authority."
            },
            {
                "stage_id": 5,
                "name": "Sanction",
                "date": "Pending",
                "status": "active",
                "description": "Under process."
            },
            {
                "stage_id": 6,
                "name": "Payment",
                "date": "Pending",
                "status": "pending",
                "description": "Will be updated soon."
            }
        ],
        "student_details": {
            "name": "Ramesh Kumar",
            "student_id": "ST202600124",
            "college": "ABC College of Technology",
            "course": "B.Tech Computer Science (3rd Year)",
            "community": "Scheduled Tribe",
            "state": "Madhya Pradesh"
        },
        "submitted_documents": [
            {"name": "Aadhaar Card", "status": "Verified", "doc_ref": "•••• 4029"},
            {"name": "ST Certificate", "status": "Verified", "doc_ref": "TRB/2021/8834"},
            {"name": "Income Certificate", "status": "Action Needed", "doc_ref": "INC-2025-9921"},
            {"name": "Marksheet (Semester IV)", "status": "Verified", "doc_ref": "CGPA 8.2"},
            {"name": "Bank Details", "status": "Verified", "doc_ref": "SBI •••• 6712"},
            {"name": "Passport Photo", "status": "Verified", "doc_ref": "Uploaded"}
        ],
        "notes": "Application cleared State Verification on 15 Jul 2026. Forwarded to Ministry Sanction Committee for fund allocation."
    }
]

DOCUMENTS_DATA = {
    "readiness_percentage": 85,
    "verified_count": 5,
    "total_count": 6,
    "digilocker_synced": True,
    "documents": [
        {
            "id": "doc-1",
            "name": "Aadhaar card",
            "type": "aadhaar",
            "status": "verified",
            "uploaded_at": "10 Jun 2026",
            "doc_number": "Linked to •••• 4029",
            "digilocker_verified": True,
            "action_needed_reason": None,
            "file_size": "420 KB"
        },
        {
            "id": "doc-2",
            "name": "ST certificate",
            "type": "st_certificate",
            "status": "verified",
            "uploaded_at": "12 Jun 2026",
            "doc_number": "Reg: TRB/2021/8834",
            "digilocker_verified": True,
            "action_needed_reason": None,
            "file_size": "1.1 MB"
        },
        {
            "id": "doc-3",
            "name": "Income certificate",
            "type": "income_certificate",
            "status": "action_needed",
            "uploaded_at": "15 Aug 2025",
            "doc_number": "Uploaded 15 Aug 2025",
            "digilocker_verified": False,
            "action_needed_reason": "Certificate has completed 1 year validity. Please upload fresh certificate for FY 2026–27.",
            "file_size": "850 KB"
        },
        {
            "id": "doc-4",
            "name": "Marksheet",
            "type": "marksheet",
            "status": "verified",
            "uploaded_at": "10 Jun 2026",
            "doc_number": "B.Tech Marksheet (Sem IV)",
            "digilocker_verified": True,
            "action_needed_reason": None,
            "file_size": "1.4 MB"
        },
        {
            "id": "doc-5",
            "name": "Bank details",
            "type": "bank_details",
            "status": "verified",
            "uploaded_at": "10 Jun 2026",
            "doc_number": "State Bank of India",
            "digilocker_verified": True,
            "action_needed_reason": None,
            "file_size": "310 KB"
        },
        {
            "id": "doc-6",
            "name": "Passport photo",
            "type": "passport_photo",
            "status": "verified",
            "uploaded_at": "10 Jun 2026",
            "doc_number": "Photo_Ramesh.jpg",
            "digilocker_verified": False,
            "action_needed_reason": None,
            "file_size": "180 KB"
        }
    ]
}

PAYMENTS_DATA = {
    "aadhaar_linked": True,
    "total_received": 20000,
    "pending_amount": 5000,
    "cycles_credited": 4,
    "cadence_monthly": 5000,
    "bank_name": "State Bank of India",
    "account_mask": "•••• 6712",
    "monthly_schedule": [
        {"month": "Jun", "amount": 5000, "status": "disbursed"},
        {"month": "Jul", "amount": 5000, "status": "disbursed"},
        {"month": "Aug", "amount": 5000, "status": "disbursed"},
        {"month": "Sep", "amount": 5000, "status": "in_verification"}
    ],
    "history": [
        {
            "id": "tx-1",
            "amount": 5000,
            "status": "paid",
            "date": "12 Aug 2026",
            "reference": "DBT-2026-1234",
            "scheme_name": "Post-Matric Scholarship Scheme"
        },
        {
            "id": "tx-2",
            "amount": 5000,
            "status": "paid",
            "date": "10 Jul 2026",
            "reference": "DBT-2026-0981",
            "scheme_name": "Post-Matric Scholarship Scheme"
        },
        {
            "id": "tx-3",
            "amount": 5000,
            "status": "paid",
            "date": "12 Jun 2026",
            "reference": "DBT-2026-0645",
            "scheme_name": "Post-Matric Scholarship Scheme"
        },
        {
            "id": "tx-4",
            "amount": 5000,
            "status": "paid",
            "date": "14 May 2026",
            "reference": "DBT-2026-0312",
            "scheme_name": "Post-Matric Scholarship Scheme"
        }
    ]
}

NOTIFICATIONS_DATA = [
    {
        "id": "notif-1",
        "category": "deadlines",
        "title": "Income Certificate Renewal Needed",
        "message": "Your uploaded income certificate has crossed 1 year validity. Please upload your renewed FY 2026–27 certificate in Document Wallet to avoid disbursement hold.",
        "timestamp": "2 hours ago",
        "is_read": False,
        "action_url": "/documents"
    },
    {
        "id": "notif-2",
        "category": "status",
        "title": "State Verification Complete",
        "message": "Great news! Your Post-Matric Scholarship application was successfully approved by the State Tribal Welfare Department.",
        "timestamp": "15 Jul 2026",
        "is_read": True,
        "action_url": "/tracker"
    },
    {
        "id": "notif-3",
        "category": "payments",
        "title": "August DBT Installment Credited",
        "message": "₹5,000 has been credited directly to your Aadhaar-linked State Bank of India account (Ref: DBT-2026-1234).",
        "timestamp": "12 Aug 2026",
        "is_read": True,
        "action_url": "/payments"
    },
    {
        "id": "notif-4",
        "category": "system",
        "title": "DigiLocker Sync Active",
        "message": "5 of your documents are verified and secured via DigiLocker. Ready for one-click reuse.",
        "timestamp": "10 Jun 2026",
        "is_read": True,
        "action_url": "/documents"
    }
]
