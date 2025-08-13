# Kilowatt Scripts Directory

This directory contains all Python scripts organized by functionality for better maintainability and clarity.

## 📁 Directory Structure

```
scripts/
├── import/          # Data import scripts (Excel → Database)
├── export/          # Data export scripts (Database → JSON)
├── analysis/        # Data analysis and processing scripts
├── verification/    # Integration verification scripts
├── utilities/       # Database utilities and helper scripts
└── README.md        # This file
```

## 🔄 Import Scripts (`import/`)

Scripts that import data from Excel files into the SQLite database:

- **`import_accounts.py`** - Import account data from `cr187_account_lists.xlsx`
- **`import_commission_data.py`** - Import commission data from commission Excel files
- **`import_companies.py`** - Import management companies from `MGMT COMPANIES.xlsx`
- **`import_daily_pricing.py`** - Import daily pricing data from `DAILY PRICING - new.xlsx`
- **`import_esiids.py`** - Import ESIID data from `ESIID DATA.xlsx`
- **`import_managers.py`** - Import manager data from `MANAGER LIST.xlsx`
- **`import_reps.py`** - Import REP data from `REP.xlsx`
- **`simple_import.py`** - Simplified manager import script
- **`test_import.py`** - Test import functionality

### Usage Example:
```bash
cd scripts/import
python import_accounts.py
```

## 📤 Export Scripts (`export/`)

Scripts that export data from the database to JSON files for frontend consumption:

- **`get_accounts_data.py`** - Export account data to `1-frontend/src/data/accounts.json`
- **`get_commission_data.py`** - Export commission data to JSON
- **`get_companies_data.py`** - Export company data to JSON
- **`get_esiids_data.py`** - Export ESIID data to JSON
- **`get_managers_data.py`** - Export manager data to JSON
- **`get_pricing_data.py`** - Export pricing data to JSON
- **`get_providers_data.py`** - Export provider data to JSON

### Usage Example:
```bash
cd scripts/export
python get_accounts_data.py
```

## 📊 Analysis Scripts (`analysis/`)

Scripts for data analysis, processing, and insights:

- **`analytics_engine.py`** - Main analytics processing engine
- **`analyze_commission_data.py`** - Commission data analysis
- **`analyze_companies.py`** - Company data analysis
- **`analyze_daily_pricing.py`** - Daily pricing analysis
- **`analyze_esiid.py`** - ESIID data analysis
- **`analyze_exports.py`** - Export data analysis
- **`analyze_forecasting_data.py`** - Forecasting analysis
- **`analyze_reps.py`** - REP data analysis

### Usage Example:
```bash
cd scripts/analysis
python analytics_engine.py
```

## ✅ Verification Scripts (`verification/`)

Scripts to verify data integrity and integration success:

- **`verify_analytics_integration.py`** - Verify analytics integration
- **`verify_commission_integration.py`** - Verify commission data integration
- **`verify_esiid_integration.py`** - Verify ESIID integration
- **`verify_integration.py`** - General integration verification
- **`verify_pricing_integration.py`** - Verify pricing integration
- **`verify_rep_integration.py`** - Verify REP integration

### Usage Example:
```bash
cd scripts/verification
python verify_integration.py
```

## 🛠️ Utility Scripts (`utilities/`)

Database utilities and helper scripts:

- **`check_database.py`** - Database health and structure checks
- **`check_table_structure.py`** - Table structure verification
- **`link_esiid_relationships.py`** - Link ESIID relationships
- **`link_managers_companies.py`** - Link manager-company relationships

### Usage Example:
```bash
cd scripts/utilities
python check_database.py
```

## 🚀 Quick Start Guide

### 1. Complete Data Import
```bash
# Import all data from Excel files
cd scripts/import
python import_accounts.py
python import_esiids.py
python import_managers.py
python import_companies.py
python import_commission_data.py
python import_daily_pricing.py
python import_reps.py
```

### 2. Export Data for Frontend
```bash
# Export all data to JSON for frontend
cd scripts/export
python get_accounts_data.py
python get_esiids_data.py
python get_managers_data.py
python get_companies_data.py
python get_commission_data.py
python get_pricing_data.py
python get_providers_data.py
```

### 3. Verify Integration
```bash
# Verify all integrations
cd scripts/verification
python verify_integration.py
python verify_esiid_integration.py
python verify_commission_integration.py
```

## 📋 Prerequisites

- Python 3.7+
- Required packages: `pandas`, `sqlite3`, `pathlib`
- Excel files in the `Exports/` directory
- SQLite database at `2-backend/kilowatt_dev.db`

## 🔧 Configuration

Most scripts are configured to work with the standard project structure:
- **Database**: `2-backend/kilowatt_dev.db`
- **Excel Files**: `Exports/` directory
- **Frontend Data**: `1-frontend/src/data/` directory

## 📝 Notes

- All scripts include comprehensive error handling and logging
- Import scripts process data in batches for optimal performance
- Export scripts format data specifically for frontend consumption
- Verification scripts provide detailed reports on data integrity
- Run scripts from their respective directories for proper path resolution

## 🆘 Troubleshooting

If you encounter issues:

1. **Database not found**: Ensure `2-backend/kilowatt_dev.db` exists
2. **Excel file not found**: Check that files exist in `Exports/` directory
3. **Permission errors**: Ensure write permissions for output directories
4. **Import errors**: Check that all required Python packages are installed

For detailed logs and error messages, check the console output when running scripts.
