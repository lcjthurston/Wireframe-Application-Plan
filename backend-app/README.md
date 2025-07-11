# Kilowatt Business Intelligence API

A FastAPI-based backend for the Kilowatt Business Intelligence Platform, providing comprehensive APIs for account management, task tracking, commission management, and system automation.

## Features

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

## Technology Stack

- **Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL with SQLAlchemy
- **Authentication**: JWT with python-jose
- **Password Hashing**: bcrypt with passlib
- **Validation**: Pydantic
- **Caching**: Redis
- **Documentation**: Swagger/OpenAPI

## Quick Start

### Prerequisites

- Python 3.11+
- Docker and Docker Compose
- PostgreSQL (if not using Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend-app
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Using Docker (Recommended)**
   ```bash
   docker-compose up --build
   ```

4. **Manual Setup**
   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Set up database
   # Create PostgreSQL database and update DATABASE_URL in .env
   
   # Run migrations
   alembic upgrade head
   
   # Start the server
   uvicorn app.main:app --reload
   ```

## API Documentation

Once the server is running, you can access:

- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/token` - OAuth2 token endpoint
- `GET /api/v1/auth/me` - Get current user

### Accounts
- `GET /api/v1/accounts` - List accounts
- `GET /api/v1/accounts/{id}` - Get account details
- `POST /api/v1/accounts` - Create account
- `PUT /api/v1/accounts/{id}` - Update account
- `DELETE /api/v1/accounts/{id}` - Delete account
- `POST /api/v1/accounts/{id}/refresh-usage` - Refresh usage data
- `POST /api/v1/accounts/{id}/generate-pricing` - Generate pricing
- `POST /api/v1/accounts/{id}/draft-contract` - Draft contract

### Tasks
- `GET /api/v1/tasks` - List tasks
- `GET /api/v1/tasks/{id}` - Get task details
- `POST /api/v1/tasks` - Create task
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task
- `POST /api/v1/tasks/{id}/assign` - Assign task
- `POST /api/v1/tasks/{id}/complete` - Complete task

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
- `GET /api/v1/providers` - List providers
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
- `GET /api/v1/health` - Get system health
- `GET /api/v1/health/services` - Get services status
- `POST /api/v1/health/check` - Manual health check

## Database Models

The application includes the following data models:

- **User**: Authentication and user management
- **Account**: Business account information
- **Task**: Task queue management
- **Manager**: Manager profiles and performance
- **Commission**: Commission tracking and payments
- **Provider**: Energy provider information
- **EmailDraft**: Email management
- **SystemHealth**: System monitoring

## Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black .
isort .
```

### Type Checking
```bash
mypy .
```

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head
```

## Environment Variables

Key environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key
- `REDIS_URL`: Redis connection string
- `DEBUG`: Enable debug mode
- `CORS_ORIGINS`: Allowed CORS origins

## Deployment

### Docker Deployment
```bash
docker build -t kilowatt-api .
docker run -p 8000:8000 kilowatt-api
```

### Production Considerations

1. **Security**:
   - Use strong SECRET_KEY
   - Enable HTTPS
   - Configure CORS properly
   - Use environment variables for secrets

2. **Database**:
   - Use managed PostgreSQL service
   - Set up database backups
   - Configure connection pooling

3. **Monitoring**:
   - Set up logging
   - Monitor system health
   - Configure alerts

4. **Performance**:
   - Enable Redis caching
   - Configure database indexes
   - Use CDN for static files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License. 