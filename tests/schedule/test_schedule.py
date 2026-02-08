import uuid
from datetime import datetime, timedelta

# -----------------------------
# create: スキーマ由来（422）
# -----------------------------


def test_create_schedule_missing_title(client, category):
    payload = {
        "dates": [
            {
                "start_date": "2025-01-01T10:00:00",
                "end_date": "2025-01-01T11:00:00",
            }
        ],
        "category_id": str(category.id),
    }
    res = client.post("/schedules/", json=payload)
    assert res.status_code == 422


def test_create_schedule_missing_dates(client, category):
    payload = {
        "title": "meeting",
        "category_id": str(category.id),
    }
    res = client.post("/schedules/", json=payload)
    assert res.status_code == 422


def test_create_schedule_empty_dates(client, category):
    payload = {
        "title": "meeting",
        "dates": [],
        "category_id": str(category.id),
    }
    res = client.post("/schedules/", json=payload)
    assert res.status_code == 422


def test_create_schedule_missing_start_date(client, category):
    payload = {
        "title": "meeting",
        "dates": [
            {
                "end_date": "2025-01-01T11:00:00",
            }
        ],
        "category_id": str(category.id),
    }
    res = client.post("/schedules/", json=payload)
    assert res.status_code == 422


def test_create_schedule_missing_end_date(client, category):
    payload = {
        "title": "meeting",
        "dates": [
            {
                "start_date": "2025-01-01T10:00:00",
            }
        ],
        "category_id": str(category.id),
    }
    res = client.post("/schedules/", json=payload)
    assert res.status_code == 422


def test_create_schedule_missing_category_id(client):
    payload = {
        "title": "meeting",
        "dates": [
            {
                "start_date": "2025-01-01T10:00:00",
                "end_date": "2025-01-01T11:00:00",
            }
        ],
    }
    res = client.post("/schedules/", json=payload)
    assert res.status_code == 422


# --------------------------------
# create: サービス由来
# --------------------------------


def test_create_schedule_invalid_time_service(client, category):
    payload = {
        "title": "meeting",
        "dates": [
            {
                "start_date": "2025-01-01T12:00:00",
                "end_date": "2025-01-01T11:00:00",
            }
        ],
        "category_id": str(category.id),
    }
    res = client.post("/schedules/", json=payload)
    assert res.status_code == 400
    assert res.json()["code"] == "INVALID_TIME"


def test_create_schedule_category_not_found(client):
    payload = {
        "title": "meeting",
        "dates": [
            {
                "start_date": "2025-01-01T10:00:00",
                "end_date": "2025-01-01T11:00:00",
            }
        ],
        "category_id": str(uuid.uuid4()),
    }
    res = client.post("/schedules/", json=payload)
    assert res.status_code == 404
    assert res.json()["code"] == "NOT_FOUND_CATEGORY"


# --------------------------------
# update: サービス由来
# --------------------------------
def test_update_schedule_invalid_time_with_dates(client, schedule):
    payload = {
        "dates": [
            {
                "start_date": "2025-01-01T19:00:00",
                "end_date": "2025-01-01T11:00:00",
            }
        ]
    }
    res = client.put(f"/schedules/{schedule.id}", json=payload)
    assert res.status_code == 400
    assert res.json()["code"] == "INVALID_TIME"


def test_update_schedule_category_not_found(client, schedule):
    payload = {
        "category_id": str(uuid.uuid4()),
    }
    res = client.put(f"/schedules/{schedule.id}", json=payload)
    assert res.status_code == 404
    assert res.json()["code"] == "NOT_FOUND_CATEGORY"


# --------------------------------
# create: success (200)
# --------------------------------
def test_create_schedule_success(client, category):
    payload = {
        "title": "meeting",
        "dates": [
            {
                "start_date": "2025-01-01T10:00:00",
                "end_date": "2025-01-01T11:00:00",
            }
        ],
        "category_id": str(category.id),
    }
    res = client.post("/schedules/", json=payload)
    assert res.status_code == 201


# --------------------------------
# update: success (200)
# --------------------------------
def test_update_schedule_success_without_dates(client, schedule):
    payload = {
        "title": "updated meeting",
        "note": "updated note",
    }
    res = client.put(f"/schedules/{schedule.id}", json=payload)
    assert res.status_code == 200


#
# --------------------------------
# list: success (200)
# --------------------------------
def test_list_schedules_success(client, schedule):
    res = client.get("/schedules/")
    assert res.status_code == 200


# --------------------------------
# get: success (200)
# --------------------------------
def test_get_schedule_success(client, schedule):
    res = client.get(f"/schedules/{schedule.id}")
    assert res.status_code == 200


# --------------------------------
# delete: success (200)
# --------------------------------
def test_delete_schedule_success(client, schedule):
    res = client.delete(f"/schedules/{schedule.id}")
    assert res.status_code == 204

    # 再取得できないことを確認
    res2 = client.get(f"/schedules/{schedule.id}")
    assert res2.status_code == 404
