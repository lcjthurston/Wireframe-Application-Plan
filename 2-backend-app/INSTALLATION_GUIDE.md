# 🔧 Installation Guide - Fixing Dependency Issues

The error you encountered is related to **Rust compilation requirements** for newer Pydantic versions on Windows. Here are several solutions:

## 🚀 **Quick Solution: Demo Only**

If you just want to run the demo server:

```bash
# Install minimal dependencies (no Rust compilation needed)
pip install -r requirements-demo.txt

# Run the demo server
python demo_server.py
```

This will give you the interactive API documentation at http://localhost:8001/docs

---

## 🛠️ **Full Installation Solutions**

### **Option 1: Use Pre-compiled Wheels (Recommended)**

```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Install packages one by one to avoid conflicts
pip install fastapi>=0.104.0
pip install "uvicorn[standard]>=0.24.0"
pip install "pydantic>=2.0.0,<2.5.0"  # Use older version to avoid Rust
pip install pydantic-settings>=2.0.0
pip install sqlalchemy>=2.0.0
pip install alembic>=1.12.0
pip install python-multipart>=0.0.6
pip install python-dotenv>=1.0.0
pip install httpx>=0.25.0

# Skip these for now if they cause issues:
# pip install psycopg2-binary  # Only needed for PostgreSQL
# pip install python-jose[cryptography]  # Only needed for JWT
# pip install passlib[bcrypt]  # Only needed for password hashing
```

### **Option 2: Install Visual Studio Build Tools (Windows)**

If you want the full installation:

1. **Download Visual Studio Build Tools**:
   - Go to: https://visualstudio.microsoft.com/downloads/
   - Download "Build Tools for Visual Studio 2022"
   - Install with "C++ build tools" workload

2. **Install Rust** (if needed):
   ```bash
   # Download and install from: https://rustup.rs/
   # Or use chocolatey:
   choco install rust
   ```

3. **Then install requirements**:
   ```bash
   pip install -r requirements.txt
   ```

### **Option 3: Use Conda (Alternative)**

```bash
# Install conda/miniconda first, then:
conda create -n kilowatt python=3.11
conda activate kilowatt
conda install -c conda-forge fastapi uvicorn sqlalchemy alembic pydantic
pip install pydantic-settings python-multipart python-dotenv httpx
```

### **Option 4: Docker (Easiest for Full Setup)**

```bash
# Use Docker to avoid all dependency issues
docker-compose up --build
```

---

## 🎯 **What Each Package Does**

| Package | Purpose | Required For |
|---------|---------|--------------|
| **fastapi** | Web framework | ✅ Core API |
| **uvicorn** | ASGI server | ✅ Running server |
| **pydantic** | Data validation | ✅ API schemas |
| **sqlalchemy** | Database ORM | 🗄️ Database operations |
| **alembic** | Database migrations | 🗄️ Database setup |
| **psycopg2-binary** | PostgreSQL driver | 🗄️ PostgreSQL only |
| **python-jose** | JWT tokens | 🔐 Authentication |
| **passlib** | Password hashing | 🔐 User passwords |
| **python-multipart** | File uploads | 📁 Form handling |
| **httpx** | HTTP client | 🌐 External APIs |

---

## 📋 **Installation Priority**

### **Phase 1: Core Demo (No Database)**
```bash
pip install fastapi uvicorn pydantic
python demo_server.py  # Works immediately
```

### **Phase 2: Add Database Support**
```bash
pip install sqlalchemy alembic python-multipart python-dotenv
# Now you can set up real database
```

### **Phase 3: Add Security**
```bash
pip install python-jose[cryptography] passlib[bcrypt]
# Now you have full authentication
```

### **Phase 4: Add External Services**
```bash
pip install httpx redis celery psycopg2-binary
# Now you have full production features
```

---

## 🔍 **Troubleshooting Common Issues**

### **"Microsoft Visual C++ 14.0 is required"**
- Install Visual Studio Build Tools (Option 2 above)
- Or use pre-compiled wheels (Option 1 above)

### **"Rust compiler not found"**
- Install Rust from https://rustup.rs/
- Or use older Pydantic version: `pip install "pydantic<2.5.0"`

### **"psycopg2 installation error"**
- Use `psycopg2-binary` instead of `psycopg2`
- Or skip PostgreSQL for now and use SQLite

### **"python-jose cryptography error"**
- Install without cryptography: `pip install python-jose`
- Or use alternative: `pip install PyJWT`

---

## ✅ **Verification Steps**

After installation, test what works:

```bash
# Test 1: Basic demo (should always work)
python quick_demo.py

# Test 2: API demo (needs fastapi + uvicorn)
python demo_server.py

# Test 3: Full backend (needs all dependencies)
python -c "from app.main import app; print('✅ Full backend ready!')"
```

---

## 🎯 **Recommended Approach**

1. **Start with demo**: `pip install -r requirements-demo.txt`
2. **Run demos**: See what's already built
3. **Add database later**: When you're ready for full setup
4. **Use Docker**: For production deployment

The backend structure and business logic are complete - you can see everything working with just the demo! 🚀
