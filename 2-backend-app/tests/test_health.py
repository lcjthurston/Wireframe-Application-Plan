def test_basic_health_check(client):
    """Test basic health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_system_health_check(client, auth_headers):
    """Test comprehensive system health check"""
    response = client.get("/api/v1/health/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "overall_status" in data
    assert "services" in data
    assert "database" in data["services"]

def test_run_health_check(client, auth_headers):
    """Test running and storing health check"""
    response = client.post("/api/v1/health/check", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "overall_status" in data
    assert "timestamp" in data