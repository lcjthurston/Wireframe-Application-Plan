#!/usr/bin/env python3
"""
Initialize database and create test user
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models.user import User
from app.core.security import get_password_hash

# Database setup
DATABASE_URL = "sqlite:///./kilowatt_dev.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_database():
    """Initialize database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

def create_test_user():
    """Create a test user for authentication"""
    db = SessionLocal()
    try:
        # Check if any users exist
        user_count = db.query(User).count()
        print(f'Total users in database: {user_count}')
        
        if user_count == 0:
            print('No users found. Creating test user...')
            # Create a test user
            test_user = User(
                username='admin',
                email='admin@kilowatt.com',
                hashed_password=get_password_hash('admin123'),
                is_active=True,
                role='admin'
            )
            db.add(test_user)
            db.commit()
            print('✅ Test user created successfully!')
            print('   Username: admin')
            print('   Password: admin123')
            print('   Email: admin@kilowatt.com')
        else:
            # Show existing users
            users = db.query(User).all()
            print('Existing users:')
            for user in users:
                print(f'  - {user.username} ({user.email}) - Active: {user.is_active}')
                
    except Exception as e:
        print(f'❌ Error creating user: {e}')
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Initializing Kilowatt Database...")
    init_database()
    create_test_user()
    print("✅ Database initialization complete!")
