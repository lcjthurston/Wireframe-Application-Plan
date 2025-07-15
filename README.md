# Kilowatt Business Intelligence Platform

A comprehensive business intelligence platform for energy management, featuring a React frontend and FastAPI backend for managing accounts, tasks, commissions, and system automation.

## 🏗️ Project Structure

```
kilowatt-platform/
├── 1-frontend-app/          # React frontend application
├── 2-backend-app/           # FastAPI backend API
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ (for frontend)
- **Python** 3.11+ (for backend)
- **Docker & Docker Compose** (recommended)
- **PostgreSQL** (if not using Docker)
- **Redis** (if not using Docker)

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kilowatt-platform
   ```

2. **Start all services**
   ```bash
   cd 2-backend-app
   docker-compose up --build
   ```

3. **Start the frontend** (in a new terminal)
   ```bash
   cd 1-frontend-app
   npm install
   npm start
   ```

4. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Option 2: Manual Setup

1. **Backend Setup**
   ```bash
   cd 2-backend-app
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp env.example .env
   # Edit .env with your configuration
   alembic upgrade head
   uvicorn app.main:app --reload
   ```

2. **Frontend Setup**
   ```bash
   cd 1-frontend-app
   npm install
   npm start
   ```

## 🎯 Features

### Frontend (React + Material-UI)
- **Modern UI**: Material-UI components with professional styling
- **Authentication**: Persistent login with JWT tokens
- **Responsive Design**: Mobile-first approach
- **Dashboard Management**: Multiple specialized dashboards
- **Lottie Animations**: Enhanced user experience
- **Real-time Updates**: Live data synchronization

### Backend (FastAPI + PostgreSQL)
- **RESTful API**: Comprehensive API endpoints
- **Authentication**: JWT-based with refresh tokens
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Caching**: Redis for performance optimization
- **Documentation**: Auto-generated Swagger/OpenAPI docs
- **Testing**: Comprehensive test suite

## 📊 Business Modules

- **Account Management**: Complete CRUD for business accounts
- **Task Management**: Task queue with assignment tracking
- **Manager Management**: Manager profiles and performance
- **Commission Tracking**: Commission calculation and payments
- **Provider Management**: Energy provider information
- **Email Management**: Email drafts and bulk sending
- **System Health**: Real-time monitoring and alerts

## 🛠️ Technology Stack

### Frontend
- React 18
- Material-UI (MUI)
- Styled-Components
- Lottie Animations
- Axios for API calls

### Backend
- FastAPI 0.104.1
- PostgreSQL + SQLAlchemy
- Redis for caching
- JWT Authentication
- Pydantic validation
- Alembic migrations

### DevOps
- Docker & Docker Compose
- GitHub Actions CI/CD
- Heroku deployment ready

## 📚 Documentation

- [Frontend Documentation](1-frontend-app/README.md)
- [Backend Documentation](2-backend-app/README.md)

## 🔧 Development

### Running Tests

**Backend:**
```bash
cd 2-backend-app
pytest
```

**Frontend:**
```bash
cd 1-frontend-app
npm test
```

### Code Quality

**Backend:**
```bash
black .
isort .
mypy .
```

**Frontend:**
```bash
npm run lint
npm run format
```

## 🚀 Deployment

### Production Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
SECRET_KEY=your-production-secret-key
REDIS_URL=redis://host:6379
DEBUG=False
ENVIRONMENT=production
```

**Frontend:**
```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_USE_MOCK_AUTH=false
```

### Docker Production

```bash
# Build and run backend
cd 2-backend-app
docker build -t kilowatt-api .
docker run -p 8000:8000 kilowatt-api

# Build and run frontend
cd 1-frontend-app
docker build -t kilowatt-frontend .
docker run -p 3000:3000 kilowatt-frontend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary to Kilowatt. All rights reserved.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in each app directory

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added Lottie animations and enhanced UI
- **v1.2.0** - Persistent authentication and navigation
- **v1.3.0** - Complete MUI conversion and responsive design
