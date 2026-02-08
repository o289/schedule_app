import uuid
from datetime import date


# --------------------------------
# list todos
# --------------------------------
def test_list_todos_success(client, schedule):
    res = client.get(f"/schedules/{schedule.id}/todos")
    assert res.status_code == 200


def test_list_todos_forbidden_schedule(client):
    res = client.get(f"/schedules/{uuid.uuid4()}/todos")
    assert res.status_code == 403
    assert res.json()["code"] == "FORBIDDEN_SCHEDULE"


# --------------------------------
# create todo
# --------------------------------
def test_create_todo_success(client, schedule):
    payload = {
        "title": "Buy milk",
        "priority": "high",
        "due_date": "2025-01-01",
    }
    res = client.post(f"/schedules/{schedule.id}/todos", json=payload)
    assert res.status_code == 201


def test_create_todo_validation_error(client, schedule):
    payload = {
        "priority": "high",
    }
    res = client.post(f"/schedules/{schedule.id}/todos", json=payload)
    assert res.status_code == 422


def test_create_todo_forbidden_schedule(client):
    payload = {
        "title": "Task",
    }
    res = client.post(f"/schedules/{uuid.uuid4()}/todos", json=payload)
    assert res.status_code == 403
    assert res.json()["code"] == "FORBIDDEN_SCHEDULE"


# --------------------------------
# update todo
# --------------------------------
def test_update_todo_success(client, schedule):
    # create first
    create = client.post(
        f"/schedules/{schedule.id}/todos",
        json={"title": "Initial"},
    )
    todo_id = create.json()["id"]

    res = client.put(
        f"/schedules/{schedule.id}/todos/{todo_id}",
        json={"title": "Updated", "is_done": True},
    )
    assert res.status_code == 200


def test_update_todo_not_found(client):
    res = client.put(
        f"/schedules/{uuid.uuid4()}/todos/{uuid.uuid4()}",
        json={"title": "Updated"},
    )
    assert res.status_code == 404
    assert res.json()["code"] == "NOT_FOUND_TODO"


# --------------------------------
# delete todo
# --------------------------------
def test_delete_todo_success(client, schedule):
    create = client.post(
        f"/schedules/{schedule.id}/todos",
        json={"title": "Delete me"},
    )
    todo_id = create.json()["id"]

    res = client.delete(f"/schedules/{schedule.id}/todos/{todo_id}")
    assert res.status_code == 204


def test_delete_todo_not_found(client):
    res = client.delete(f"/schedules/{uuid.uuid4()}/todos/{uuid.uuid4()}")
    assert res.status_code == 404
    assert res.json()["code"] == "NOT_FOUND_TODO"
