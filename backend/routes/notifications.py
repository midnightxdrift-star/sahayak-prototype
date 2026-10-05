from fastapi import APIRouter, Query
from typing import List, Optional
from backend.schemas.notification import NotificationItem
from backend.data.mock_data import NOTIFICATIONS_DATA

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationItem], summary="Get categorized notifications")
async def list_notifications(
    category: Optional[str] = Query(None, description="Optional category filter: deadlines, status, payments, system, all")
):
    """
    Returns student notifications with optional category filtering.
    """
    if not category or category.lower() == "all":
        return [NotificationItem(**n) for n in NOTIFICATIONS_DATA]
    
    filtered = [
        n for n in NOTIFICATIONS_DATA
        if n["category"].lower() == category.lower()
    ]
    return [NotificationItem(**n) for n in filtered]
