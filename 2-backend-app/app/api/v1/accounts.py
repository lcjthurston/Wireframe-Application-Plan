from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.core.dependencies import get_current_user_id, get_pagination_params
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate, AccountResponse
from app.services.centerpoint import centerpoint_client

router = APIRouter()


@router.get("/", response_model=List[AccountResponse])
async def get_accounts(
    pagination: dict = Depends(get_pagination_params),
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get all accounts with real database query"""
    accounts = db.query(Account).offset(pagination["skip"]).limit(pagination["limit"]).all()
    return accounts


@router.get("/{account_id}", response_model=AccountResponse)
async def get_account(
    account_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get specific account"""
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


@router.post("/", response_model=AccountResponse)
async def create_account(
    account: AccountCreate,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Create new account"""
    db_account = Account(**account.dict(), created_by=current_user_id)
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


@router.put("/{account_id}", response_model=AccountResponse)
async def update_account(
    account_id: int,
    account_update: AccountUpdate,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Update account"""
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    for field, value in account_update.dict(exclude_unset=True).items():
        setattr(account, field, value)
    
    account.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(account)
    return account


@router.delete("/{account_id}")
async def delete_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Delete an account"""
    account = db.query(Account).filter(Account.id == account_id).first()
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    db.delete(account)
    db.commit()
    return {"message": "Account deleted successfully"}


@router.post("/{account_id}/refresh-usage")
async def refresh_usage_data(
    account_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Refresh usage data from Centerpoint API"""
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    if not account.esiid:
        raise HTTPException(status_code=400, detail="Account has no ESIID")
    
    try:
        usage_data = await centerpoint_client.get_usage_data(account.esiid)
        
        # Update account with real usage data
        account.usage_kwh = usage_data.get("total_kwh", 0)
        account.last_usage_update = datetime.utcnow()
        db.commit()
        
        return {
            "message": "Usage data updated successfully",
            "usage_kwh": account.usage_kwh,
            "last_updated": account.last_usage_update
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to refresh usage data: {str(e)}"
        )


@router.post("/{account_id}/generate-pricing")
async def generate_pricing(
    account_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Generate pricing sheet for account"""
    account = db.query(Account).filter(Account.id == account_id).first()
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # TODO: Implement pricing generation logic
    # This would analyze usage data and generate pricing recommendations
    
    return {
        "message": "Pricing generation initiated",
        "account_id": account_id,
        "status": "processing"
    }


@router.post("/{account_id}/draft-contract")
async def draft_contract(
    account_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Draft contract for account"""
    account = db.query(Account).filter(Account.id == account_id).first()
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # TODO: Implement contract drafting logic
    # This would generate contract documents based on account data
    
    return {
        "message": "Contract drafting initiated",
        "account_id": account_id,
        "status": "processing"
    } 
