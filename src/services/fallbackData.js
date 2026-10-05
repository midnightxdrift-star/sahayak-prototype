/**
 * Fallback prototype data for offline / standalone frontend display
 * Matches backend/data/mock_data.py exactly.
 */

export const FALLBACK_STUDENT = {
  id: "ST202600124",
  student_id: "ST202600124",
  name: "Ramesh Kumar",
  phone: "+91 98765 43210",
  community: "Scheduled Tribe (Gond)",
  state: "Madhya Pradesh",
  college: "ABC College of Technology",
  course: "B.Tech Computer Science & Engineering",
  academic_year: "2026–27",
  language_preference: "hi",
  avatar_url: null
};

export const FALLBACK_SCHOLARSHIPS = [
  {
    id: "mota-pre-matric",
    name: "Pre-Matric Scholarship",
    short_description: "For students studying up to Class X.",
    category: "school",
    amount: "Up to ₹10,000/year",
    academic_year: "2026–27",
    application_period: "Open for 2026–27 (Closes 30 Nov 2026)",
    is_open: true,
    icon_type: "school",
    who_is_it_for: "ST students studying up to Class X.",
    what_you_need: "School certificates, caste certificate and bank passbook.",
    eligibility_criteria: [
      "Student must belong to a notified Scheduled Tribe community.",
      "Enrolled full-time in Class IX or X in a government or recognized school.",
      "Annual family income from all sources must not exceed ₹2.5 Lakh per annum."
    ],
    documents_required: ["Aadhaar Card", "ST Community Certificate", "Parental Income Certificate", "Class VIII Marksheet", "Student Bank Account Passbook", "Passport Size Photograph"]
  },
  {
    id: "mota-post-matric",
    name: "Post-Matric Scholarship",
    short_description: "For students continuing education after Class X.",
    category: "college",
    amount: "Up to ₹25,000/year + Maintenance",
    academic_year: "2026–27",
    application_period: "Open for 2026–27 (Closes 31 Dec 2026)",
    is_open: true,
    icon_type: "college",
    who_is_it_for: "ST students pursuing Class XI and above.",
    what_you_need: "Certificates, academic records and bank details.",
    eligibility_criteria: [
      "Student must belong to a Scheduled Tribe community.",
      "Enrolled in post-matriculation or post-secondary courses (Classes XI, XII, ITI, Diploma, Degree, PG).",
      "Total annual parental/family income must not exceed ₹2.50 Lakh per annum.",
      "Valid bank account seeded with Aadhaar for Direct Benefit Transfer (DBT)."
    ],
    documents_required: ["Aadhaar Card", "ST Community Certificate", "Income Certificate (FY 2026–27)", "Class X / XII Marksheet", "Current Course Admission & Fee Receipt", "Bank Passbook / Statement", "Passport Size Photograph"]
  },
  {
    id: "mota-national-scholarship",
    name: "National Scholarship",
    short_description: "For higher education students in premier institutes.",
    category: "college",
    amount: "Full Tuition + ₹3,000/mo Living",
    academic_year: "2026–27",
    application_period: "Open for 2026–27 (Closes 15 Jan 2027)",
    is_open: true,
    icon_type: "certificate",
    who_is_it_for: "ST students admitted to premier notified institutes.",
    what_you_need: "Admission proof, fee schedule, certificates.",
    eligibility_criteria: ["ST student admitted in notified premier institute (IIT, IIM, NIT, AIIMS, NLU, etc.)."],
    documents_required: ["Aadhaar Card", "ST Certificate", "Income Certificate", "Admission Offer Letter", "Fee Structure", "Bank Details"]
  },
  {
    id: "mota-national-fellowship",
    name: "National Fellowship",
    short_description: "For research and higher studies (M.Phil / Ph.D).",
    category: "fellowship",
    amount: "₹31,000 – ₹35,000/month + HRA",
    academic_year: "2026–27",
    application_period: "Open for 2026–27 (Closes 28 Feb 2027)",
    is_open: true,
    icon_type: "research",
    who_is_it_for: "ST research scholars pursuing doctoral studies.",
    what_you_need: "Research registration, university verification, certificates.",
    eligibility_criteria: ["ST candidate pursuing regular and full-time M.Phil and Ph.D. degrees in Science, Humanities, or Engineering."],
    documents_required: ["Aadhaar Card", "ST Certificate", "Master's Degree Certificate and Marksheet", "Ph.D. Registration Letter", "Supervisor Recommendation", "Bank Details"]
  },
  {
    id: "mota-national-overseas",
    name: "National Overseas Scholarship",
    short_description: "For higher studies abroad in reputed foreign universities.",
    category: "fellowship",
    amount: "Full Tuition + $15,400/yr Living",
    academic_year: "2026–27",
    application_period: "Open for 2026–27 (Closes 31 Mar 2027)",
    is_open: true,
    icon_type: "globe",
    who_is_it_for: "ST students pursuing postgraduate studies abroad.",
    what_you_need: "Valid passport, unconditional admission offer, academic transcripts.",
    eligibility_criteria: ["ST candidate selected for Masters / Ph.D. programs in top 500 QS world-ranked universities."],
    documents_required: ["Aadhaar Card", "ST Certificate", "Valid Indian Passport", "Foreign University Admission Letter", "IELTS/TOEFL Scorecard", "Income Certificate"]
  }
];

