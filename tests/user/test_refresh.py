def test_refresh_invalid_token(raw_client):
    res = raw_client.post(
        "/auth/refresh",
        json={"refresh_token": "invalid"},
    )
    assert res.status_code == 401
    assert res.json() == {"code": "INVALID_REFRESH_TOKEN"}
