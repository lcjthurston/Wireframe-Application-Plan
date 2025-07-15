# Kilowatt Business Intelligence API

A FastAPI-based backend for the Kilowatt Business Intelligence Platform, providing comprehensive APIs for account management, task tracking, commission management, and system automation.

## 🚀 Quick Start

### Using Docker (Recommended)
```bash
# Start all services
docker-compose up --build

# Access the API
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

### Manual Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp env.example .env
# Edit .env with your configuration

# Run migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

## 🎯 Features

- **Authentication**: JWT-based authentication with refresh tokens
- **Account Management**: Complete CRUD operations for business accounts
- **Task Management**: Task queue with assignment and status tracking
- **Manager Management**: Manager profiles and performance tracking
- **Commission Tracking**: Commission calculation and payment processing
- **Provider Management**: Energy provider information and performance
- **Email Management**: Email draft creation and sending
- **System Health**: Real-time system monitoring and health checks
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Caching**: Redis for performance optimization
- **Documentation**: Auto-generated API docs with Swagger/OpenAPI

## 🛠️ Technology Stack

- **Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL with SQLAlchemy
- **Authentication**: JWT with python-jose
- **Password Hashing**: bcrypt with passlib
- **Validation**: Pydantic
- **Caching**: Redis
- **Migrations**: Alembic
- **Testing**: Built-in testing framework ready
- **Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
app/
├── api/
│   └── v1/
│       ├── auth.py              # Authentication endpoints
│       ├── accounts.py          # Account management
│       ├── tasks.py             # Task management
│       ├── managers.py          # Manager management
│       ├── commissions.py       # Commission tracking
│       ├── providers.py         # Provider management
│       ├── emails.py            # Email management
│       └── health.py            # System health
├── core/
│   ├── config.py                # Configuration settings
│   ├── security.py              # Security utilities
│   └── database.py              # Database connection
├── models/
│   ├── user.py                  # User model
│   ├── account.py               # Account model
│   ├── task.py                  # Task model
│   ├── manager.py               # Manager model
│   ├── commission.py            # Commission model
│   ├── provider.py              # Provider model
│   └── email.py                 # Email model
├── schemas/
│   └── ...                      # Pydantic schemas
├── crud/
│   └── ...                      # Database operations
└── main.py                      # FastAPI application
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/token` - OAuth2 token endpoint
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user

### Accounts
- `GET /api/v1/accounts` - List accounts with pagination
- `GET /api/v1/accounts/{id}` - Get account details
- `POST /api/v1/accounts` - Create new account
- `PUT /api/v1/accounts/{id}` - Update account
- `DELETE /api/v1/accounts/{id}` - Delete account
- `POST /api/v1/accounts/{id}/refresh-usage` - Refresh usage data
- `POST /api/v1/accounts/{id}/generate-pricing` - Generate pricing
- `POST /api/v1/accounts/{id}/draft-contract` - Draft contract

### Tasks
- `GET /api/v1/tasks` - List tasks with filtering
- `GET /api/v1/tasks/{id}` - Get task details
- `POST /api/v1/tasks` - Create new task
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task
- `POST /api/v1/tasks/{id}/assign` - Assign task to user
- `POST /api/v1/tasks/{id}/complete` - Mark task as complete

### Managers
- `GET /api/v1/managers` - List managers
- `GET /api/v1/managers/{id}` - Get manager details
- `POST /api/v1/managers` - Create manager
- `PUT /api/v1/managers/{id}` - Update manager
- `DELETE /api/v1/managers/{id}` - Delete manager

### Commissions
- `GET /api/v1/commissions` - List commissions
- `GET /api/v1/commissions/{id}` - Get commission details
- `POST /api/v1/commissions` - Create commission
- `PUT /api/v1/commissions/{id}` - Update commission
- `POST /api/v1/commissions/{id}/process-payment` - Process payment

### Providers
- `GET /api/v1/providers` - List energy providers
- `GET /api/v1/providers/{id}` - Get provider details
- `POST /api/v1/providers` - Create provider
- `PUT /api/v1/providers/{id}` - Update provider
- `DELETE /api/v1/providers/{id}` - Delete provider