export const FALLBACK_APPLICATION = {
  id: "MOTA-PMS-2026-00124",
  student_id: "ST202600124",
  scholarship_id: "mota-post-matric",
  scholarship_name: "Post-Matric Scholarship",
  academic_year: "2026–27",
  progress_percent: 72,
  status: "Verification complete",
  current_stage: "Sanction",
  sanction_status: "Pending",
  payment_status: "Pending",
  submitted_date: "12 Jun 2026",
  last_updated: "15 Jul 2026",
  action_needed: "Income Certificate requires renewal (expired on 14 Aug 2026). Upload valid certificate to expedite sanction.",
  stages: [
    { stage_id: 1, name: "Application submitted", date: "12 Jun 2026", status: "completed", description: "Your application has been submitted successfully." },
    { stage_id: 2, name: "Document verification", date: "18 Jun 2026", status: "completed", description: "All documents verified." },
    { stage_id: 3, name: "Institute verification", date: "2 Jul 2026", status: "completed", description: "Verified by your institution." },
    { stage_id: 4, name: "State verification", date: "15 Jul 2026", status: "completed", description: "Verified by state authority." },
    { stage_id: 5, name: "Sanction", date: "Pending", status: "active", description: "Under process." },
    { stage_id: 6, name: "Payment", date: "Pending", status: "pending", description: "Will be updated soon." }
  ],
  student_details: {
    name: "Ramesh Kumar",
    student_id: "ST202600124",
    college: "ABC College of Technology",
    course: "B.Tech Computer Science (3rd Year)",
    community: "Scheduled Tribe",
    state: "Madhya Pradesh"
  },
  submitted_documents: [
    { name: "Aadhaar Card", status: "Verified", doc_ref: "•••• 4029" },
    { name: "ST Certificate", status: "Verified", doc_ref: "TRB/2021/8834" },
    { name: "Income Certificate", status: "Action Needed", doc_ref: "INC-2025-9921" },
    { name: "Marksheet (Semester IV)", status: "Verified", doc_ref: "CGPA 8.2" },
    { name: "Bank Details", status: "Verified", doc_ref: "SBI •••• 6712" },
    { name: "Passport Photo", status: "Verified", doc_ref: "Uploaded" }
  ]
};

