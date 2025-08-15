#!/usr/bin/env python3
"""
Simple authentication server for testing real auth integration
"""
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt
import hashlib

app = FastAPI(title="Kilowatt Auth Server")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Simple in-memory user store
USERS = {
    "admin": {
        "username": "admin",
        "email": "admin@kilowatt.com",
        "password_hash": hashlib.sha256("admin123".encode()).hexdigest(),
        "is_active": True,
        "role": "admin"
    }
}

SECRET_KEY = "your-secret-key-here-make-it-long-and-random"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    username: str
    email: str
    is_active: bool
    role: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    username = payload.get("sub")
    user = USERS.get(username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.post("/api/v1/auth/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Login user and return access token"""
    username = user_credentials.username
    password = user_credentials.password
    
    # Check if user exists
    user = USERS.get(username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    if password_hash != user["password_hash"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create tokens
    access_token = create_access_token(data={"sub": username})
    refresh_token = create_refresh_token(data={"sub": username})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@app.post("/api/v1/auth/refresh", response_model=Token)
async def refresh_token(refresh_token: str):
    """Refresh access token using refresh token"""
    payload = verify_token(refresh_token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    username = payload.get("sub")
    user = USERS.get(username)
    if not user or not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    access_token = create_access_token(data={"sub": username})
    new_refresh_token = create_refresh_token(data={"sub": username})
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

@app.get("/api/v1/auth/me", response_model=UserResponse)
async def get_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        username=current_user["username"],
        email=current_user["email"],
        is_active=current_user["is_active"],
        role=current_user["role"]
    )

# Add some basic data endpoints for testing (protected)
@app.get("/api/v1/accounts")
async def get_accounts(current_user: dict = Depends(get_current_user)):
    return [
        {"id": 1, "accountName": "Test Account", "status": "active", "managerName": "John Doe"},
        {"id": 2, "accountName": "Sample Corp", "status": "pending", "managerName": "Jane Smith"}
    ]

@app.get("/api/v1/esiids")
async def get_esiids(current_user: dict = Depends(get_current_user)):
    return [
        {"id": 1, "esiId": "12345", "accountName": "Test Account", "rep": "RELIANT", "kwhMo": 1500, "totalBill": 200},
        {"id": 2, "esiId": "67890", "accountName": "Sample Corp", "rep": "GEXA", "kwhMo": 2000, "totalBill": 250}
    ]

@app.get("/api/v1/commissions")
async def get_commissions(current_user: dict = Depends(get_current_user)):
    return [
        {"id": 1, "accountName": "Test Account", "actualPaymentAmount": 1000, "status": "paid"},
        {"id": 2, "accountName": "Sample Corp", "actualPaymentAmount": 750, "status": "pending"}
    ]

@app.get("/api/v1/providers")
async def get_providers(current_user: dict = Depends(get_current_user)):
    return [
        {"id": 1, "providerName": "RELIANT", "status": "active", "phone": "555-0123", "email": "contact@reliant.com"},
        {"id": 2, "providerName": "GEXA", "status": "active", "phone": "555-0456", "email": "info@gexa.com"}
    ]

@app.get("/api/v1/companies")
async def get_companies(current_user: dict = Depends(get_current_user)):
    return [
        {"id": 1, "companyName": "ABC Corp", "companyCode": "ABC", "status": "active", "officeLocation": "Dallas"},
        {"id": 2, "companyName": "XYZ Inc", "companyCode": "XYZ", "status": "pending", "officeLocation": "Houston"}
    ]

@app.get("/api/v1/managers")
async def get_managers(current_user: dict = Depends(get_current_user)):
    return [
        {"id": 1, "managerName": "John Doe", "email": "john@company.com", "phone": "555-1234"},
        {"id": 2, "managerName": "Jane Smith", "email": "jane@company.com", "phone": "555-5678"}
    ]

@app.get("/api/v1/pricing")
async def get_pricing(current_user: dict = Depends(get_current_user)):
    return [
        {"id": 1, "providerName": "RELIANT", "rateType": "Fixed", "rate": 0.12, "term": 12},
        {"id": 2, "providerName": "GEXA", "rateType": "Variable", "rate": 0.10, "term": 6}
    ]

@app.get("/api/v1/analytics")
async def get_analytics(current_user: dict = Depends(get_current_user)):
    return {
        "usage_analysis": [
            {"month": "Jan", "usage": 15000, "cost": 1800},
            {"month": "Feb", "usage": 14000, "cost": 1680}
        ],
        "cost_analysis": [
            {"provider": "RELIANT", "total_cost": 5000},
            {"provider": "GEXA", "total_cost": 3500}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Simple Auth Server...")
    print("📍 Server will be available at: http://localhost:8001")
    print("👤 Test credentials: admin / admin123")
    uvicorn.run(app, host="127.0.0.1", port=8001)
