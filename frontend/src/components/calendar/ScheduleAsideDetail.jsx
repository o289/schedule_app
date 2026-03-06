import { DateTimeCard } from "../card/dates/DateTimeCard";
import { buildTimeGroupsFromDates } from "../card/dates/scheduleViewAdapter";

import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Delete as DeleteIcon } from "@mui/icons-material";

export default function ScheduleAsideDetail({
  schedule,
  handleScheduleDelete,
  setAsideMode,
  selectedDate,
  setIsDrawerOpen = null,
}) {
  if (!schedule) {
    return <div>データがありません</div>;
  }

  const selectedDateStr = selectedDate
    ? new Date(selectedDate).toISOString().slice(0, 10)
    : null;

  const otherDates = Array.isArray(schedule?.dates)
    ? schedule.dates.filter((d) => {
        if (!selectedDateStr) return true;
        const dStr = new Date(d.start_date).toISOString().slice(0, 10);
        return dStr !== selectedDateStr;
      })
    : [];

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
      >
        戻る
      </Button>

      <Button
        type="button"
        variant="contained"
        onClick={() => {
          setAsideMode("edit");
        }}
      >
        編集
      </Button>

      <Button
        type="button"
        variant="contained"
        startIcon={<DeleteIcon />}
        onClick={() => {
          handleScheduleDelete();
          setAsideMode(null);
        }}
      >
        削除
      </Button>

      <h2>{schedule.title}</h2>

      <h3>{selectedDateStr || "日付不明"}</h3>

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
      </div>
    </div>
  );
}
