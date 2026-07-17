import pytest
from httpx import AsyncClient


class TestAuth:
    """Test authentication endpoints"""
    
    async def test_register_user(self, test_client: AsyncClient, test_user_data):
        """Test user registration"""
        response = await test_client.post("/api/v1/auth/register", json=test_user_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == test_user_data["email"]
        assert data["full_name"] == test_user_data["full_name"]
        assert "id" in data
        assert "password_hash" not in data  # Should not return password hash
    
    async def test_register_duplicate_email(self, test_client: AsyncClient, test_user_data):
        """Test registration with duplicate email"""
        # First registration
        await test_client.post("/api/v1/auth/register", json=test_user_data)
        
        # Second registration with same email
        response = await test_client.post("/api/v1/auth/register", json=test_user_data)
        
        assert response.status_code == 400
    
    async def test_login_success(self, test_client: AsyncClient, test_user_data):
        """Test successful login"""
        # Register user first
        await test_client.post("/api/v1/auth/register", json=test_user_data)
        
        # Login
        response = await test_client.post(
            "/api/v1/auth/login",
            json={
                "email": test_user_data["email"],
                "password": test_user_data["password"]
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
    
    async def test_login_invalid_credentials(self, test_client: AsyncClient, test_user_data):
        """Test login with invalid credentials"""
        response = await test_client.post(
            "/api/v1/auth/login",
            json={
                "email": test_user_data["email"],
                "password": "wrongpassword"
            }
        )
        
        assert response.status_code == 401
    
    async def test_refresh_token(self, test_client: AsyncClient, test_user_data):
        """Test token refresh"""
        # Register and login
        await test_client.post("/api/v1/auth/register", json=test_user_data)
        login_response = await test_client.post(
            "/api/v1/auth/login",
            json={
                "email": test_user_data["email"],
                "password": test_user_data["password"]
            }
        )
        refresh_token = login_response.json()["refresh_token"]
        
        # Refresh token
        response = await test_client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh_token}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
