from pydantic import BaseModel, Field
from typing import Optional

class NotificationItem(BaseModel):
    id: str = Field(..., description="Unique notification ID")
    category: str = Field(..., description="Category: deadlines, status, payments, system")
    title: str = Field(..., description="Notification heading")
    message: str = Field(..., description="Notification content")
    timestamp: str = Field(..., description="Relative or absolute timestamp")
    is_read: bool = Field(default=False, description="Read/unread flag")
    action_url: Optional[str] = Field(None, description="Optional deep link destination")
