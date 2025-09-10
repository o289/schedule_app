# --- Category ---
def test_category_create_missing_name(client):
    payload = { "color": "red" }  # name が無い
    response = client.post("/categories/", json=payload)
    assert response.status_code == 422
    assert "name" in str(response.json())

# --- Schedule ---
def test_schedule_create_missing_title(client):
    payload = {
        # "title": "会議",
        "start_time": "2025-09-06T10:00:00",
        "end_time": "2025-09-06T12:00:00",
        "category_id": "11111111-1111-1111-1111-111111111111",
    }
    response = client.post("/schedules/", json=payload)
    assert response.status_code == 422
    assert "title" in str(response.json())

def test_schedule_create_missing_category_id(client):
    payload = {
        "title": "会議",
        "start_time": "2025-09-06T10:00:00",
        "end_time": "2025-09-06T12:00:00",
        # "category_id" 無し
    }
    response = client.post("/schedules/", json=payload)
    assert response.status_code == 422
    assert "category_id" in str(response.json())

# --- Todo ---
def test_todo_create_missing_title(client):
    payload = {
        # "title": "資料作成",
        "priority": "high",
        "due_date": "2025-09-07",
    }
    response = client.post(
        "/schedules/11111111-1111-1111-1111-111111111111/todos", 
        json=payload
    )
    assert response.status_code == 422
    assert "title" in str(response.json())