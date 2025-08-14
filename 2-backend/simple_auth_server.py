#!/usr/bin/env python3
"""
Simple authentication server for testing real auth integration
"""
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
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
async def get_current_user():
    """Get current user information"""
    # For simplicity, return admin user
    user = USERS["admin"]
    return UserResponse(
        username=user["username"],
        email=user["email"],
        is_active=user["is_active"],
        role=user["role"]
    )

# Add some basic data endpoints for testing
@app.get("/api/v1/accounts")
async def get_accounts():
    return [{"id": 1, "name": "Test Account", "status": "active"}]

@app.get("/api/v1/esiids")
async def get_esiids():
    return [{"id": 1, "esiId": "12345", "accountName": "Test Account"}]

@app.get("/api/v1/commissions")
async def get_commissions():
    return [{"id": 1, "accountName": "Test Account", "amount": 1000}]

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Simple Auth Server...")
    print("📍 Server will be available at: http://localhost:8001")
    print("👤 Test credentials: admin / admin123")
    uvicorn.run(app, host="127.0.0.1", port=8001)
