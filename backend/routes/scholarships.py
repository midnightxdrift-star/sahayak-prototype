from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from backend.schemas.scholarship import ScholarshipSummary, ScholarshipDetail
from backend.data.mock_data import SCHOLARSHIPS_DATA

router = APIRouter(prefix="/api/scholarships", tags=["Scholarships"])

@router.get("", response_model=List[ScholarshipSummary], summary="List all MoTA scholarships")
async def list_scholarships(
    category: Optional[str] = Query(None, description="Optional filter by category: school, college, fellowship, all")
):
    """
    Returns the catalogue of Ministry of Tribal Affairs (MoTA) scholarship schemes.
    Supports optional category filtering.
    """
    if not category or category.lower() == "all":
        return [ScholarshipSummary(**s) for s in SCHOLARSHIPS_DATA]
    
    filtered = [
        s for s in SCHOLARSHIPS_DATA 
        if s["category"].lower() == category.lower()
    ]
    return [ScholarshipSummary(**s) for s in filtered]

@router.get("/{scholarship_id}", response_model=ScholarshipDetail, summary="Get scholarship details by ID")
async def get_scholarship_details(scholarship_id: str):
    """
    Returns full details for a specific scholarship scheme including criteria,
    benefits, and required verification documents.
    """
    scheme = next(
        (s for s in SCHOLARSHIPS_DATA if s["id"].lower() == scholarship_id.lower()),
        None
    )
    if not scheme:
        raise HTTPException(
            status_code=404, 
            detail=f"Scholarship with ID '{scholarship_id}' not found."
        )
    return ScholarshipDetail(**scheme)
