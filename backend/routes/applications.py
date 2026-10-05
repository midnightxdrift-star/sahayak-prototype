from fastapi import APIRouter, HTTPException
from typing import List
from backend.schemas.application import ApplicationSummary, ApplicationDetail
from backend.data.mock_data import APPLICATIONS_DATA

router = APIRouter(prefix="/api/applications", tags=["Applications"])

@router.get("", response_model=List[ApplicationSummary], summary="List student applications")
async def list_applications():
    """
    Returns a summary of the student's active and past scholarship applications.
    """
    return [ApplicationSummary(**app) for app in APPLICATIONS_DATA]

@router.get("/{application_id}", response_model=ApplicationDetail, summary="Get full application details & tracker")
async def get_application_details(application_id: str):
    """
    Returns full application record with 6-stage milestone tracker,
    verification progress, and attached documents.
    """
    app = next(
        (a for a in APPLICATIONS_DATA if a["id"].lower() == application_id.lower()),
        None
    )
    if not app:
        raise HTTPException(
            status_code=404,
            detail=f"Application with ID '{application_id}' not found."
        )
    return ApplicationDetail(**app)
