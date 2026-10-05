from pydantic import BaseModel, Field
from typing import List, Optional

class MilestoneStage(BaseModel):
    stage_id: int = Field(..., description="Stage sequence index (1 to 6)")
    name: str = Field(..., description="Milestone title")
    date: str = Field(..., description="Completion or pending date string")
    status: str = Field(..., description="State: completed, active, pending")
    description: str = Field(..., description="Short explanation of stage")

class ApplicationSummary(BaseModel):
    id: str = Field(..., description="Application ID (e.g. MOTA-PMS-2026-00124)")
    student_id: str
    scholarship_id: str
    scholarship_name: str
    academic_year: str
    progress_percent: int = Field(..., description="Overall completion percentage (e.g. 72)")
    status: str = Field(..., description="Top-level status badge text (e.g. Verification complete)")
    current_stage: str = Field(..., description="Name of the current active stage")
    sanction_status: str = Field(..., description="Sanction status (e.g. Pending, Sanctioned)")
    payment_status: str = Field(..., description="Payment status (e.g. In Progress, Credited)")
    submitted_date: str
    last_updated: str
    action_needed: Optional[str] = None

class ApplicationDetail(ApplicationSummary):
    stages: List[MilestoneStage] = Field(..., description="6-stage milestone tracker timeline")
    student_details: dict = Field(..., description="Snapshot of student information for application")
    submitted_documents: List[dict] = Field(default_factory=list, description="Documents attached to this application")
    notes: Optional[str] = None
