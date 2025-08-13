from fastapi import APIRouter

router = APIRouter()

@router.get("/accounts")
async def get_simple_accounts():
    """Simple accounts endpoint with no dependencies"""
    return [
        {
            "id": 1,
            "accountName": "Sample Energy Account 1",
            "managerName": "John Smith",
            "managementCompany": "Energy Management Co",
            "status": "active",
            "usageKwh": 1250.75,
            "monthlyCost": 187.50,
            "annualCost": 2250.00
        },
        {
            "id": 2,
            "accountName": "Sample Energy Account 2", 
            "managerName": "Jane Doe",
            "managementCompany": "Power Solutions LLC",
            "status": "pending",
            "usageKwh": 2100.25,
            "monthlyCost": 315.00,
            "annualCost": 3780.00
        },
        {
            "id": 3,
            "accountName": "Sample Energy Account 3",
            "managerName": "Bob Johnson",
            "managementCompany": "Green Energy Partners",
            "status": "active",
            "usageKwh": 875.50,
            "monthlyCost": 131.25,
            "annualCost": 1575.00
        },
        {
            "id": 4,
            "accountName": "Corporate Energy Solutions",
            "managerName": "Sarah Wilson",
            "managementCompany": "Business Energy Corp",
            "status": "active",
            "usageKwh": 3200.00,
            "monthlyCost": 480.00,
            "annualCost": 5760.00
        },
        {
            "id": 5,
            "accountName": "Industrial Power Account",
            "managerName": "Mike Davis",
            "managementCompany": "Industrial Energy LLC",
            "status": "active",
            "usageKwh": 5500.75,
            "monthlyCost": 825.00,
            "annualCost": 9900.00
        }
    ]

@router.get("/esiids")
async def get_simple_esiids():
    """Simple ESIIDs endpoint with no dependencies"""
    return [
        {
            "id": 1,
            "esiId": "10123456789012345678",
            "accountName": "Sample Energy Account 1",
            "serviceAddress": "123 Main St, Houston, TX 77001",
            "rep": "TXU Energy",
            "kwhMo": 1250,
            "kwhYr": 15000,
            "totalBill": 187.50,
            "loadProfile": "RESIDENTIAL",
            "zone": "HOUSTON"
        },
        {
            "id": 2,
            "esiId": "10234567890123456789",
            "accountName": "Sample Energy Account 2",
            "serviceAddress": "456 Oak Ave, Dallas, TX 75201",
            "rep": "Reliant Energy",
            "kwhMo": 2100,
            "kwhYr": 25200,
            "totalBill": 315.00,
            "loadProfile": "COMMERCIAL",
            "zone": "DALLAS"
        },
        {
            "id": 3,
            "esiId": "10345678901234567890",
            "accountName": "Sample Energy Account 3",
            "serviceAddress": "789 Pine Rd, Austin, TX 78701",
            "rep": "Direct Energy",
            "kwhMo": 875,
            "kwhYr": 10500,
            "totalBill": 131.25,
            "loadProfile": "RESIDENTIAL",
            "zone": "AUSTIN"
        }
    ]

@router.get("/managers")
async def get_simple_managers():
    """Simple managers endpoint with no dependencies"""
    return [
        {
            "id": 1,
            "name": "John Smith",
            "managementCompany": "Energy Management Co",
            "email": "john.smith@energymgmt.com",
            "phone": "(555) 123-4567",
            "officeAddress": "100 Energy Plaza, Houston, TX 77002",
            "accountCount": 25,
            "totalCommission": 15750.00,
            "pendingContracts": 3
        },
        {
            "id": 2,
            "name": "Jane Doe",
            "managementCompany": "Power Solutions LLC",
            "email": "jane.doe@powersolutions.com",
            "phone": "(555) 234-5678",
            "officeAddress": "200 Power St, Dallas, TX 75202",
            "accountCount": 18,
            "totalCommission": 12400.00,
            "pendingContracts": 2
        },
        {
            "id": 3,
            "name": "Bob Johnson",
            "managementCompany": "Green Energy Partners",
            "email": "bob.johnson@greenenergy.com",
            "phone": "(555) 345-6789",
            "officeAddress": "300 Green Way, Austin, TX 78702",
            "accountCount": 32,
            "totalCommission": 22100.00,
            "pendingContracts": 5
        }
    ]
