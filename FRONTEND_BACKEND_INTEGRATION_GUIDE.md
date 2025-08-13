# Frontend-Backend Integration Guide

## 🎯 **Current Status**

✅ **Backend Database**: Fully populated with Excel data (5,481 accounts, 21,550 ESIIDs, etc.)  
✅ **Backend API**: Complete FastAPI with all endpoints  
✅ **Frontend Infrastructure**: API service layer, data service with fallback, configuration system  
🔄 **Integration**: AccountsList component updated to use data service  
⏳ **Remaining**: Other components, backend server setup, full testing  

## 🚀 **Quick Start: Switch to Backend Mode**

### **Option 1: Environment Variables (Recommended)**
```bash
# In 1-frontend directory
cp .env.example .env.local

# Edit .env.local:
REACT_APP_USE_BACKEND_API=true
REACT_APP_USE_MOCK_AUTH=false
REACT_APP_API_URL=http://localhost:8000
```

### **Option 2: Direct Configuration**
Edit `1-frontend/src/config/app.js`:
```javascript
const USE_BACKEND_API = true;  // Change to true
const USE_MOCK_AUTH = false;   // Change to false
```

## 📋 **Complete Integration Steps**

### **Phase 1: Foundation ✅ COMPLETE**
- [x] Create API service layer (`src/services/api.js`)
- [x] Create data service with fallback (`src/services/dataService.js`)
- [x] Create configuration system (`src/config/app.js`)
- [x] Update AccountsList component

### **Phase 2: Backend Setup (15 minutes)**

1. **Start Backend Server**
   ```bash
   cd 2-backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

2. **Verify Backend Health**
   ```bash
   curl http://localhost:8000/health
   # Should return: {"status": "healthy"}
   ```

3. **Test API Endpoints**
   ```bash
   curl http://localhost:8000/api/v1/accounts?limit=5
   curl http://localhost:8000/api/v1/esiids?limit=5
   ```

### **Phase 3: Frontend Components (30 minutes)**

Update remaining components to use data service:

1. **ESIIDDashboard** (`src/components/ESIIDDashboard/index.js`)
   ```javascript
   import { dataServices } from '../../services/dataService';
   
   // Replace:
   const esiidsData = await import('../../data/esiids.json');
   
   // With:
   const esiids = await dataServices.esiids.getAll();
   ```

2. **ManagerDashboard** (`src/components/ManagerDashboard/index.js`)
   ```javascript
   const managers = await dataServices.managers.getAll();
   ```

3. **CommissionDashboard** (`src/components/CommissionDashboard/index.js`)
   ```javascript
   const commissions = await dataServices.commissions.getAll();
   ```

4. **Other Components**: Follow same pattern

### **Phase 4: Authentication (15 minutes)**

1. **Switch to Backend Auth**
   ```javascript
   // In .env.local
   REACT_APP_USE_MOCK_AUTH=false
   ```

2. **Test Login**
   - Backend should have user creation endpoint
   - Or use existing auth system

### **Phase 5: Advanced Features (30 minutes)**

1. **Real-time Updates**
   ```javascript
   // Enable in config
   REACT_APP_ENABLE_REAL_TIME_UPDATES=true
   ```

2. **Pagination**
   ```javascript
   const accounts = await dataServices.accounts.getAll({
     page: 1,
     limit: 50,
     search: 'searchTerm'
   });
   ```

3. **Data Refresh**
   ```javascript
   // Already implemented in AccountsList
   const handleRefresh = () => {
     dataServices.cache.clearKey('accounts');
     // Reload data
   };
   ```

## 🔧 **Configuration Options**

### **Data Source Modes**

| Mode | Backend API | Static JSON | Use Case |
|------|-------------|-------------|----------|
| **Development** | ❌ | ✅ | Frontend development without backend |
| **Integration** | ✅ | ✅ (fallback) | Testing with backend, fallback to JSON |
| **Production** | ✅ | ❌ | Live application with real backend |

### **Environment Variables**

```bash
# Backend Connection
REACT_APP_API_URL=http://localhost:8000
REACT_APP_USE_BACKEND_API=true

# Authentication
REACT_APP_USE_MOCK_AUTH=false

# Development
REACT_APP_DEBUG=true
REACT_APP_SHOW_DATA_SOURCE=true

# Features
REACT_APP_ENABLE_REAL_TIME_UPDATES=true
REACT_APP_ENABLE_PAGINATION=true
```

## 🧪 **Testing the Integration**

### **1. Test Data Loading**
```javascript
// In browser console
import { dataServices } from './src/services/dataService';
const accounts = await dataServices.accounts.getAll();
console.log(`Loaded ${accounts.length} accounts`);
```

### **2. Test Backend Connection**
```javascript
import { API } from './src/services/api';
const health = await API.health.check();
console.log('Backend health:', health);
```

### **3. Test Fallback**
```javascript
// Stop backend server, refresh page
// Should automatically fall back to JSON files
```

## 🚨 **Troubleshooting**

### **Backend Not Starting**
```bash
# Check Python version
python --version  # Should be 3.7+

# Install dependencies
cd 2-backend
pip install -r requirements.txt

# Check database
python -c "import sqlite3; print('Database exists:', os.path.exists('kilowatt_dev.db'))"
```

### **CORS Issues**
Add to backend `main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Data Not Loading**
1. Check browser console for errors
2. Verify API endpoints in Network tab
3. Check data service cache: `dataServices.cache.getStats()`
4. Clear cache: `dataServices.cache.clear()`

## 📊 **Benefits of This Architecture**

1. **Gradual Migration**: Switch components one by one
2. **Fallback Safety**: Always works even if backend is down
3. **Development Flexibility**: Work with or without backend
4. **Performance**: Caching and optimized loading
5. **Debugging**: Clear data source indicators
6. **Scalability**: Easy to add new features

## 🎉 **Next Steps**

1. **Start Backend Server**: Follow Phase 2 instructions
2. **Switch to Backend Mode**: Update environment variables
3. **Update Components**: Convert remaining components to use data service
4. **Test Integration**: Verify all functionality works
5. **Add Advanced Features**: Real-time updates, pagination, etc.

---

**The foundation is complete! You now have a flexible system that can work with both static data and a live backend API.**
