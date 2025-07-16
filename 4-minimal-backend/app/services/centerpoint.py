import httpx
from typing import Dict, Any
from app.core.config import settings

class CenterpointClient:
    def __init__(self):
        self.base_url = settings.centerpoint_api_url
        self.api_key = settings.centerpoint_api_key
    
    async def get_usage_data(self, esiid: str) -> Dict[str, Any]:
        """Fetch usage data from Centerpoint API"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/usage/{esiid}",
                headers={"Authorization": f"Bearer {self.api_key}"}
            )
            response.raise_for_status()
            return response.json()
    
    async def check_connection(self) -> bool:
        """Check if Centerpoint API is accessible"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/health",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=5.0
                )
                return response.status_code == 200
        except:
            return False

centerpoint_client = CenterpointClient()