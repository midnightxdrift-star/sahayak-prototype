from fastapi import APIRouter
from backend.schemas.document import DocumentWalletResponse
from backend.data.mock_data import DOCUMENTS_DATA

router = APIRouter(prefix="/api/documents", tags=["Documents"])

@router.get("", response_model=DocumentWalletResponse, summary="Get Document Wallet status and documents")
async def get_document_wallet():
    """
    Returns the student's Document Wallet, including DigiLocker sync status,
    vault readiness score, and document verification details.
    """
    return DocumentWalletResponse(**DOCUMENTS_DATA)
