from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.core.security import verify_token
from app.models.user import User

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")


def get_current_user_id(token: str = Depends(oauth2_scheme)) -> int:
    """
    Extract and validate user ID from JWT token.
    
    Args:
        token: JWT access token from Authorization header
        
    Returns:
        int: User ID from token payload
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing user information",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return int(user_id)


def get_current_user(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
) -> User:
    """
    Get the current authenticated user from the database.
    
    Args:
        current_user_id: User ID from JWT token
        db: Database session
        
    Returns:
        User: Current authenticated user object
        
    Raises:
        HTTPException: If user not found or inactive
    """
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    return user


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Get current active user (alias for get_current_user for clarity).
    
    Args:
        current_user: Current user from get_current_user dependency
        
    Returns:
        User: Current active user object
    """
    return current_user


def require_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Require current user to have admin role.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        User: Current user if admin
        
    Raises:
        HTTPException: If user is not admin
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


def require_manager_or_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Require current user to have manager or admin role.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        User: Current user if manager or admin
        
    Raises:
        HTTPException: If user is not manager or admin
    """
    if current_user.role not in ["manager", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Manager or admin access required"
        )
    return current_user


def get_optional_current_user_id(
    token: Optional[str] = Depends(oauth2_scheme)
) -> Optional[int]:
    """
    Get current user ID if token is provided, otherwise return None.
    Useful for endpoints that work with or without authentication.
    
    Args:
        token: Optional JWT access token
        
    Returns:
        Optional[int]: User ID if token is valid, None otherwise
    """
    if not token:
        return None
    
    payload = verify_token(token)
    if payload is None:
        return None
    
    user_id = payload.get("sub")
    return int(user_id) if user_id else None


def get_test_user_id() -> Optional[int]:
    """
    Return a test user ID for development/testing purposes.
    This bypasses authentication entirely.
    """
    return 1  # Return a default test user ID


def get_pagination_params(skip: int = 0, limit: int = 100) -> dict:
    """
    Validate and return pagination parameters.
    
    Args:
        skip: Number of records to skip (offset)
        limit: Maximum number of records to return
        
    Returns:
        dict: Validated pagination parameters
        
    Raises:
        HTTPException: If parameters are invalid
    """
    if skip < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Skip parameter must be non-negative"
        )
    
    if limit <= 0 or limit > 1000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit parameter must be between 1 and 1000"
        )
    
    return {"skip": skip, "limit": limit}
