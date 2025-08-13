# Kilowatt Testing & Debugging Scripts

This folder contains testing and debugging scripts for the Kilowatt Business Intelligence Platform.

## 🧪 **Testing Scripts**

### **Backend Testing**
- **[test_backend.py](test_backend.py)** - Basic backend functionality tests
- **[test_backend_api.py](test_backend_api.py)** - Comprehensive API endpoint testing
- **[manual_backend_test.py](manual_backend_test.py)** - Manual backend verification without server

### **Integration Testing**
- **[test_integration.py](test_integration.py)** - Full frontend-backend integration tests

### **Database Testing**
- **[debug_database.py](debug_database.py)** - Database connection and query debugging
- **[diagnose_backend.py](diagnose_backend.py)** - Backend diagnostic and troubleshooting

### **Server Testing**
- **[quick_server_test.py](quick_server_test.py)** - Quick server functionality verification

## 🔧 **Usage Instructions**

### **Before Running Tests**
1. Ensure Python virtual environment is activated
2. Install required dependencies: `pip install -r ../2-backend/requirements.txt`
3. Ensure database file exists: `../2-backend/kilowatt_dev.db`

### **Backend Testing Workflow**
```bash
# 1. Test basic backend functionality
python test_backend.py

# 2. Start backend server (in separate terminal)
cd ../2-backend
.venv\Scripts\activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# 3. Test API endpoints
python test_backend_api.py

# 4. Test full integration
python test_integration.py
```

### **Debugging Workflow**
```bash
# 1. Diagnose backend issues
python diagnose_backend.py

# 2. Debug database connection
python debug_database.py

# 3. Quick server verification
python quick_server_test.py
```

## 📊 **Test Categories**

### **Unit Tests**
- Database model testing
- API endpoint functionality
- Configuration validation

### **Integration Tests**
- Frontend-backend communication
- Data flow verification
- Authentication testing

### **System Tests**
- Full application workflow
- Performance testing
- Error handling verification

## 🚨 **Troubleshooting Guide**

### **Common Issues**

#### **Database Connection Errors**
```bash
# Run database diagnostic
python debug_database.py

# Check database file exists
ls -la ../2-backend/kilowatt_dev.db
```

#### **API Authentication Errors**
```bash
# Test with authentication bypass
python test_backend_api.py

# Check server logs for detailed errors
```

#### **Import/Module Errors**
```bash
# Verify Python path and virtual environment
python diagnose_backend.py

# Check all dependencies installed
pip list
```

### **Test Results Interpretation**

#### **✅ PASS** - Test completed successfully
#### **❌ FAIL** - Test failed, check error messages
#### **⚠️ SKIP** - Test skipped due to prerequisites
#### **🔄 RETRY** - Test needs to be retried

## 📝 **Adding New Tests**

When adding new tests:
1. Follow the naming convention: `test_[component]_[feature].py`
2. Include comprehensive error handling
3. Add clear success/failure indicators
4. Update this README with new test descriptions
5. Include usage examples

## 🎯 **Test Coverage**

Current test coverage includes:
- ✅ Database connectivity
- ✅ API endpoint functionality  
- ✅ Frontend-backend integration
- ✅ Authentication systems
- ✅ Data processing workflows
- ⏳ Performance testing (planned)
- ⏳ Load testing (planned)

---

**Last Updated**: August 2025  
**Test Framework**: Python unittest + custom testing utilities
