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

class DemoESIID(BaseModel):
    id: int
    esiid: str
    rep: str
    load_profile: str
    kwh_per_month: float
    kwh_per_year: float
    account_id: int

class DemoCompany(BaseModel):
    id: int
    name: str
    contact_person: str
    email: str
    phone: str
    accounts_count: int

class DemoCommission(BaseModel):
    id: int
    manager_id: int
    manager_name: str
    account_id: int
    account_name: str
    commission_amount: float
    commission_rate: float
    period: str
    status: str

class DemoProvider(BaseModel):
    id: int
    name: str
    type: str
    contact_email: str
    phone: str
    service_area: str
    status: str

class DemoPricing(BaseModel):
    id: int
    provider_id: int
    provider_name: str
    rate_type: str
    rate_per_kwh: float
    effective_date: str
    expiration_date: str

class DemoAnalytics(BaseModel):
    metric_name: str
    value: float
    unit: str
    trend: str
    period: str

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

demo_esiids = [
    DemoESIID(id=1, esiid="10123456789", rep="John Smith", load_profile="Residential", kwh_per_month=1250.0, kwh_per_year=15000.0, account_id=1),
    DemoESIID(id=2, esiid="10987654321", rep="Sarah Johnson", load_profile="Commercial", kwh_per_month=2750.0, kwh_per_year=33000.0, account_id=2),
    DemoESIID(id=3, esiid="10555666777", rep="Mike Davis", load_profile="Industrial", kwh_per_month=8333.0, kwh_per_year=100000.0, account_id=3),
]

demo_companies = [
    DemoCompany(id=1, name="ABC Corp", contact_person="Jane Doe", email="jane@abccorp.com", phone="555-0101", accounts_count=15),
    DemoCompany(id=2, name="XYZ Industries", contact_person="Bob Wilson", email="bob@xyzind.com", phone="555-0202", accounts_count=22),
    DemoCompany(id=3, name="Tech Solutions LLC", contact_person="Alice Brown", email="alice@techsol.com", phone="555-0303", accounts_count=8),
]

demo_commissions = [
    DemoCommission(id=1, manager_id=1, manager_name="John Smith", account_id=1, account_name="ABC Corp", commission_amount=850.0, commission_rate=0.05, period="Q3 2024", status="paid"),
    DemoCommission(id=2, manager_id=2, manager_name="Sarah Johnson", account_id=2, account_name="XYZ Industries", commission_amount=1200.0, commission_rate=0.06, period="Q3 2024", status="pending"),
    DemoCommission(id=3, manager_id=3, manager_name="Mike Davis", account_id=3, account_name="Tech Solutions LLC", commission_amount=750.0, commission_rate=0.04, period="Q3 2024", status="paid"),
]

demo_providers = [
    DemoProvider(id=1, name="TXU Energy", type="Retail Electric Provider", contact_email="support@txu.com", phone="1-800-TXU-ENERGY", service_area="Texas", status="active"),
    DemoProvider(id=2, name="Reliant Energy", type="Retail Electric Provider", contact_email="help@reliant.com", phone="1-866-RELIANT", service_area="Texas", status="active"),
    DemoProvider(id=3, name="Direct Energy", type="Retail Electric Provider", contact_email="service@directenergy.com", phone="1-877-DIRECT", service_area="Texas", status="active"),
]

demo_pricing = [
    DemoPricing(id=1, provider_id=1, provider_name="TXU Energy", rate_type="Fixed", rate_per_kwh=0.12, effective_date="2024-01-01", expiration_date="2024-12-31"),
    DemoPricing(id=2, provider_id=2, provider_name="Reliant Energy", rate_type="Variable", rate_per_kwh=0.115, effective_date="2024-01-01", expiration_date="2024-12-31"),
    DemoPricing(id=3, provider_id=3, provider_name="Direct Energy", rate_type="Fixed", rate_per_kwh=0.125, effective_date="2024-01-01", expiration_date="2024-12-31"),
]

demo_analytics = [
    DemoAnalytics(metric_name="Total Revenue", value=125000.0, unit="USD", trend="up", period="Q3 2024"),
    DemoAnalytics(metric_name="Customer Acquisition", value=45.0, unit="customers", trend="up", period="Q3 2024"),
    DemoAnalytics(metric_name="Average kWh Usage", value=2750.0, unit="kWh", trend="stable", period="Q3 2024"),
    DemoAnalytics(metric_name="Commission Rate", value=5.2, unit="percent", trend="up", period="Q3 2024"),
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

@app.get("/api/v1/esiids", response_model=List[DemoESIID], tags=["ESIIDs"])
async def get_esiids(skip: int = 0, limit: int = 100):
    """Get all ESIIDs with pagination"""
    return demo_esiids[skip:skip + limit]

@app.get("/api/v1/management-companies", response_model=List[DemoCompany], tags=["Management Companies"])
async def get_companies(skip: int = 0, limit: int = 100):
    """Get all management companies with pagination"""
    return demo_companies[skip:skip + limit]

@app.get("/api/v1/commissions", response_model=List[DemoCommission], tags=["Commissions"])
async def get_commissions(skip: int = 0, limit: int = 100):
    """Get all commissions with pagination"""
    return demo_commissions[skip:skip + limit]

@app.get("/api/v1/providers", response_model=List[DemoProvider], tags=["Providers"])
async def get_providers(skip: int = 0, limit: int = 100):
    """Get all energy providers with pagination"""
    return demo_providers[skip:skip + limit]

@app.get("/api/v1/pricing", response_model=List[DemoPricing], tags=["Pricing"])
async def get_pricing(skip: int = 0, limit: int = 100):
    """Get all pricing data with pagination"""
    return demo_pricing[skip:skip + limit]

@app.get("/api/v1/analytics", response_model=List[DemoAnalytics], tags=["Analytics"])
async def get_analytics():
    """Get analytics data and metrics"""
    return demo_analytics

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Kilowatt Backend Demo Server...")
    print("📖 API Documentation: http://localhost:8001/docs")
    print("🔍 Interactive API: http://localhost:8001/redoc")
    print("⚡ Demo Endpoints: http://localhost:8001/")
    uvicorn.run(app, host="0.0.0.0", port=8001)
