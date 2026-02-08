def test_me_unauthorized(raw_client):
    res = raw_client.get("/auth/me")
    assert res.status_code == 401
    assert res.json() == {"code": "HTTP_ERROR"}
