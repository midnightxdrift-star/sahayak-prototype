from fastapi import APIRouter
from backend.schemas.jago import JagoChatRequest, JagoChatResponse
from backend.services.jago_service import JagoService

router = APIRouter(prefix="/api/jago", tags=["JAGO Assistant"])

@router.post("/chat", response_model=JagoChatResponse, summary="Send message to JAGO AI scholarship assistant")
async def chat_with_jago(payload: JagoChatRequest):
    """
    JAGO conversational endpoint.
    Retrieves student and active application context to ground responses.
    Connects to Grok API if configured, or uses the grounded rule engine.
    """
    history_list = [h.dict() for h in payload.history] if payload.history else None
    result = await JagoService.process_chat(
        message=payload.message,
        application_id=payload.application_id,
        scholarship_id=payload.scholarship_id,
        language=payload.language or "en",
        history=history_list
    )
    return JagoChatResponse(**result)
