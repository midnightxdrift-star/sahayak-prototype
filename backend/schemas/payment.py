from pydantic import BaseModel, Field
from typing import List, Optional

class MonthlyCadenceItem(BaseModel):
    month: str = Field(..., description="Month abbreviation (Jun, Jul, Aug, Sep)")
    amount: int = Field(..., description="Amount in INR (e.g. 5000)")
    status: str = Field(..., description="disbursed, in_verification, scheduled")

class PaymentTransaction(BaseModel):
    id: str = Field(..., description="Transaction ID")
    amount: int = Field(..., description="Amount in INR")
    status: str = Field(..., description="paid, pending, processing")
    date: str = Field(..., description="Disbursement date")
    reference: str = Field(..., description="DBT reference code (e.g. DBT-2026-1234)")
    scheme_name: str = Field(..., description="Associated scheme name")

class PaymentResponse(BaseModel):
    aadhaar_linked: bool = Field(default=True, description="Whether Aadhaar-bank seeding is active")
    total_received: int = Field(..., description="Cumulative amount credited to date in INR")
    pending_amount: int = Field(..., description="Remaining pending amount for the cycle in INR")
    cycles_credited: int = Field(..., description="Number of installments successfully released")
    cadence_monthly: int = Field(..., description="Monthly installment rate in INR")
    bank_name: str = Field(..., description="Name of beneficiary bank")
    account_mask: str = Field(..., description="Masked bank account number")
    monthly_schedule: List[MonthlyCadenceItem] = Field(..., description="Monthly disbursement bar visualization")
    history: List[PaymentTransaction] = Field(..., description="Past DBT credits history")
