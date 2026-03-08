import { useState, useEffect } from "react";
import { DateTimeCard } from "../card/dates/DateTimeCard";
import { buildTimeGroupsFromDates } from "../card/dates/scheduleViewAdapter";

import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Delete as DeleteIcon } from "@mui/icons-material";

import TodoList from "../../pages/todos/TodoList";
import TodoForm from "../../pages/todos/TodoForm";
import { useTodo } from "../../pages/todos/useTodo";
import { formatDateTime } from "../../utils/date";
import "./scheduleAsideDetail.css"
export default function ScheduleAsideDetail({
  schedule,
  handleScheduleDelete,
  setAsideMode,
  selectedEvent,
  setIsDrawerOpen = null,
}) {
  if (!schedule) {
    return <div>データがありません</div>;
  }

  const [openForm, setOpenForm] = useState(false);
  const start = selectedEvent?.start;
  const end = selectedEvent?.end;

  const selectedDateStr = start
    ? formatDateTime(start, "date")
    : null;

  const otherDates = Array.isArray(schedule?.dates)
    ? schedule.dates.filter((d) => {
        if (!selectedDateStr) return true;
        const dStr = formatDateTime(d.start_date,"date")
        return dStr !== selectedDateStr;
      })
    : [];

  const {
    todos,
    formData,
    setFormData,
    fetchTodos,
    handleTodoCreate,
    handleTodoUpdate,
    handleTodoDelete,
  } = useTodo(schedule.id);

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <Button
        type="button"
        variant="contained"
        startIcon={<CloseIcon />}
        onClick={() => {
          setAsideMode(null);
          if (setIsDrawerOpen) {
            setIsDrawerOpen(false);
          }
        }}
        className="mui-button"
      >
        戻る
      </Button>

      <Button
        type="button"
        color="warning"
        variant="contained"
        onClick={() => {
          setAsideMode("edit");
        }}
        className="mui-button"
      >
        編集
      </Button>

      <Button
        type="button"
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => {
          handleScheduleDelete();
          setAsideMode(null);
        }}
        className="mui-button"
      >
        削除
      </Button>

      <h2>{schedule.title}</h2>

      <h3>{formatDateTime(start, "date") || "日付不明"}</h3>

      <p>
        {formatDateTime(start,"time")} - {formatDateTime(end,"time")}
      </p>

      <div>
        <strong>カテゴリー:</strong> {schedule.category?.name || "なし"}
      </div>

      <div>
        <strong>選択日以外一覧:</strong>

        {Array.isArray(otherDates) && otherDates.length > 0 ? (
          buildTimeGroupsFromDates(otherDates, "gray").map((timeGroup) => (
            <DateTimeCard
              key={`${timeGroup.start}-${timeGroup.end}`}
              timeGroup={timeGroup}
            />
          ))
        ) : (
          <p>なし</p>
        )}

        {schedule.note && (
          <div>
            <strong>メモ:</strong> {schedule.note}
          </div>
        )}

        <TodoList
          todos={todos}
          onToggle={(t) => handleTodoUpdate(t.id, { is_done: !t.is_done })}
          onDelete={handleTodoDelete}
        />

        {openForm ? (
          <TodoForm
            formData={formData}
            onChange={(e) => {
              const { name, value } = e.target;
              setFormData({
                ...formData,
                [name]: name === "due_date" && value === "" ? null : value,
              });
            }}
            onCancel={() => setOpenForm(false)}
            onSubmit={(e) => {
              e.preventDefault();
              handleTodoCreate(formData);
            }}
          />
        ) : (
          <Button
            type="button"
            variant="contained"
            className="mui-button"
            onClick={() => {
              setOpenForm(true);
            }}
          >
            ToDoを追加
          </Button>
        )}
      </div>
    </div>
  );
}
