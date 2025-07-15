import pytest
from datetime import datetime, timedelta

@pytest.fixture
def test_task(db_session, test_user, test_account):
    from app.models.task import Task
    task = Task(
        title="Test Task",
        description="Test task description",
        status="pending",
        priority="medium",
        assigned_to=test_user.id,
        account_id=test_account.id,
        due_date=datetime.utcnow() + timedelta(days=7)
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    return task

def test_get_tasks(client, auth_headers, test_task):
    """Test getting all tasks"""
    response = client.get("/api/v1/tasks/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["title"] == "Test Task"

def test_create_task(client, auth_headers, test_account, test_user):
    """Test creating new task"""
    task_data = {
        "title": "New Task",
        "description": "New task description",
        "priority": "high",
        "assigned_to": test_user.id,
        "account_id": test_account.id,
        "due_date": (datetime.utcnow() + timedelta(days=5)).isoformat()
    }
    response = client.post("/api/v1/tasks/", json=task_data, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == task_data["title"]
    assert data["status"] == "pending"

def test_update_task(client, auth_headers, test_task):
    """Test updating task"""
    update_data = {"status": "in_progress", "priority": "high"}
    response = client.put(
        f"/api/v1/tasks/{test_task.id}", 
        json=update_data, 
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "in_progress"
    assert data["priority"] == "high"

def test_cancel_task(client, auth_headers, test_task):
    """Test cancelling task"""
    response = client.post(f"/api/v1/tasks/{test_task.id}/cancel", headers=auth_headers)
    assert response.status_code == 200
    assert "cancelled successfully" in response.json()["message"]

def test_cancel_completed_task(client, auth_headers, test_task, db_session):
    """Test cancelling already completed task"""
    test_task.status = "completed"
    db_session.commit()
    
    response = client.post(f"/api/v1/tasks/{test_task.id}/cancel", headers=auth_headers)
    assert response.status_code == 400
    assert "Cannot cancel completed task" in response.json()["detail"]

def test_get_user_tasks(client, auth_headers, test_task, test_user):
    """Test getting tasks for specific user"""
    response = client.get(f"/api/v1/tasks/user/{test_user.id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert all(task["assigned_to"] == test_user.id for task in data)

def test_get_account_tasks(client, auth_headers, test_task, test_account):
    """Test getting tasks for specific account"""
    response = client.get(f"/api/v1/tasks/account/{test_account.id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert all(task["account_id"] == test_account.id for task in data)

def test_task_stats(client, auth_headers, test_task):
    """Test getting task statistics"""
    response = client.get("/api/v1/tasks/stats", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "pending" in data
    assert "completion_rate" in data
    assert data["total"] >= 1