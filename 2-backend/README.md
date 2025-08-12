# Kilowatt Minimal Backend

This is a streamlined version of the Kilowatt Business Intelligence backend API, containing only the essential files needed to run the FastAPI application with full functionality.

## 🎯 What's Included

### Essential Core Files
- **`requirements.txt`** - Python dependencies
- **`env.local`** - Local development environment variables
- **`env.example`** - Environment variables template
- **`demo_server.py`** - Standalone demo server for testing

### Database Configuration
- **`alembic.ini`** - Database migration configuration
- **`alembic/`** - Database migration scripts and environment

### Application Code (`app/`)
- **`main.py`** - FastAPI application entry point
- **`database.py`** - Database connection and session management
- **`__init__.py`** - Package initialization

### Core Modules (`app/core/`)
- **`config.py`** - Application configuration and settings
- **`security.py`** - JWT authentication and password hashing
- **`dependencies.py`** - FastAPI dependency injection functions

### API Endpoints (`app/api/v1/`)
- **`auth.py`** - Authentication endpoints (login, register, token refresh)
- **`accounts.py`** - Account management CRUD operations
- **`tasks.py`** - Task management endpoints
- **`managers.py`** - Manager management endpoints
- **`commissions.py`** - Commission tracking endpoints
- **`providers.py`** - Provider management endpoints
- **`emails.py`** - Email management endpoints
- **`health.py`** - System health monitoring endpoints

### Database Models (`app/models/`)
- **`user.py`** - User authentication model
- **`account.py`** - Business account model
- **`task.py`** - Task management model
- **`manager.py`** - Manager profile model
- **`commission.py`** - Commission tracking model
- **`provider.py`** - Energy provider model
- **`email.py`** - Email draft model
- **`system_health.py`** - System monitoring model

### Data Schemas (`app/schemas/`)
- **`user.py`** - User data validation schemas
- **`account.py`** - Account data schemas
- **`task.py`** - Task data schemas
- **`manager.py`** - Manager data schemas
- **`commission.py`** - Commission data schemas
- **`provider.py`** - Provider data schemas
- **`email.py`** - Email data schemas
- **`system_health.py`** - Health monitoring schemas

### Services (`app/services/`)
- **`centerpoint.py`** - External API integration service

### Utilities (`app/utils/`)
- **`__init__.py`** - Utility functions package

## 🚀 Quick Start

### Option 1: Full Installation
```bash
# Install all dependencies
pip install -r requirements.txt

# Set up environment
cp env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Option 2: Demo Server (No Database)
```bash
# Install minimal dependencies
pip install fastapi uvicorn pydantic

# Run demo server
python demo_server.py
```

## 🔧 Configuration

### Environment Variables
The application uses environment variables for configuration. Copy `env.example` to `.env` and modify:

- **Database**: SQLite by default (`sqlite:///./kilowatt_dev.db`)
- **Security**: JWT secret key and token expiration
- **CORS**: Frontend origins for cross-origin requests
- **External APIs**: Centerpoint API configuration

### Database Options
- **SQLite** (default): No additional setup required
- **PostgreSQL**: Install `psycopg2-binary` and update `DATABASE_URL`

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/token` - OAuth2 token endpoint
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user profile

### Business Operations
- `GET/POST/PUT/DELETE /api/v1/accounts/` - Account management
- `GET/POST/PUT/DELETE /api/v1/tasks/` - Task management
- `GET/POST/PUT/DELETE /api/v1/managers/` - Manager management
- `GET/POST/PUT/DELETE /api/v1/commissions/` - Commission tracking
- `GET/POST/PUT/DELETE /api/v1/providers/` - Provider management
- `GET/POST/PUT/DELETE /api/v1/emails/` - Email management
- `GET /api/v1/health/` - System health monitoring

## 🎨 Features Preserved

- ✅ **Complete API** - All 8 business modules with full CRUD operations
- ✅ **JWT Authentication** - Secure login with access and refresh tokens
- ✅ **Database Integration** - SQLAlchemy ORM with migration support
- ✅ **Data Validation** - Pydantic schemas for request/response validation
- ✅ **Auto Documentation** - Swagger UI at `/docs` and ReDoc at `/redoc`
- ✅ **CORS Support** - Frontend integration ready
- ✅ **Error Handling** - Proper HTTP status codes and error responses

## 🗑️ What Was Removed

### Documentation Files
- Screenshots and API testing documentation
- Installation guides and status files
- Development progress tracking files

### Development Files
- Docker configuration files
- Test files and testing utilities
- Development demo scripts (except `demo_server.py`)
- Python cache files (`__pycache__`)

### Optional Files
- Requirements files for specific scenarios
- Additional demo and testing scripts

## 📁 Directory Size Comparison

- **Original**: ~80+ files across multiple directories
- **Minimal**: ~35 essential files with same functionality

This minimal version maintains 100% of the original API functionality while removing unnecessary development and documentation files.

## 🔍 Testing

Access the interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Test authentication with:
- Username: `admin`
- Password: `password`
