def test_login_success(raw_client):
    res = raw_client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "password123",
        },
    )
    assert res.status_code == 200
    body = res.json()
    assert "access_token" in body
    assert "refresh_token" in body
    assert body["token_type"] == "bearer"


def test_login_invalid_credentials(raw_client):
    res = raw_client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "wrongpassword",
        },
    )
    assert res.status_code == 401
    assert res.json() == {"code": "INVALID_CREDENTIALS"}
