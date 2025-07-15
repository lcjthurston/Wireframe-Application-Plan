from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.core.dependencies import get_current_user_id, get_pagination_params
from app.models.email import EmailDraft
from app.schemas.email import EmailDraftCreate, EmailDraftUpdate, EmailDraftResponse

router = APIRouter()


@router.get("/", response_model=List[EmailDraftResponse])
async def get_emails(
    pagination: dict = Depends(get_pagination_params),
    status: str = None,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get all email drafts with optional filtering"""
    query = db.query(EmailDraft)

    if status:
        query = query.filter(EmailDraft.status == status)

    emails = query.offset(pagination["skip"]).limit(pagination["limit"]).all()
    return emails


@router.get("/{email_id}", response_model=EmailDraftResponse)
async def get_email(
    email_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get email draft by ID"""
    email = db.query(EmailDraft).filter(EmailDraft.id == email_id).first()
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email draft not found"
        )
    return email


@router.post("/", response_model=EmailDraftResponse)
async def create_email(
    email_data: EmailDraftCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Create a new email draft"""
    db_email = EmailDraft(**email_data.dict())
    db.add(db_email)
    db.commit()
    db.refresh(db_email)
    return db_email


@router.put("/{email_id}", response_model=EmailDraftResponse)
async def update_email(
    email_id: int,
    email_data: EmailDraftUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Update an email draft"""
    email = db.query(EmailDraft).filter(EmailDraft.id == email_id).first()
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email draft not found"
        )
    
    update_data = email_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(email, field, value)
    
    db.commit()
    db.refresh(email)
    return email


@router.delete("/{email_id}")
async def delete_email(
    email_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Delete an email draft"""
    email = db.query(EmailDraft).filter(EmailDraft.id == email_id).first()
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email draft not found"
        )
    
    db.delete(email)
    db.commit()
    return {"message": "Email draft deleted successfully"}


@router.post("/{email_id}/send")
async def send_email(
    email_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Send an email draft"""
    email = db.query(EmailDraft).filter(EmailDraft.id == email_id).first()
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email draft not found"
        )
    
    # TODO: Implement email sending logic
    # This would integrate with SMTP or email service
    
    email.status = "sent"
    email.sent_at = datetime.utcnow()
    db.commit()
    db.refresh(email)
    
    return {"message": "Email sent successfully", "email_id": email_id}


@router.post("/bulk-send")
async def bulk_send_emails(
    email_ids: List[int],
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Send multiple email drafts"""
    emails = db.query(EmailDraft).filter(EmailDraft.id.in_(email_ids)).all()
    
    if not emails:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No email drafts found"
        )
    
    # TODO: Implement bulk email sending logic
    
    for email in emails:
        email.status = "sent"
        email.sent_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": f"Sent {len(emails)} emails successfully"} 