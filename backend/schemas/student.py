from pydantic import BaseModel, Field
from typing import Optional

class StudentResponse(BaseModel):
    id: str = Field(..., description="Unique student ID")
    student_id: str = Field(..., description="Displayed student ID / roll number")
    name: str = Field(..., description="Student full name")
    phone: str = Field(..., description="Registered mobile number")
    community: str = Field(..., description="Tribal community affiliation (e.g. Scheduled Tribe - Gond)")
    state: str = Field(..., description="Home state")
    college: str = Field(..., description="Enrolled educational institute")
    course: str = Field(..., description="Current degree / course")
    academic_year: str = Field(..., description="Active academic year")
    language_preference: str = Field(default="hi", description="Preferred language code (e.g. hi, en, mr, te)")
    avatar_url: Optional[str] = None
