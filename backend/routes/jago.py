from typing import Optional
from fastapi import APIRouter, Header, HTTPException, status
from backend.core.config import settings
from backend.schemas.jago import (
    JagoChatRequest, 
    JagoChatResponse, 
    JagoV1ChatRequest, 
    JagoV1ChatResponse, 
    JagoV1ReplyData
)
from backend.services.jago_service import JagoService

router = APIRouter(tags=["JAGO Assistant"])

@router.post("/api/jago/chat", response_model=JagoChatResponse, summary="Send message to JAGO AI scholarship assistant")
async def chat_with_jago(payload: JagoChatRequest):
    """
    JAGO conversational endpoint.
    Retrieves student and active application context to ground responses.
    Connects to external JAGO API, Grok API, or grounded rule engine.
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

@router.post(
    "/api/v1/chat", 
    response_model=JagoV1ChatResponse, 
    summary="Direct V1 Chat Endpoint matching X-JAGO-API-KEY specification"
)
async def chat_v1(
    payload: JagoV1ChatRequest,
    x_jago_api_key: Optional[str] = Header(None, alias="X-JAGO-API-KEY")
):
    """
    Calling format:
    POST /api/v1/chat
    Header: X-JAGO-API-KEY
    Body: { studentId, message, sessionId }
    Response: { "data": { "reply": "...", "sessionId": "..." } }
    """
    # Verify API key if configured
    configured_key = settings.JAGO_API_KEY
    if configured_key and x_jago_api_key:
        clean_provided = x_jago_api_key.strip().strip('"').strip("'")
        if clean_provided != configured_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid X-JAGO-API-KEY header."
            )

    result = await JagoService.process_chat(
        message=payload.message,
        application_id=payload.application_id,
        scholarship_id=payload.scholarship_id,
        language=payload.language or "en",
        student_id=payload.studentId,
        session_id=payload.sessionId
    )

    reply_text = result.get("reply") or result.get("response") or ""
    return JagoV1ChatResponse(
        data=JagoV1ReplyData(
            reply=reply_text,
            sessionId=payload.sessionId,
            source=result.get("source", "jago")
        ),
        status="success"
    )
