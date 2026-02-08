import uuid


# ----------------------------
# 作成（正常系）
# ----------------------------


def test_category_create_success(client):
    res = client.post(
        "/categories/",
        json={
            "name": "仕事",
            "color": "red",
        },
    )

    assert res.status_code == 201
    body = res.json()

    assert "id" in body
    assert "user_id" in body
    assert body["name"] == "仕事"
    assert body["color"] == "red"


def test_category_create_default_color(client):
    res = client.post(
        "/categories/",
        json={
            "name": "プライベート",
        },
    )

    assert res.status_code == 201
    body = res.json()

    assert body["name"] == "プライベート"
    assert body["color"] == "gray"  # デフォルト値


# ----------------------------
# 作成（バリデーション）
# ----------------------------


def test_category_create_missing_name(client):
    res = client.post(
        "/categories/",
        json={
            "color": "blue",
        },
    )

    assert res.status_code == 422
    assert res.json() == {"code": "VALIDATION_ERROR"}


def test_category_create_invalid_color(client):
    res = client.post(
        "/categories/",
        json={
            "name": "不正カラー",
            "color": "black",
        },
    )

    assert res.status_code == 422
    assert res.json() == {"code": "VALIDATION_ERROR"}


# ----------------------------
# 一覧取得
# ----------------------------


def test_category_list(client):
    res = client.get("/categories/")

    assert res.status_code == 200
    body = res.json()

    assert isinstance(body, list)


# ----------------------------
# 更新
# ----------------------------


def test_category_update_success(client):
    # 事前作成
    create_res = client.post(
        "/categories/",
        json={"name": "更新前"},
    )
    category_id = create_res.json()["id"]

    res = client.put(
        f"/categories/{category_id}",
        json={"name": "更新後", "color": "green"},
    )

    assert res.status_code == 200
    body = res.json()

    assert body["id"] == category_id
    assert body["name"] == "更新後"
    assert body["color"] == "green"


def test_category_update_not_found(client):
    res = client.put(
        f"/categories/{uuid.uuid4()}",
        json={"name": "存在しない"},
    )

    assert res.status_code == 404
    assert res.json() == {"code": "NOT_FOUND_CATEGORY"}


# ----------------------------
# 削除
# ----------------------------


def test_category_delete_success(client):
    create_res = client.post(
        "/categories/",
        json={"name": "削除対象"},
    )
    category_id = create_res.json()["id"]

    res = client.delete(f"/categories/{category_id}")

    assert res.status_code == 204 or res.status_code == 200


def test_category_delete_not_found(client):
    res = client.delete(f"/categories/{uuid.uuid4()}")

    assert res.status_code == 404
    assert res.json() == {"code": "NOT_FOUND_CATEGORY"}
