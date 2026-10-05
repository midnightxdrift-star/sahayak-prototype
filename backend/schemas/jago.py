from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class ChatHistoryMessage(BaseModel):
    role: str = Field(..., description="user or assistant")
    content: str = Field(..., description="message content")

class JagoChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Student's message or prompt chip")
    application_id: Optional[str] = Field(default="MOTA-PMS-2026-00124", description="Active application ID for context")
    scholarship_id: Optional[str] = Field(default=None, description="Active scholarship context if chatting from details page")
    language: Optional[str] = Field(default="en", description="Preferred language code: en, hi, mr, te, etc.")
    history: Optional[List[ChatHistoryMessage]] = Field(default_factory=list, description="Recent conversation turns for context continuity")

class JagoChatResponse(BaseModel):
    response: str = Field(..., description="Primary conversational explanation for the student")
    reply: str = Field(..., description="Alias for response for frontend compatibility")
    context_used: Dict[str, Any] = Field(default_factory=dict, description="Structured facts provided to the AI")
    source: str = Field(default="grounded_service", description="Response generator origin: 'jago_external_api', 'grok' or 'grounded_service'")

class JagoV1ChatRequest(BaseModel):
    message: str = Field(..., description="Student's message")
    studentId: Optional[str] = Field(default="STU-2026-8841", description="Student ID")
    sessionId: Optional[str] = Field(default="sess-default", description="Session ID")
    application_id: Optional[str] = Field(default="MOTA-PMS-2026-00124", description="Optional application ID")
    scholarship_id: Optional[str] = Field(default=None, description="Optional scholarship ID")
    language: Optional[str] = Field(default="en", description="Language preference")

class JagoV1ReplyData(BaseModel):
    reply: str
    sessionId: Optional[str] = None
    source: Optional[str] = "jago"

class JagoV1ChatResponse(BaseModel):
    data: JagoV1ReplyData
    status: Optional[str] = "success"
