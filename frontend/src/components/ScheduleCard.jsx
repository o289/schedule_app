import { useState } from "react";
import { Link } from "react-router-dom";
import TodoList from "../pages/todos/TodoList";
import { darkenColor } from "../utils/color";
import "./ScheduleCard.css";

export default function ScheduleCard({
  schedule,
  todos,
  setIsEditMode,
  handleTodoUpdate,
  handleTodoDelete,
  handleScheduleDelete,
}) {
  const [showTodoForm, setShowTodoForm] = useState(false);

  return (
    <>
      <div
        className="schedule-card"
        style={{
          "--category-color": schedule.category?.color || "#4a90e2",
          "--category-color-dark": darkenColor(
            schedule.category?.color || "#4a90e2"
          ),
        }}
      >
        <h2 className="schedule-title">{schedule.title}</h2>

        <p className="schedule-category">
          <span style={{ color: schedule.category?.color }}>
            {schedule.category?.name}
          </span>
        </p>

        {schedule.note && <p className="schedule-note">{schedule.note}</p>}

        <TodoList
          todos={todos}
          onToggle={(t) => handleTodoUpdate(t.id, { is_done: !t.is_done })}
          onDelete={handleTodoDelete}
        />

        <div className="schedule-actions">
          <Link to="/schedules" className="btn-link">
            ←
          </Link>
          <div>
            <button className="btn-edit" onClick={() => setIsEditMode(true)}>
              編集
            </button>
            <button className="btn-delete" onClick={handleScheduleDelete}>
              削除
            </button>
            <button
              className="btn-edit"
              style={{ marginLeft: "1rem" }}
              onClick={() => setShowTodoForm(true)}
            >
              Todo追加
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