### Emails
- `GET /api/v1/emails` - List email drafts
- `GET /api/v1/emails/{id}` - Get email details
- `POST /api/v1/emails` - Create email draft
- `PUT /api/v1/emails/{id}` - Update email draft
- `DELETE /api/v1/emails/{id}` - Delete email draft
- `POST /api/v1/emails/{id}/send` - Send email
- `POST /api/v1/emails/bulk-send` - Bulk send emails

### System Health
- `GET /api/v1/health` - Get system health status
- `GET /api/v1/health/services` - Get individual service status
- `POST /api/v1/health/check` - Manual health check

## 🗃️ Database Models

### Core Models
- **User**: Authentication and user management
- **Account**: Business account information and usage data
- **Task**: Task queue management with assignments
- **Manager**: Manager profiles and performance metrics
- **Commission**: Commission tracking and payment processing
- **Provider**: Energy provider information and contracts
- **EmailDraft**: Email management and bulk operations
- **SystemHealth**: System monitoring and health metrics

### Relationships
- Users can have multiple accounts
- Managers are assigned to multiple accounts
- Tasks are assigned to users and linked to accounts
- Commissions are calculated based on account performance
- Providers supply energy to accounts

## ⚙️ Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/kilowatt_db
DATABASE_TEST_URL=postgresql://user:password@localhost/kilowatt_test_db

# Security
SECRET_KEY=your-secret-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Redis
REDIS_URL=redis://localhost:6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Application
DEBUG=True
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:3000"]

# External APIs
CENTERPOINT_API_URL=https://api.centerpoint.com
CENTERPOINT_API_KEY=your-api-key
```

## 🧪 Development

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Downgrade migration
alembic downgrade -1
```

### Running Tests
```bash
# Set up testing framework as needed
# Tests can be added to a tests/ directory
# Use pytest or unittest for testing
```

### Code Quality
```bash
# Format code
black .

# Sort imports
isort .

# Type checking
mypy .

# Linting
flake8 .
```

### Development Server
```bash
# Start with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 🚀 Deployment

### Docker Production
```bash
# Build image
docker build -t kilowatt-api .

# Run container
docker run -p 8000:8000 kilowatt-api
```

### Production Considerations

1. **Security**:
   - Use strong SECRET_KEY (32+ characters)
   - Enable HTTPS in production
   - Configure CORS origins properly
   - Use environment variables for all secrets

2. **Database**:
   - Use managed PostgreSQL service
   - Set up automated backups
   - Configure connection pooling
   - Monitor database performance

3. **Monitoring**:
   - Set up structured logging
   - Monitor API response times
   - Configure health check alerts
   - Track error rates and patterns

4. **Performance**:
   - Enable Redis caching
   - Configure database indexes
   - Use CDN for static files
   - Implement rate limiting

### Environment-Specific Settings

**Development:**
```env
DEBUG=True
LOG_LEVEL=DEBUG
CORS_ORIGINS=["http://localhost:3000"]
```

**Production:**
```env
DEBUG=False
LOG_LEVEL=INFO
CORS_ORIGINS=["https://yourdomain.com"]
```

## 📊 Monitoring

### Health Checks
The API includes comprehensive health monitoring:
- Database connectivity
- Redis connectivity
- External API availability
- System resource usage

### Logging
Structured logging with different levels:
- **DEBUG**: Detailed debugging information
- **INFO**: General operational messages
- **WARNING**: Warning conditions
- **ERROR**: Error conditions
- **CRITICAL**: Critical error conditions

### Metrics
Key metrics to monitor:
- Request/response times
- Error rates by endpoint
- Database query performance
- Cache hit/miss rates
- Active user sessions

## 🔒 Security

### Authentication Flow
1. User provides credentials
2. Server validates and returns JWT tokens
3. Client stores tokens securely
4. Client includes access token in requests
5. Server validates token on each request
6. Client refreshes tokens automatically

### Security Features
- Password hashing with bcrypt
- JWT token expiration
- Refresh token rotation
- CORS protection
- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Follow code style guidelines
6. Submit a pull request

### Code Style
- Follow PEP 8 guidelines
- Use type hints
- Write docstrings for functions
- Keep functions small and focused
- Use meaningful variable names

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://pydantic-docs.helpmanual.io/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- **v1.3.0** - Complete MUI conversion and responsive design
