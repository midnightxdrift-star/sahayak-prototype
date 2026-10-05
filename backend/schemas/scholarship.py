from pydantic import BaseModel, Field
from typing import List, Optional

class ScholarshipSummary(BaseModel):
    id: str = Field(..., description="Unique scheme identifier")
    name: str = Field(..., description="Full scholarship name")
    short_description: str = Field(..., description="Brief one-line summary")
    category: str = Field(..., description="Category filter (school, college, fellowship)")
    amount: str = Field(..., description="Stipend / scholarship grant amount")
    academic_year: str = Field(default="2026–27", description="Scheme academic cycle")
    application_period: str = Field(..., description="Application open/close timeline")
    is_open: bool = Field(default=True, description="Whether applications are currently accepted")
    icon_type: Optional[str] = Field(default="education", description="Icon style indicator")

class ScholarshipDetail(ScholarshipSummary):
    who_is_it_for: str = Field(..., description="Target student eligibility audience")
    what_you_need: str = Field(..., description="Summary of necessary documentation")
    eligibility_criteria: List[str] = Field(..., description="Detailed eligibility conditions")
    documents_required: List[str] = Field(..., description="Required verification documents")
    benefits: List[str] = Field(default_factory=list, description="Scheme financial and institutional perks")
    guidelines_url: Optional[str] = None
