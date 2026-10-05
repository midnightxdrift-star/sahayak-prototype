from fastapi import APIRouter
from backend.schemas.student import StudentResponse
from backend.data.mock_data import STUDENT_DATA

router = APIRouter(prefix="/api/student", tags=["Student"])

@router.get("", response_model=StudentResponse, summary="Get current student profile")
async def get_student_profile():
    """
    Returns the currently authenticated prototype student's profile information.
    """
    return StudentResponse(**STUDENT_DATA)
