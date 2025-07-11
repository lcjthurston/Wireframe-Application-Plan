from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate, AccountResponse
from app.api.v1.auth import oauth2_scheme
from app.core.security import verify_token

router = APIRouter()


def get_current_user_id(token: str = Depends(oauth2_scheme)) -> int:
    """Get current user ID from token"""
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return int(payload.get("sub"))


@router.get("/", response_model=List[AccountResponse])
async def get_accounts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get all accounts with pagination"""
    accounts = db.query(Account).offset(skip).limit(limit).all()
    return accounts


@router.get("/{account_id}", response_model=AccountResponse)
async def get_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get account by ID"""
    account = db.query(Account).filter(Account.id == account_id).first()
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    return account


@router.post("/", response_model=AccountResponse)
async def create_account(
    account_data: AccountCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Create a new account"""
    # Check if account number already exists
    existing_account = db.query(Account).filter(
        Account.account_number == account_data.account_number
    ).first()
    
    if existing_account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account number already exists"
        )
    
    db_account = Account(**account_data.dict())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


@router.put("/{account_id}", response_model=AccountResponse)
async def update_account(
    account_id: int,
    account_data: AccountUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Update an account"""
    account = db.query(Account).filter(Account.id == account_id).first()
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # Update only provided fields
    update_data = account_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(account, field, value)
    
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
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Refresh usage data from Centerpoint API"""
    account = db.query(Account).filter(Account.id == account_id).first()
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # TODO: Implement Centerpoint API integration
    # This would fetch usage data from Centerpoint and update the account
    
    # Mock response for now
    return {
        "message": "Usage data refresh initiated",
        "account_id": account_id,
        "status": "pending"
    }


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