export const FALLBACK_DOCUMENTS = {
  readiness_percentage: 85,
  verified_count: 5,
  total_count: 6,
  digilocker_synced: true,
  documents: [
    { id: "doc-1", name: "Aadhaar card", type: "aadhaar", status: "verified", uploaded_at: "10 Jun 2026", doc_number: "Linked to •••• 4029", digilocker_verified: true, action_needed_reason: null },
    { id: "doc-2", name: "ST certificate", type: "st_certificate", status: "verified", uploaded_at: "12 Jun 2026", doc_number: "Reg: TRB/2021/8834", digilocker_verified: true, action_needed_reason: null },
    { id: "doc-3", name: "Income certificate", type: "income_certificate", status: "action_needed", uploaded_at: "15 Aug 2025", doc_number: "Uploaded 15 Aug 2025", digilocker_verified: false, action_needed_reason: "Certificate has completed 1 year validity. Please upload fresh certificate for FY 2026–27." },
    { id: "doc-4", name: "Marksheet", type: "marksheet", status: "verified", uploaded_at: "10 Jun 2026", doc_number: "B.Tech Marksheet (Sem IV)", digilocker_verified: true, action_needed_reason: null },
    { id: "doc-5", name: "Bank details", type: "bank_details", status: "verified", uploaded_at: "10 Jun 2026", doc_number: "State Bank of India", digilocker_verified: true, action_needed_reason: null },
    { id: "doc-6", name: "Passport photo", type: "passport_photo", status: "verified", uploaded_at: "10 Jun 2026", doc_number: "Photo_Ramesh.jpg", digilocker_verified: false, action_needed_reason: null }
  ]
};

export const FALLBACK_PAYMENTS = {
  aadhaar_linked: true,
  total_received: 20000,
  pending_amount: 5000,
  cycles_credited: 4,
  cadence_monthly: 5000,
  bank_name: "State Bank of India",
  account_mask: "•••• 6712",
  monthly_schedule: [
    { month: "Jun", amount: 5000, status: "disbursed" },
    { month: "Jul", amount: 5000, status: "disbursed" },
    { month: "Aug", amount: 5000, status: "disbursed" },
    { month: "Sep", amount: 5000, status: "in_verification" }
  ],
  history: [
    { id: "tx-1", amount: 5000, status: "paid", date: "12 Aug 2026", reference: "DBT-2026-1234", scheme_name: "Post-Matric Scholarship Scheme" },
    { id: "tx-2", amount: 5000, status: "paid", date: "10 Jul 2026", reference: "DBT-2026-0981", scheme_name: "Post-Matric Scholarship Scheme" },
    { id: "tx-3", amount: 5000, status: "paid", date: "12 Jun 2026", reference: "DBT-2026-0645", scheme_name: "Post-Matric Scholarship Scheme" },
    { id: "tx-4", amount: 5000, status: "paid", date: "14 May 2026", reference: "DBT-2026-0312", scheme_name: "Post-Matric Scholarship Scheme" }
  ]
};

export const FALLBACK_NOTIFICATIONS = [
  { id: "notif-1", category: "deadlines", title: "Income Certificate Renewal Needed", message: "Your uploaded income certificate has crossed 1 year validity. Please upload your renewed FY 2026–27 certificate in Document Wallet to avoid disbursement hold.", timestamp: "2 hours ago", is_read: false },
  { id: "notif-2", category: "status", title: "State Verification Complete", message: "Great news! Your Post-Matric Scholarship application was successfully approved by the State Tribal Welfare Department.", timestamp: "15 Jul 2026", is_read: true },
  { id: "notif-3", category: "payments", title: "August DBT Installment Credited", message: "₹5,000 has been credited directly to your Aadhaar-linked State Bank of India account (Ref: DBT-2026-1234).", timestamp: "12 Aug 2026", is_read: true },
  { id: "notif-4", category: "system", title: "DigiLocker Sync Active", message: "5 of your documents are verified and secured via DigiLocker. Ready for one-click reuse.", timestamp: "10 Jun 2026", is_read: true }
];
