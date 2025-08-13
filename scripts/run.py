#!/usr/bin/env python3
"""
Kilowatt Scripts Runner
A convenient script to run common operations from the scripts directory
"""

import os
import sys
import subprocess
from pathlib import Path

def run_script(script_path, description):
    """Run a script and handle errors"""
    print(f"\n🔄 {description}")
    print(f"Running: {script_path}")
    print("-" * 50)
    
    try:
        result = subprocess.run([sys.executable, script_path], 
                              capture_output=False, 
                              text=True, 
                              cwd=Path(script_path).parent)
        if result.returncode == 0:
            print(f"✅ {description} completed successfully!")
        else:
            print(f"❌ {description} failed with return code {result.returncode}")
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error running {script_path}: {e}")
        return False

def main():
    """Main script runner"""
    if len(sys.argv) < 2:
        print("""
🚀 Kilowatt Scripts Runner

Usage: python run.py <command>

Available commands:

📥 IMPORT COMMANDS:
  import-all          Import all data from Excel files
  import-accounts     Import account data
  import-esiids       Import ESIID data
  import-managers     Import manager data
  import-companies    Import company data
  import-commissions  Import commission data
  import-pricing      Import pricing data
  import-reps         Import REP data

📤 EXPORT COMMANDS:
  export-all          Export all data to JSON
  export-accounts     Export account data
  export-esiids       Export ESIID data
  export-managers     Export manager data
  export-companies    Export company data
  export-commissions  Export commission data
  export-pricing      Export pricing data

✅ VERIFICATION COMMANDS:
  verify-all          Verify all integrations
  verify-accounts     Verify account integration
  verify-esiids       Verify ESIID integration
  verify-commissions  Verify commission integration

🛠️ UTILITY COMMANDS:
  check-db            Check database health
  check-tables        Check table structures

🔄 WORKFLOW COMMANDS:
  full-setup          Complete setup: import all → export all → verify all
  refresh-frontend    Export all data for frontend consumption

Examples:
  python run.py import-all
  python run.py export-accounts
  python run.py full-setup
        """)
        return

    command = sys.argv[1].lower()
    scripts_dir = Path(__file__).parent
    
    # Import commands
    if command == "import-all":
        scripts = [
            ("import/import_accounts.py", "Import Accounts"),
            ("import/import_esiids.py", "Import ESIIDs"),
            ("import/import_managers.py", "Import Managers"),
            ("import/import_companies.py", "Import Companies"),
            ("import/import_commission_data.py", "Import Commissions"),
            ("import/import_daily_pricing.py", "Import Pricing"),
            ("import/import_reps.py", "Import REPs")
        ]
        for script, desc in scripts:
            if not run_script(scripts_dir / script, desc):
                print(f"\n💥 Import process stopped due to error in {desc}")
                return
        print("\n🎉 All imports completed successfully!")
    
    elif command == "import-accounts":
        run_script(scripts_dir / "import/import_accounts.py", "Import Accounts")
    
    elif command == "import-esiids":
        run_script(scripts_dir / "import/import_esiids.py", "Import ESIIDs")
    
    elif command == "import-managers":
        run_script(scripts_dir / "import/import_managers.py", "Import Managers")
    
    elif command == "import-companies":
        run_script(scripts_dir / "import/import_companies.py", "Import Companies")
    
    elif command == "import-commissions":
        run_script(scripts_dir / "import/import_commission_data.py", "Import Commissions")
    
    elif command == "import-pricing":
        run_script(scripts_dir / "import/import_daily_pricing.py", "Import Pricing")
    
    elif command == "import-reps":
        run_script(scripts_dir / "import/import_reps.py", "Import REPs")
    
    # Export commands
    elif command == "export-all":
        scripts = [
            ("export/get_accounts_data.py", "Export Accounts"),
            ("export/get_esiids_data.py", "Export ESIIDs"),
            ("export/get_managers_data.py", "Export Managers"),
            ("export/get_companies_data.py", "Export Companies"),
            ("export/get_commission_data.py", "Export Commissions"),
            ("export/get_pricing_data.py", "Export Pricing"),
            ("export/get_providers_data.py", "Export Providers")
        ]
        for script, desc in scripts:
            run_script(scripts_dir / script, desc)
        print("\n🎉 All exports completed!")
    
    elif command == "export-accounts":
        run_script(scripts_dir / "export/get_accounts_data.py", "Export Accounts")
    
    elif command == "export-esiids":
        run_script(scripts_dir / "export/get_esiids_data.py", "Export ESIIDs")
    
    elif command == "export-managers":
        run_script(scripts_dir / "export/get_managers_data.py", "Export Managers")
    
    elif command == "export-companies":
        run_script(scripts_dir / "export/get_companies_data.py", "Export Companies")
    
    elif command == "export-commissions":
        run_script(scripts_dir / "export/get_commission_data.py", "Export Commissions")
    
    elif command == "export-pricing":
        run_script(scripts_dir / "export/get_pricing_data.py", "Export Pricing")
    
    # Verification commands
    elif command == "verify-all":
        scripts = [
            ("verification/verify_integration.py", "Verify General Integration"),
            ("verification/verify_esiid_integration.py", "Verify ESIID Integration"),
            ("verification/verify_commission_integration.py", "Verify Commission Integration")
        ]
        for script, desc in scripts:
            run_script(scripts_dir / script, desc)
        print("\n🎉 All verifications completed!")
    
    elif command == "verify-accounts":
        run_script(scripts_dir / "verification/verify_integration.py", "Verify Account Integration")
    
    elif command == "verify-esiids":
        run_script(scripts_dir / "verification/verify_esiid_integration.py", "Verify ESIID Integration")
    
    elif command == "verify-commissions":
        run_script(scripts_dir / "verification/verify_commission_integration.py", "Verify Commission Integration")
    
    # Utility commands
    elif command == "check-db":
        run_script(scripts_dir / "utilities/check_database.py", "Check Database")
    
    elif command == "check-tables":
        run_script(scripts_dir / "utilities/check_table_structure.py", "Check Table Structure")
    
    # Workflow commands
    elif command == "full-setup":
        print("🚀 Starting full setup process...")
        
        # Import all data
        print("\n📥 PHASE 1: Importing all data...")
        if not run_script(scripts_dir / "run.py", "import-all"):
            return
        
        # Export all data
        print("\n📤 PHASE 2: Exporting all data...")
        subprocess.run([sys.executable, scripts_dir / "run.py", "export-all"])
        
        # Verify integrations
        print("\n✅ PHASE 3: Verifying integrations...")
        subprocess.run([sys.executable, scripts_dir / "run.py", "verify-all"])
        
        print("\n🎉 Full setup completed!")
    
    elif command == "refresh-frontend":
        print("🔄 Refreshing frontend data...")
        subprocess.run([sys.executable, scripts_dir / "run.py", "export-all"])
        print("\n✅ Frontend data refreshed!")
    
    else:
        print(f"❌ Unknown command: {command}")
        print("Run 'python run.py' without arguments to see available commands.")

if __name__ == "__main__":
    main()
