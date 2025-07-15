import pytest

@pytest.fixture
def test_manager(db_session, test_user):
    from app.models.manager import Manager
    manager = Manager(
        name="Test Manager",
        email="manager@example.com",
        phone="555-0123",
        department="Sales",
        position="Senior Manager",
        created_by=test_user.id
    )
    db_session.add(manager)
    db_session.commit()
    db_session.refresh(manager)
    return manager

def test_get_managers(client, auth_headers, test_manager):
    """Test getting all managers"""
    response = client.get("/api/v1/managers/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["name"] == "Test Manager"

def test_create_manager(client, auth_headers):
    """Test creating new manager"""
    manager_data = {
        "name": "New Manager",
        "email": "newmanager@example.com",
        "phone": "555-0456",
        "department": "Operations",
        "position": "Manager"
    }
    response = client.post("/api/v1/managers/", json=manager_data, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == manager_data["name"]
    assert data["email"] == manager_data["email"]

def test_create_manager_duplicate_email(client, auth_headers, test_manager):
    """Test creating manager with duplicate email"""
    manager_data = {
        "name": "Duplicate Manager",
        "email": "manager@example.com",  # Same as test_manager
        "department": "HR"
    }
    response = client.post("/api/v1/managers/", json=manager_data, headers=auth_headers)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_update_manager(client, auth_headers, test_manager):
    """Test updating manager"""
    update_data = {"department": "Marketing", "position": "Director"}
    response = client.put(
        f"/api/v1/managers/{test_manager.id}", 
        json=update_data, 
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["department"] == "Marketing"
    assert data["position"] == "Director"

def test_delete_manager(client, auth_headers, test_manager):
    """Test soft deleting manager"""
    response = client.delete(f"/api/v1/managers/{test_manager.id}", headers=auth_headers)
    assert response.status_code == 200
    assert "deactivated successfully" in response.json()["message"]

def test_assign_account_to_manager(client, auth_headers, test_manager, test_account):
    """Test assigning account to manager"""
    response = client.post(
        f"/api/v1/managers/{test_manager.id}/assign-account/{test_account.id}",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert "assigned to manager successfully" in response.json()["message"]

def test_get_manager_accounts(client, auth_headers, test_manager, test_account, db_session):
    """Test getting manager's accounts"""
    # Assign account to manager first
    test_account.manager_id = test_manager.id
    db_session.commit()
    
    response = client.get(f"/api/v1/managers/{test_manager.id}/accounts", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1

def test_manager_performance(client, auth_headers, test_manager):
    """Test getting manager performance metrics"""
    response = client.get(f"/api/v1/managers/{test_manager.id}/performance", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "manager_id" in data
    assert "total_accounts" in data
    assert "task_completion_rate" in data

def test_managers_overview(client, auth_headers, test_manager):
    """Test getting managers overview statistics"""
    response = client.get("/api/v1/managers/stats/overview", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "total_managers" in data
    assert "total_accounts" in data
    assert "assignment_rate" in data