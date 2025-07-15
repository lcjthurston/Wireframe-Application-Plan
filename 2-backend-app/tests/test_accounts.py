import pytest
from datetime import datetime

@pytest.fixture
def test_account(db_session, test_user):
    from app.models.account import Account
    account = Account(
        name="Test Account",
        esiid="12345678901234567890",
        usage_kwh=1500.0,
        created_by=test_user.id
    )
    db_session.add(account)
    db_session.commit()
    db_session.refresh(account)
    return account

def test_get_accounts(client, auth_headers, test_account):
    """Test getting all accounts"""
    response = client.get("/api/v1/accounts/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["name"] == "Test Account"

def test_get_account_by_id(client, auth_headers, test_account):
    """Test getting specific account"""
    response = client.get(f"/api/v1/accounts/{test_account.id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == test_account.name
    assert data["esiid"] == test_account.esiid

def test_create_account(client, auth_headers):
    """Test creating new account"""
    account_data = {
        "name": "New Test Account",
        "esiid": "98765432109876543210",
        "usage_kwh": 2000.0
    }
    response = client.post("/api/v1/accounts/", json=account_data, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == account_data["name"]
    assert data["esiid"] == account_data["esiid"]

def test_update_account(client, auth_headers, test_account):
    """Test updating account"""
    update_data = {"name": "Updated Account Name", "usage_kwh": 2500.0}
    response = client.put(
        f"/api/v1/accounts/{test_account.id}", 
        json=update_data, 
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Account Name"
    assert data["usage_kwh"] == 2500.0

def test_refresh_usage_data_no_esiid(client, auth_headers, db_session, test_user):
    """Test refresh usage with account that has no ESIID"""
    from app.models.account import Account
    account = Account(name="No ESIID Account", created_by=test_user.id)
    db_session.add(account)
    db_session.commit()
    
    response = client.post(
        f"/api/v1/accounts/{account.id}/refresh-usage", 
        headers=auth_headers
    )
    assert response.status_code == 400
    assert "no ESIID" in response.json()["detail"]

def test_account_not_found(client, auth_headers):
    """Test accessing non-existent account"""
    response = client.get("/api/v1/accounts/99999", headers=auth_headers)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]