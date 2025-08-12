#!/usr/bin/env python3
"""
Analyze Available Data for Energy Forecasting
Examines all integrated data to identify forecasting opportunities
"""

import sqlite3
import pandas as pd
from pathlib import Path
import numpy as np
from datetime import datetime, timedelta

def analyze_forecasting_data():
    """Analyze available data for energy forecasting capabilities"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return False
    
    conn = sqlite3.connect(db_path)
    
    try:
        print("🔍 ENERGY FORECASTING DATA ANALYSIS")
        print("=" * 60)
        
        # 1. ESIID Usage Data Analysis
        print(f"\n⚡ ESIID USAGE DATA ANALYSIS:")
        
        # Check for usage patterns in ESIID data
        esiid_df = pd.read_sql_query("""
            SELECT
                esi_id,
                rep,
                load_profile,
                kwh_mo,
                kwh_yr,
                created_at,
                is_active,
                account_name,
                zone,
                total_bill
            FROM esiids
            WHERE kwh_mo IS NOT NULL
            AND kwh_yr IS NOT NULL
            ORDER BY kwh_mo DESC
            LIMIT 1000
        """, conn)
        
        if len(esiid_df) > 0:
            print(f"   ESIIDs with usage data: {len(esiid_df)}")
            print(f"   Average monthly usage: {esiid_df['kwh_mo'].mean():.2f} kWh")
            print(f"   Usage range: {esiid_df['kwh_mo'].min():.0f} - {esiid_df['kwh_mo'].max():.0f} kWh/month")
            print(f"   Total annual consumption: {esiid_df['kwh_yr'].sum():,.0f} kWh/year")

            # Analyze by load profile
            load_profile_stats = esiid_df.groupby('load_profile')['kwh_mo'].agg(['count', 'mean', 'std']).round(2)
            print(f"\n   Usage by Load Profile:")
            for profile, stats in load_profile_stats.iterrows():
                if pd.notna(profile):
                    print(f"     {profile}: {stats['count']} ESIIDs, avg: {stats['mean']:.0f} kWh/month")

            # Analyze by REP
            rep_stats = esiid_df.groupby('rep')['kwh_mo'].agg(['count', 'mean']).round(2)
            print(f"\n   Usage by REP (top 10):")
            for rep, stats in rep_stats.head(10).iterrows():
                if pd.notna(rep):
                    print(f"     {rep}: {stats['count']} ESIIDs, avg: {stats['mean']:.0f} kWh/month")
        else:
            print(f"   ❌ No ESIID usage data found for forecasting")
        
        # 2. Pricing Data Analysis for Market Trends
        print(f"\n📈 PRICING DATA ANALYSIS:")
        
        pricing_df = pd.read_sql_query("""
            SELECT 
                effective_date,
                zone,
                rep,
                load_profile,
                daily_rate,
                term_months
            FROM daily_pricing 
            WHERE daily_rate IS NOT NULL 
            AND effective_date IS NOT NULL
            ORDER BY effective_date DESC
            LIMIT 5000
        """, conn)
        
        if len(pricing_df) > 0:
            pricing_df['effective_date'] = pd.to_datetime(pricing_df['effective_date'])
            print(f"   Pricing records with dates: {len(pricing_df)}")
            print(f"   Date range: {pricing_df['effective_date'].min()} to {pricing_df['effective_date'].max()}")
            print(f"   Average rate: ${pricing_df['daily_rate'].mean():.2f}/day")
            
            # Analyze pricing trends by zone
            zone_trends = pricing_df.groupby('zone')['daily_rate'].agg(['count', 'mean', 'std']).round(2)
            print(f"\n   Pricing by Zone:")
            for zone, stats in zone_trends.iterrows():
                print(f"     {zone}: {stats['count']} records, avg: ${stats['mean']:.2f}/day")
            
            # Check for time-based patterns
            pricing_df['month'] = pricing_df['effective_date'].dt.month
            monthly_trends = pricing_df.groupby('month')['daily_rate'].mean().round(2)
            print(f"\n   Monthly Pricing Trends:")
            month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            for month, avg_rate in monthly_trends.items():
                month_name = month_names[month-1] if 1 <= month <= 12 else f"Month {month}"
                print(f"     {month_name}: ${avg_rate:.2f}/day")
        else:
            print(f"   ❌ No pricing data with dates found for trend analysis")
        
        # 3. Commission Data Analysis for Revenue Forecasting
        print(f"\n💰 COMMISSION DATA ANALYSIS:")
        
        commission_df = pd.read_sql_query("""
            SELECT 
                commission_type,
                actual_payment_date,
                actual_payment_amount,
                k_rep,
                account_name,
                payment_type,
                contract_date,
                start_date,
                end_date
            FROM commissions 
            WHERE actual_payment_amount IS NOT NULL
            ORDER BY actual_payment_date DESC
            LIMIT 1000
        """, conn)
        
        if len(commission_df) > 0:
            commission_df['actual_payment_date'] = pd.to_datetime(commission_df['actual_payment_date'], errors='coerce')
            valid_dates = commission_df['actual_payment_date'].notna()
            
            print(f"   Commission records: {len(commission_df)}")
            print(f"   Records with dates: {valid_dates.sum()}")
            print(f"   Total commission amount: ${commission_df['actual_payment_amount'].sum():,.2f}")
            print(f"   Average commission: ${commission_df['actual_payment_amount'].mean():.2f}")
            
            if valid_dates.sum() > 0:
                dated_commissions = commission_df[valid_dates]
                print(f"   Date range: {dated_commissions['actual_payment_date'].min()} to {dated_commissions['actual_payment_date'].max()}")
                
                # Monthly commission trends
                dated_commissions['month'] = dated_commissions['actual_payment_date'].dt.month
                monthly_commissions = dated_commissions.groupby('month')['actual_payment_amount'].agg(['count', 'sum']).round(2)
                print(f"\n   Monthly Commission Patterns:")
                for month, stats in monthly_commissions.iterrows():
                    month_name = month_names[month-1] if 1 <= month <= 12 else f"Month {month}"
                    print(f"     {month_name}: {stats['count']} payments, ${stats['sum']:,.2f} total")
        else:
            print(f"   ❌ No commission data found for revenue forecasting")
        
        # 4. Account and Company Data for Segmentation
        print(f"\n🏢 ACCOUNT & COMPANY DATA ANALYSIS:")
        
        # Since accounts table is empty, let's analyze ESIIDs directly by account_name
        account_df = pd.read_sql_query("""
            SELECT
                account_name,
                COUNT(*) as esiid_count,
                SUM(kwh_mo) as total_monthly_usage,
                AVG(kwh_mo) as avg_monthly_usage,
                SUM(total_bill) as total_monthly_bill
            FROM esiids
            WHERE account_name IS NOT NULL
            AND kwh_mo IS NOT NULL
            GROUP BY account_name
            HAVING esiid_count > 0
            ORDER BY total_monthly_usage DESC
            LIMIT 500
        """, conn)
        
        if len(account_df) > 0:
            print(f"   Accounts with ESIIDs: {len(account_df)}")
            print(f"   Total ESIIDs: {account_df['esiid_count'].sum()}")
            print(f"   Average ESIIDs per account: {account_df['esiid_count'].mean():.1f}")

            # Usage distribution
            usage_stats = account_df['total_monthly_usage'].describe()
            print(f"\n   Usage Distribution (kWh/month):")
            print(f"     Mean: {usage_stats['mean']:,.0f}")
            print(f"     Median: {usage_stats['50%']:,.0f}")
            print(f"     Max: {usage_stats['max']:,.0f}")

            # Top accounts by usage
            print(f"\n   Top 10 Accounts by Usage:")
            top_accounts = account_df.head(10)
            for _, account in top_accounts.iterrows():
                usage = account['total_monthly_usage'] or 0
                esiids = account['esiid_count']
                account_name = account['account_name']
                bill = account['total_monthly_bill'] or 0
                print(f"     {account_name}: {usage:,.0f} kWh/month (${bill:,.0f}/month, {esiids} ESIIDs)")
        else:
            print(f"   ❌ No account data with ESIIDs found")
        
        # 5. Forecasting Opportunities Assessment
        print(f"\n🎯 FORECASTING OPPORTUNITIES:")
        
        opportunities = []
        
        if len(esiid_df) > 0:
            opportunities.append("✅ Usage Forecasting: Predict future energy consumption based on historical ESIID data")
            opportunities.append("✅ Load Profile Analysis: Forecast usage patterns by customer type")
            opportunities.append("✅ Demand Forecasting: Predict peak usage periods and capacity needs")
        
        if len(pricing_df) > 0:
            opportunities.append("✅ Price Forecasting: Predict future energy rates by zone and REP")
            opportunities.append("✅ Market Trend Analysis: Identify pricing patterns and seasonal variations")
            opportunities.append("✅ Cost Optimization: Recommend optimal contract timing and terms")
        
        if len(commission_df) > 0:
            opportunities.append("✅ Revenue Forecasting: Predict future commission earnings")
            opportunities.append("✅ Sales Optimization: Identify high-value opportunities and timing")
        
        if len(account_df) > 0:
            opportunities.append("✅ Customer Segmentation: Group customers by usage patterns for targeted forecasting")
            opportunities.append("✅ Portfolio Analysis: Forecast total portfolio performance and growth")
        
        for i, opportunity in enumerate(opportunities, 1):
            print(f"   {i}. {opportunity}")
        
        # 6. Recommended Analytics Models
        print(f"\n🤖 RECOMMENDED ANALYTICS MODELS:")
        
        models = [
            "📊 Time Series Forecasting: ARIMA/SARIMA models for usage and pricing trends",
            "🧠 Machine Learning: Random Forest/XGBoost for multi-factor predictions",
            "📈 Seasonal Decomposition: Identify seasonal patterns in usage and pricing",
            "🎯 Anomaly Detection: Identify unusual usage patterns or pricing outliers",
            "💡 Optimization Models: Linear programming for cost minimization",
            "📋 Classification Models: Predict customer behavior and churn risk",
            "🔄 Regression Analysis: Understand relationships between variables",
            "📊 Clustering Analysis: Group similar customers and usage patterns"
        ]
        
        for i, model in enumerate(models, 1):
            print(f"   {i}. {model}")
        
        # 7. Data Quality for Forecasting
        print(f"\n📋 DATA QUALITY ASSESSMENT:")
        
        total_esiids = pd.read_sql_query("SELECT COUNT(*) as count FROM esiids", conn).iloc[0]['count']
        esiids_with_usage = len(esiid_df)
        
        total_pricing = pd.read_sql_query("SELECT COUNT(*) as count FROM daily_pricing", conn).iloc[0]['count']
        pricing_with_dates = len(pricing_df)
        
        total_commissions = pd.read_sql_query("SELECT COUNT(*) as count FROM commissions", conn).iloc[0]['count']
        commissions_with_amounts = len(commission_df)
        
        print(f"   ESIID Usage Data: {esiids_with_usage}/{total_esiids} ({(esiids_with_usage/total_esiids)*100:.1f}%)")
        print(f"   Pricing Data: {pricing_with_dates}/{total_pricing} ({(pricing_with_dates/total_pricing)*100:.1f}%)")
        print(f"   Commission Data: {commissions_with_amounts}/{total_commissions} ({(commissions_with_amounts/total_commissions)*100:.1f}%)")
        
        overall_quality = ((esiids_with_usage/total_esiids) + (pricing_with_dates/total_pricing) + (commissions_with_amounts/total_commissions)) / 3
        print(f"   Overall Data Quality: {overall_quality*100:.1f}% (suitable for forecasting)")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        conn.close()
        return False

if __name__ == "__main__":
    print("🚀 Analyzing data for energy forecasting capabilities...")
    success = analyze_forecasting_data()
    if success:
        print("✅ Forecasting data analysis completed!")
    else:
        print("❌ Forecasting data analysis failed!")
