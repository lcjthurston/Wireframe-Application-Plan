#!/usr/bin/env python3
"""
🚀 Kilowatt Backend Demo Server
===============================

A simplified demo server that shows the API structure and documentation
without requiring database setup or external dependencies.

Run this to see the API documentation at: http://localhost:8001/docs
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Demo data models
class DemoAccount(BaseModel):
    id: int
    company_name: str
    manager_name: str
    esiid: str
    status: str
    monthly_kwh: float

class DemoTask(BaseModel):
    id: int
    title: str
    description: str
    status: str
    assigned_to: str
    created_at: datetime

class DemoManager(BaseModel):
    id: int
    name: str
    email: str
    accounts_managed: int
    total_commission: float

class DemoSystemHealth(BaseModel):
    service_name: str
    status: str
    last_check: datetime
    response_time_ms: int

# Create FastAPI app
app = FastAPI(
    title="Kilowatt Business Intelligence Platform API",
    description="""
    🏢 **Energy Management Platform Backend**
    
    This demo showcases the API structure for the Kilowatt platform:
    
    ## Features
    * 🔐 **Authentication** - JWT-based user authentication
    * 🏢 **Account Management** - Customer account operations
    * ✅ **Task Management** - Work queue and assignments
    * 👔 **Manager Tracking** - Performance metrics
    * 💰 **Commission System** - Sales calculations
    * 📧 **Email Automation** - Bulk communications
    * 🏭 **Provider Management** - Energy provider relationships
    * 🏥 **System Health** - Monitoring and alerts
    
    ## Architecture
    * **Framework**: FastAPI with async support
    * **Authentication**: JWT tokens with role-based access
    * **Database**: PostgreSQL with SQLAlchemy ORM
    * **Validation**: Pydantic schemas
    * **Documentation**: Auto-generated OpenAPI/Swagger
    
    *Note: This is a demo server with mock data. The full implementation requires database setup.*
    """,
    version="1.0.0",
    contact={
        "name": "Kilowatt Platform",
        "email": "support@kilowatt-platform.com"
    }
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Demo data
demo_accounts = [
    DemoAccount(id=1, company_name="ABC Corp", manager_name="John Smith", esiid="10123456789", status="active", monthly_kwh=15000.0),
    DemoAccount(id=2, company_name="XYZ Industries", manager_name="Sarah Johnson", esiid="10987654321", status="active", monthly_kwh=25000.0),
    DemoAccount(id=3, company_name="Tech Solutions", manager_name="Mike Davis", esiid="10555666777", status="pending", monthly_kwh=8000.0),
]

demo_tasks = [
    DemoTask(id=1, title="Update customer contract", description="Renew contract for ABC Corp", status="pending", assigned_to="John Smith", created_at=datetime.now()),
    DemoTask(id=2, title="Process commission payment", description="Calculate Q3 commissions", status="in_progress", assigned_to="Sarah Johnson", created_at=datetime.now()),
    DemoTask(id=3, title="Send usage report", description="Monthly usage report for all accounts", status="completed", assigned_to="Mike Davis", created_at=datetime.now()),
]

demo_managers = [
    DemoManager(id=1, name="John Smith", email="john@kilowatt.com", accounts_managed=15, total_commission=12500.0),
    DemoManager(id=2, name="Sarah Johnson", email="sarah@kilowatt.com", accounts_managed=22, total_commission=18750.0),
    DemoManager(id=3, name="Mike Davis", email="mike@kilowatt.com", accounts_managed=8, total_commission=6200.0),
]

demo_health = [
    DemoSystemHealth(service_name="Database", status="healthy", last_check=datetime.now(), response_time_ms=45),
    DemoSystemHealth(service_name="Centerpoint API", status="healthy", last_check=datetime.now(), response_time_ms=120),
    DemoSystemHealth(service_name="Email Service", status="healthy", last_check=datetime.now(), response_time_ms=80),
    DemoSystemHealth(service_name="Redis Cache", status="healthy", last_check=datetime.now(), response_time_ms=15),
]

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Welcome to the Kilowatt Backend API Demo"""
    return {
        "message": "🚀 Kilowatt Business Intelligence Platform API",
        "version": "1.0.0",
        "status": "Demo Mode",
        "documentation": "/docs",
        "features": [
            "Authentication & Authorization",
            "Account Management",
            "Task Management", 
            "Manager Tracking",
            "Commission System",
            "Email Automation",
            "Provider Management",
            "System Health Monitoring"
        ],
        "endpoints": {
            "accounts": "/api/v1/accounts",
            "tasks": "/api/v1/tasks",
            "managers": "/api/v1/managers",
            "health": "/api/v1/health"
        }
    }

# Demo API endpoints
@app.get("/api/v1/accounts", response_model=List[DemoAccount], tags=["Accounts"])
async def get_accounts(skip: int = 0, limit: int = 100):
    """Get all customer accounts with pagination"""
    return demo_accounts[skip:skip + limit]

@app.get("/api/v1/accounts/{account_id}", response_model=DemoAccount, tags=["Accounts"])
async def get_account(account_id: int):
    """Get a specific account by ID"""
    account = next((acc for acc in demo_accounts if acc.id == account_id), None)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account

@app.get("/api/v1/tasks", response_model=List[DemoTask], tags=["Tasks"])
async def get_tasks(status: Optional[str] = None, skip: int = 0, limit: int = 100):
    """Get all tasks with optional status filtering"""
    tasks = demo_tasks
    if status:
        tasks = [task for task in tasks if task.status == status]
    return tasks[skip:skip + limit]

@app.get("/api/v1/managers", response_model=List[DemoManager], tags=["Managers"])
async def get_managers(skip: int = 0, limit: int = 100):
    """Get all managers with performance metrics"""
    return demo_managers[skip:skip + limit]

@app.get("/api/v1/health", response_model=List[DemoSystemHealth], tags=["System Health"])
async def get_system_health():
    """Get system health status for all services"""
    return demo_health

@app.get("/api/v1/stats", tags=["Statistics"])
async def get_platform_stats():
    """Get platform statistics and metrics"""
    return {
        "total_accounts": len(demo_accounts),
        "active_accounts": len([acc for acc in demo_accounts if acc.status == "active"]),
        "total_tasks": len(demo_tasks),
        "pending_tasks": len([task for task in demo_tasks if task.status == "pending"]),
        "total_managers": len(demo_managers),
        "total_monthly_kwh": sum(acc.monthly_kwh for acc in demo_accounts),
        "total_commissions": sum(mgr.total_commission for mgr in demo_managers),
        "system_status": "All systems operational",
        "last_updated": datetime.now()
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Kilowatt Backend Demo Server...")
    print("📖 API Documentation: http://localhost:8001/docs")
    print("🔍 Interactive API: http://localhost:8001/redoc")
    print("⚡ Demo Endpoints: http://localhost:8001/")
    uvicorn.run(app, host="0.0.0.0", port=8001)
