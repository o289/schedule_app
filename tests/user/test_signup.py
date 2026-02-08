def test_signup_success(raw_client):
    import uuid

    email = f"test-{uuid.uuid4()}@example.com"
    res = raw_client.post(
        "/auth/signup",
        json={
            "name": "test user",
            "email": email,
            "password": "password123",
        },
    )
    assert res.status_code == 201
    body = res.json()
    assert "id" in body
    assert body["email"] == email


def test_signup_validation_error(raw_client):
    res = raw_client.post(
        "/auth/signup",
        json={"password": "password123"},
    )
    assert res.status_code == 422
    assert res.json() == {"code": "VALIDATION_ERROR"}


def test_signup_email_already_exists(raw_client):
    res = raw_client.post(
        "/auth/signup",
        json={
            "email": "test@example.com",
            "password": "password123",
        },
    )
    assert res.status_code == 409
    assert res.json() == {"code": "EMAIL_ALREADY_EXISTS"}
