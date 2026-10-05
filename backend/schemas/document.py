from pydantic import BaseModel, Field
from typing import List, Optional

class DocumentItem(BaseModel):
    id: str = Field(..., description="Unique document ID")
    name: str = Field(..., description="Document display name")
    type: str = Field(..., description="Type: aadhaar, st_certificate, income_certificate, marksheet, bank_details, passport_photo")
    status: str = Field(..., description="Status: verified, action_needed, pending")
    uploaded_at: str = Field(..., description="Upload timestamp or date string")
    doc_number: Optional[str] = Field(None, description="Masked document/reg identifier")
    digilocker_verified: bool = Field(default=False, description="Whether fetched/verified via DigiLocker")
    action_needed_reason: Optional[str] = Field(None, description="Details if action is required")
    file_size: Optional[str] = None

class DocumentWalletResponse(BaseModel):
    readiness_percentage: int = Field(..., description="Vault readiness metric (e.g. 85)")
    verified_count: int = Field(..., description="Number of valid verified documents")
    total_count: int = Field(..., description="Total documents required in vault")
    digilocker_synced: bool = Field(default=True, description="DigiLocker synchronization state")
    documents: List[DocumentItem] = Field(..., description="List of wallet documents")
