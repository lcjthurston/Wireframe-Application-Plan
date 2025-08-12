#!/usr/bin/env python3
"""
Energy Analytics Engine
Processes ESIID, pricing, and commission data to generate forecasts and insights
"""

import sqlite3
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime, timedelta
import json
import warnings
warnings.filterwarnings('ignore')

class EnergyAnalyticsEngine:
    def __init__(self, db_path="2-backend/kilowatt_dev.db"):
        self.db_path = db_path
        self.conn = None
        
    def connect(self):
        """Connect to the database"""
        if not Path(self.db_path).exists():
            raise FileNotFoundError(f"Database not found: {self.db_path}")
        self.conn = sqlite3.connect(self.db_path)
        return self.conn
    
    def disconnect(self):
        """Disconnect from the database"""
        if self.conn:
            self.conn.close()
            self.conn = None
    
    def load_usage_data(self):
        """Load ESIID usage data for analysis"""
        query = """
            SELECT 
                account_name,
                esi_id,
                rep,
                load_profile,
                zone,
                kwh_mo,
                kwh_yr,
                total_bill,
                created_at
            FROM esiids 
            WHERE kwh_mo IS NOT NULL 
            AND kwh_mo > 0
            ORDER BY kwh_mo DESC
        """
        return pd.read_sql_query(query, self.conn)
    
    def load_pricing_data(self):
        """Load pricing data for analysis"""
        query = """
            SELECT 
                effective_date,
                zone,
                rep,
                load_profile,
                daily_rate,
                term_months,
                created_at
            FROM daily_pricing 
            WHERE daily_rate IS NOT NULL 
            AND daily_rate > 0
            ORDER BY effective_date DESC
        """
        return pd.read_sql_query(query, self.conn)
    
    def load_commission_data(self):
        """Load commission data for analysis"""
        query = """
            SELECT 
                account_name,
                k_rep,
                commission_type,
                actual_payment_amount,
                actual_payment_date,
                contract_date,
                created_at
            FROM commissions 
            WHERE actual_payment_amount IS NOT NULL
            ORDER BY actual_payment_date DESC
        """
        return pd.read_sql_query(query, self.conn)
    
    def analyze_usage_patterns(self, usage_df):
        """Analyze usage patterns and generate insights"""
        results = []
        
        # Group by account for analysis
        for account_name, group in usage_df.groupby('account_name'):
            if len(group) < 2:  # Need at least 2 ESIIDs for meaningful analysis
                continue
                
            total_usage = group['kwh_mo'].sum()
            avg_usage = group['kwh_mo'].mean()
            usage_std = group['kwh_mo'].std()
            total_bill = group['total_bill'].sum()
            
            # Determine usage pattern
            cv = usage_std / avg_usage if avg_usage > 0 else 0
            if cv < 0.2:
                pattern = 'stable'
            elif cv < 0.5:
                pattern = 'moderate_variation'
            else:
                pattern = 'high_variation'
            
            # Calculate efficiency score (lower cost per kWh is better)
            cost_per_kwh = total_bill / total_usage if total_usage > 0 else 0
            efficiency_score = max(0, 100 - (cost_per_kwh * 1000))  # Normalize to 0-100
            
            # Simple forecast (seasonal adjustment)
            current_month = datetime.now().month
            seasonal_factors = {
                1: 1.2, 2: 1.1, 3: 1.0, 4: 0.9, 5: 0.8, 6: 0.7,  # Winter high, summer low
                7: 0.6, 8: 0.7, 9: 0.8, 10: 0.9, 11: 1.0, 12: 1.1
            }
            seasonal_factor = seasonal_factors.get(current_month, 1.0)
            predicted_usage = total_usage * seasonal_factor
            
            # Anomaly detection (simple z-score based)
            z_scores = np.abs((group['kwh_mo'] - avg_usage) / usage_std) if usage_std > 0 else np.zeros(len(group))
            anomaly_score = np.mean(z_scores > 2)  # Percentage of outliers
            
            result = {
                'account_name': account_name,
                'esiid_count': int(len(group)),
                'total_usage_kwh': float(total_usage),
                'avg_usage_kwh': float(avg_usage),
                'predicted_usage_kwh': float(predicted_usage),
                'usage_pattern': pattern,
                'efficiency_score': float(efficiency_score),
                'anomaly_score': float(anomaly_score),
                'seasonal_factor': float(seasonal_factor),
                'cost_per_kwh': float(cost_per_kwh),
                'total_monthly_bill': float(total_bill)
            }
            results.append(result)
        
        return pd.DataFrame(results)
    
    def analyze_pricing_trends(self, pricing_df):
        """Analyze pricing trends and market intelligence"""
        results = []
        
        # Convert dates
        pricing_df['effective_date'] = pd.to_datetime(pricing_df['effective_date'])
        
        # Group by zone and REP
        for (zone, rep), group in pricing_df.groupby(['zone', 'rep']):
            if len(group) < 5:  # Need sufficient data points
                continue
            
            # Sort by date
            group = group.sort_values('effective_date')
            
            current_rate = group['daily_rate'].iloc[-1]
            avg_rate = group['daily_rate'].mean()
            rate_std = group['daily_rate'].std()
            
            # Calculate trend
            if len(group) >= 10:
                recent_avg = group['daily_rate'].tail(5).mean()
                older_avg = group['daily_rate'].head(5).mean()
                if recent_avg > older_avg * 1.05:
                    trend = 'increasing'
                elif recent_avg < older_avg * 0.95:
                    trend = 'decreasing'
                else:
                    trend = 'stable'
            else:
                trend = 'stable'
            
            # Market position analysis
            zone_rates = pricing_df[pricing_df['zone'] == zone]['daily_rate']
            percentile = (zone_rates < current_rate).mean() * 100
            
            if percentile < 25:
                market_position = 'competitive'
            elif percentile < 75:
                market_position = 'average'
            else:
                market_position = 'expensive'
            
            # Volatility calculation
            volatility = rate_std / avg_rate if avg_rate > 0 else 0
            
            # Simple price forecast
            trend_factor = {'increasing': 1.05, 'stable': 1.0, 'decreasing': 0.95}[trend]
            predicted_rate = current_rate * trend_factor
            
            result = {
                'zone': zone,
                'rep': rep,
                'current_rate': float(current_rate),
                'avg_rate': float(avg_rate),
                'predicted_rate': float(predicted_rate),
                'rate_trend': trend,
                'market_position': market_position,
                'volatility': float(volatility),
                'percentile_rank': float(percentile),
                'data_points': int(len(group))
            }
            results.append(result)
        
        return pd.DataFrame(results)
    
    def analyze_commission_performance(self, commission_df):
        """Analyze commission performance and forecasting"""
        results = []
        
        # Convert dates
        commission_df['actual_payment_date'] = pd.to_datetime(commission_df['actual_payment_date'])
        
        # Group by REP
        for rep, group in commission_df.groupby('k_rep'):
            if len(group) < 3:  # Need sufficient data
                continue
            
            total_commission = group['actual_payment_amount'].sum()
            avg_commission = group['actual_payment_amount'].mean()
            commission_count = len(group)
            
            # Calculate monthly performance
            group['month'] = group['actual_payment_date'].dt.to_period('M')
            monthly_performance = group.groupby('month')['actual_payment_amount'].sum()
            
            if len(monthly_performance) >= 3:
                # Calculate growth trend
                recent_months = monthly_performance.tail(3).mean()
                older_months = monthly_performance.head(3).mean()
                
                if recent_months > older_months * 1.1:
                    trend = 'increasing'
                elif recent_months < older_months * 0.9:
                    trend = 'decreasing'
                else:
                    trend = 'stable'
                
                # Forecast next month
                growth_rate = (recent_months / older_months - 1) if older_months > 0 else 0
                predicted_monthly = recent_months * (1 + growth_rate)
            else:
                trend = 'stable'
                predicted_monthly = avg_commission
            
            # Convert Period index to string for JSON serialization
            monthly_dict = {}
            if len(monthly_performance) > 0:
                for period, value in monthly_performance.items():
                    monthly_dict[str(period)] = float(value)

            result = {
                'rep': rep,
                'total_commission': float(total_commission),
                'avg_commission': float(avg_commission),
                'commission_count': int(commission_count),
                'predicted_monthly_commission': float(predicted_monthly),
                'commission_trend': trend,
                'monthly_performance': monthly_dict
            }
            results.append(result)
        
        return pd.DataFrame(results)
    
    def generate_market_intelligence(self, usage_df, pricing_df, commission_df):
        """Generate comprehensive market intelligence"""
        
        # Market size analysis
        total_market_kwh = usage_df['kwh_mo'].sum() * 12  # Annual
        total_market_value = usage_df['total_bill'].sum() * 12  # Annual
        
        # Zone analysis - flatten multi-level columns
        zone_agg = usage_df.groupby('zone').agg({
            'kwh_mo': ['sum', 'mean', 'count'],
            'total_bill': 'sum'
        }).round(2)

        zone_analysis = {}
        for zone in zone_agg.index:
            zone_analysis[zone] = {
                'total_kwh': float(zone_agg.loc[zone, ('kwh_mo', 'sum')]),
                'avg_kwh': float(zone_agg.loc[zone, ('kwh_mo', 'mean')]),
                'esiid_count': int(zone_agg.loc[zone, ('kwh_mo', 'count')]),
                'total_bill': float(zone_agg.loc[zone, ('total_bill', 'sum')])
            }

        # REP market share
        rep_agg = usage_df.groupby('rep').agg({
            'kwh_mo': 'sum',
            'total_bill': 'sum'
        }).sort_values('kwh_mo', ascending=False)

        rep_market_share = {}
        for rep in rep_agg.index:
            rep_market_share[rep] = {
                'total_kwh': float(rep_agg.loc[rep, 'kwh_mo']),
                'total_bill': float(rep_agg.loc[rep, 'total_bill'])
            }

        # Pricing competitiveness
        pricing_agg = pricing_df.groupby('rep')['daily_rate'].agg(['mean', 'min', 'max']).round(2)
        pricing_competitiveness = {}
        for rep in pricing_agg.index:
            pricing_competitiveness[rep] = {
                'avg_rate': float(pricing_agg.loc[rep, 'mean']),
                'min_rate': float(pricing_agg.loc[rep, 'min']),
                'max_rate': float(pricing_agg.loc[rep, 'max'])
            }
        
        intelligence = {
            'market_overview': {
                'total_annual_consumption_kwh': float(total_market_kwh),
                'total_annual_value': float(total_market_value),
                'average_cost_per_kwh': float(total_market_value / total_market_kwh if total_market_kwh > 0 else 0),
                'total_accounts': int(len(usage_df['account_name'].unique())),
                'total_esiids': int(len(usage_df))
            },
            'zone_analysis': zone_analysis,
            'rep_market_share': rep_market_share,
            'pricing_competitiveness': pricing_competitiveness,
            'analysis_date': datetime.now().isoformat()
        }
        
        return intelligence
    
    def run_full_analysis(self):
        """Run complete analytics pipeline"""
        print("🚀 Starting Energy Analytics Engine...")
        
        try:
            self.connect()
            
            # Load data
            print("📊 Loading data...")
            usage_df = self.load_usage_data()
            pricing_df = self.load_pricing_data()
            commission_df = self.load_commission_data()
            
            print(f"   Loaded {len(usage_df)} usage records")
            print(f"   Loaded {len(pricing_df)} pricing records")
            print(f"   Loaded {len(commission_df)} commission records")
            
            # Run analyses
            print("🔍 Analyzing usage patterns...")
            usage_analysis = self.analyze_usage_patterns(usage_df)
            
            print("📈 Analyzing pricing trends...")
            pricing_analysis = self.analyze_pricing_trends(pricing_df)
            
            print("💰 Analyzing commission performance...")
            commission_analysis = self.analyze_commission_performance(commission_df)
            
            print("🌐 Generating market intelligence...")
            market_intelligence = self.generate_market_intelligence(usage_df, pricing_df, commission_df)
            
            # Save results
            results = {
                'usage_analysis': usage_analysis.to_dict('records'),
                'pricing_analysis': pricing_analysis.to_dict('records'),
                'commission_analysis': commission_analysis.to_dict('records'),
                'market_intelligence': market_intelligence,
                'analysis_timestamp': datetime.now().isoformat()
            }
            
            # Export to JSON for frontend
            output_file = "1-frontend/src/data/analytics-results.json"
            Path(output_file).parent.mkdir(exist_ok=True)
            
            with open(output_file, 'w') as f:
                json.dump(results, f, indent=2, default=str)
            
            print(f"✅ Analytics completed! Results saved to {output_file}")
            
            # Print summary
            print(f"\n📋 ANALYTICS SUMMARY:")
            print(f"   Usage Analysis: {len(usage_analysis)} accounts analyzed")
            print(f"   Pricing Analysis: {len(pricing_analysis)} zone/REP combinations")
            print(f"   Commission Analysis: {len(commission_analysis)} REPs analyzed")
            print(f"   Market Size: {market_intelligence['market_overview']['total_annual_consumption_kwh']:,.0f} kWh/year")
            print(f"   Market Value: ${market_intelligence['market_overview']['total_annual_value']:,.0f}/year")
            
            return results
            
        except Exception as e:
            print(f"❌ Analytics error: {e}")
            return None
        finally:
            self.disconnect()


if __name__ == "__main__":
    engine = EnergyAnalyticsEngine()
    results = engine.run_full_analysis()
