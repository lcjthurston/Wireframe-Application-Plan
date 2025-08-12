from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth, accounts, tasks, managers, commissions, providers, emails, health, management_companies, esiids

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    description="Kilowatt Business Intelligence API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(accounts.router, prefix="/api/v1/accounts", tags=["Accounts"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["Tasks"])
app.include_router(managers.router, prefix="/api/v1/managers", tags=["Managers"])
app.include_router(management_companies.router, prefix="/api/v1/management-companies", tags=["Management Companies"])
app.include_router(commissions.router, prefix="/api/v1/commissions", tags=["Commissions"])
app.include_router(providers.router, prefix="/api/v1/providers", tags=["Providers"])
app.include_router(esiids.router, prefix="/api/v1/esiids", tags=["ESIIDs"])
app.include_router(emails.router, prefix="/api/v1/emails", tags=["Emails"])
app.include_router(health.router, prefix="/api/v1/health", tags=["System Health"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Kilowatt Business Intelligence API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Basic health check"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 