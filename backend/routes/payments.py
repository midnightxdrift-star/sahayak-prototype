from fastapi import APIRouter
from backend.schemas.payment import PaymentResponse
from backend.data.mock_data import PAYMENTS_DATA

router = APIRouter(prefix="/api/payments", tags=["Payments"])

@router.get("", response_model=PaymentResponse, summary="Get DBT payment status and transaction history")
async def get_payment_details():
    """
    Returns prototype Direct Benefit Transfer (DBT) information,
    including Aadhaar linkage status, monthly release cadence, and transaction ledger.
    """
    return PaymentResponse(**PAYMENTS_DATA)
