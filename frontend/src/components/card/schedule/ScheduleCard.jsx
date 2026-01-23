import { useState } from "react";
import { Link } from "react-router-dom";
import TodoList from "../../../pages/todos/TodoList";
import { formatDateTime } from "../../../utils/date";
import { darkenColor } from "../../../utils/color";
import "./ScheduleCard.css";
import ScheduleDatesCard from "../schedule/ScheduleDatesCard";

import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import CardContainer from "../common/CardContainer";

export default function ScheduleCard({
  schedule,
  todos,
  setIsEditMode,
  handleTodoUpdate,
  handleTodoDelete,
  handleScheduleDelete,
  showTodoForm,
}) {
  return (
    <>
      <div className="schedule-actions">
        <Link to="/schedules" className="btn-link">
          ←
        </Link>
        <div>
          <Link
            className="btn-edit"
            style={{
              "--category-color": schedule.category?.color || "#4a90e2",
              // "--category-color-dark": darkenColor(
              //   schedule.category?.color || "#4a90e2"
              // ),
            }}
            onClick={() => setIsEditMode(true)}
          >
            編集
          </Link>
          <Link
            className="btn-edit"
            style={{
              "--category-color": schedule.category?.color || "#4a90e2",
              // "--category-color-dark": darkenColor(
              //   schedule.category?.color || "#4a90e2"
              // ),
            }}
            onClick={showTodoForm}
          >
            Todo
          </Link>

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            style={{ marginLeft: "1rem" }}
            onClick={handleScheduleDelete}
          >
            削除
          </Button>
        </div>
      </div>

      <CardContainer size="lg">
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
        </div>
      </CardContainer>

      <h3>予定の日にち一覧</h3>
      {Array.isArray(schedule?.dates) && schedule.dates.length > 0 ? (
        schedule.dates.map((d) => <ScheduleDatesCard key={d.id} date={d} />)
      ) : (
        <p>日程はまだ登録されていません。</p>
      )}

      <TodoList
        todos={todos}
        onToggle={(t) => handleTodoUpdate(t.id, { is_done: !t.is_done })}
        onDelete={handleTodoDelete}
      />
    </>
  );
}
