#!/usr/bin/env python3
"""
Manager Data Import Script for Kilowatt Platform
Imports manager data from MANAGER LIST.xlsx into the database
"""

import pandas as pd
import sys
import os
from pathlib import Path
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func

# Create standalone database models
Base = declarative_base()

class Manager(Base):
    __tablename__ = "managers"

    id = Column(Integer, primary_key=True, index=True)
    mgr_id = Column(Integer, unique=True, index=True)
    name = Column(String, nullable=False)
    mgr_status = Column(String)
    mgr_class = Column(String)
    management_company = Column(String)
    office = Column(String)
    office_city = Column(String)
    supervisor = Column(String)
    admin_assistant = Column(String)
    email = Column(String, index=True)
    assistant_email = Column(String)
    phone = Column(String)
    cell = Column(String)
    fax = Column(String)
    mgr_note = Column(Text)
    last_update = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

def clean_manager_data(df):
    """Clean and prepare manager data for import"""
    print(f"📊 Original data: {len(df)} rows")
    
    # Remove rows where MANAGER is null or just '?'
    df = df[df['MANAGER'].notna()]
    df = df[df['MANAGER'] != '?']
    df = df[df['MANAGER'].str.strip() != '']
    
    print(f"📊 After removing invalid managers: {len(df)} rows")
    
    # Clean up data
    df['MANAGER'] = df['MANAGER'].str.strip()
    df['MGMT CO'] = df['MGMT CO'].fillna('').str.strip()
    df['OFFICE_CITY'] = df['OFFICE_CITY'].fillna('').str.strip()
    df['EMAIL'] = df['EMAIL'].fillna('').str.strip()
    df['PHONE'] = df['PHONE'].fillna('').str.strip()
    
    # Convert empty strings to None for optional fields
    for col in ['MGMT CO', 'OFFICE_CITY', 'EMAIL', 'PHONE', 'CELL', 'FAX', 
                'MGR_STATUS', 'MGR_CLASS', 'OFFICE', 'SUPERVISOR', 'ADM_ASST', 'MGR NOTE']:
        if col in df.columns:
            df[col] = df[col].replace('', None)
    
    return df

def import_managers():
    """Import manager data from Excel file"""
    
    # Check if Excel file exists
    excel_file = Path("Exports/MANAGER LIST.xlsx")
    if not excel_file.exists():
        print(f"❌ Excel file not found: {excel_file}")
        return False
    
    print(f"📖 Reading manager data from {excel_file}")
    
    try:
        # Read Excel file
        df = pd.read_excel(excel_file, sheet_name="MANAGER LIST")
        print(f"📊 Loaded {len(df)} rows from Excel")
        
        # Clean data
        df = clean_manager_data(df)
        
        # Create database connection
        database_url = "sqlite:///./2-backend/kilowatt_dev.db"
        engine = create_engine(database_url)
        
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        
        # Create session
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        try:
            # Clear existing managers (for clean import)
            print("🗑️ Clearing existing manager data...")
            db.query(Manager).delete()
            db.commit()
            
            # Import managers
            imported_count = 0
            for index, row in df.iterrows():
                try:
                    manager = Manager(
                        mgr_id=int(row['MGR_ID']) if pd.notna(row['MGR_ID']) else None,
                        name=row['MANAGER'],
                        mgr_status=row.get('MGR_STATUS'),
                        mgr_class=row.get('MGR_CLASS'),
                        management_company=row.get('MGMT CO'),
                        office=row.get('OFFICE'),
                        office_city=row.get('OFFICE_CITY'),
                        supervisor=row.get('SUPERVISOR'),
                        admin_assistant=row.get('ADM_ASST'),
                        email=row.get('EMAIL'),
                        assistant_email=row.get('ASST_EMAIL'),
                        phone=row.get('PHONE'),
                        cell=row.get('CELL'),
                        fax=row.get('FAX'),
                        mgr_note=row.get('MGR NOTE'),
                        last_update=str(row.get('UDPATE')) if pd.notna(row.get('UDPATE')) else None,
                        is_active=True
                    )
                    
                    db.add(manager)
                    imported_count += 1
                    
                    if imported_count % 100 == 0:
                        print(f"📥 Imported {imported_count} managers...")
                        
                except Exception as e:
                    print(f"⚠️ Error importing manager {row.get('MANAGER', 'Unknown')}: {e}")
                    continue
            
            # Commit all changes
            db.commit()
            print(f"✅ Successfully imported {imported_count} managers!")
            
            # Show some statistics
            total_managers = db.query(Manager).count()
            active_managers = db.query(Manager).filter(Manager.is_active == True).count()
            with_email = db.query(Manager).filter(Manager.email.isnot(None), Manager.email != '').count()
            with_phone = db.query(Manager).filter(Manager.phone.isnot(None), Manager.phone != '').count()
            
            print(f"\n📊 Import Statistics:")
            print(f"   Total managers: {total_managers}")
            print(f"   Active managers: {active_managers}")
            print(f"   With email: {with_email}")
            print(f"   With phone: {with_phone}")
            
            # Show top management companies
            print(f"\n🏢 Top Management Companies:")
            companies = db.query(Manager.management_company).filter(
                Manager.management_company.isnot(None)
            ).all()
            company_counts = {}
            for (company,) in companies:
                company_counts[company] = company_counts.get(company, 0) + 1
            
            for company, count in sorted(company_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
                print(f"   {company}: {count} managers")
            
            return True
            
        except Exception as e:
            print(f"❌ Database error: {e}")
            db.rollback()
            return False
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Error reading Excel file: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Manager Data Import...")
    success = import_managers()
    if success:
        print("✅ Manager import completed successfully!")
    else:
        print("❌ Manager import failed!")
        sys.exit(1)
