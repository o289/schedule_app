import { useState, useEffect } from "react";
import { DateTimeCard } from "./DateTimeCard";
import { buildTimeGroupsFromDates } from "./scheduleViewAdapter";

import { Button, Chip, Divider } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import TodoList from "../../pages/todos/TodoList";
import TodoForm from "../../pages/todos/TodoForm";
import { useTodo } from "../../pages/todos/useTodo";
import { formatDateTime } from "../../utils/date";
import { getCategoryTheme } from "../../utils/getCategoryTheme";

export default function ScheduleAsideDetail({
  schedule,
  handleScheduleDelete,
  setAsideMode,
  selectedEvent,
  setIsDrawerOpen = null,
}) {
  if (!schedule) {
    setAsideMode(null);
  }

  const [openForm, setOpenForm] = useState(false);
  const start = selectedEvent?.start;
  const end = selectedEvent?.end;

  const selectedDateStr = start ? formatDateTime(start, "date") : null;

  const otherDates = Array.isArray(schedule?.dates)
    ? schedule.dates.filter((d) => {
        if (!selectedDateStr) return true;
        const dStr = formatDateTime(d.start_date, "date");
        return dStr !== selectedDateStr;
      })
    : [];

  const theme = getCategoryTheme(schedule.category.color);
  const iconColor = theme.border;
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
    <>
      <Button
        type="button"
        variant="text"
        startIcon={<ArrowBackIcon sx={{ fontSize: 36 }} />}
        onClick={() => {
          setAsideMode(null);
          if (setIsDrawerOpen) {
            setIsDrawerOpen(false);
          }
        }}
        sx={{
          color: "#111827",
          minWidth: "auto",
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
        className="!text-xl !justify-start !p-0"
      >
        戻る
      </Button>
      <div className="p-4">
        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
          <h1 className="text-4xl font-bold mb-6 break-words">
            {schedule.title}
          </h1>

          <Divider className="!mb-6" />

          <div className="flex items-center gap-4 mb-6">
            <CalendarMonthOutlinedIcon
              sx={{ color: iconColor, fontSize: 40 }}
            />
            <div>
              <div className="text-gray-500 text-sm">日付</div>
              <div className="text-2xl">
                {formatDateTime(start, "date") || "日付不明"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <AccessTimeOutlinedIcon sx={{ color: iconColor, fontSize: 40 }} />
            <div>
              <div className="text-gray-500 text-sm">時間</div>
              <div className="text-2xl">
                {formatDateTime(start, "time")} - {formatDateTime(end, "time")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <LocalOfferOutlinedIcon sx={{ color: iconColor, fontSize: 40 }} />
            <div>
              <div className="text-gray-500 text-sm mb-2">カテゴリー</div>
              <Chip
                label={schedule.category?.name || "なし"}
                sx={{
                  backgroundColor: iconColor,
                  color: "#fff",
                  fontWeight: 600,
                }}
              />
            </div>
          </div>

          {schedule.note && (
            <>
              <Divider className="!mb-6" />
              <div>
                <div className="font-semibold mb-2">メモ</div>
                <div>{schedule.note}</div>
              </div>
            </>
          )}
        </div>

        {Array.isArray(otherDates) && otherDates.length > 0 && (
          <div className="mb-6">
            <div className="text-2xl font-bold mb-4">他の日程</div>

            {buildTimeGroupsFromDates(otherDates, "gray").map((timeGroup) => (
              <DateTimeCard
                key={`${timeGroup.start}-${timeGroup.end}`}
                timeGroup={timeGroup}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Button
            type="button"
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            sx={{
              color: iconColor,
              borderColor: iconColor,
              "&:hover": {
                borderColor: iconColor,
                backgroundColor: `${iconColor}10`,
              },
            }}
            size="large"
            onClick={() => {
              setAsideMode("edit");
            }}
          >
            編集
          </Button>

          <Button
            type="button"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            size="large"
            onClick={() => {
              handleScheduleDelete();
              setAsideMode(null);
            }}
          >
            削除
          </Button>
        </div>
      </div>
    </>
  );
}
