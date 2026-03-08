import { useState, useEffect } from "react";
import "./scheduleAsideForm.css";
import { generateMonthGrid, shiftMonth } from "../../../utils/monthGrid";
import TimePicker from "../../commonPicker/TimePicker";
import ScheduleDatesModal from "../../../pages/schedules/DatesModal";
import { handleDateTime } from "../../../pages/schedules/useDateTime";

import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

export default function ScheduleAsideForm({
  draftSchedule,
  categories = [],
  onChange,
  onSubmit,
  onCancel,
}) {
  // フォーム
  const {
    dates,
    setDates,
    selectedDates,
    setSelectedDates,
    start,
    setStart,
    end,
    setEnd,
    addDate,
    removeDate,
    datesDisable,
  } = handleDateTime(draftSchedule, onChange);

  const [showDatesModal, setShowDatesModal] = useState(false);

  // フォームの誤送信防止
  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    if (
      draftSchedule.title &&
      draftSchedule.title.trim() !== "" &&
      dates.length > 0 &&
      draftSchedule.category_id
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [draftSchedule.title, dates, draftSchedule.category_id]);

  // 日付ロジック一覧
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // month is 1-based

  const handleClick = (dateString) => {
    setSelectedDates((prev) => {
      const updated = prev.includes(dateString)
        ? prev.filter((d) => d !== dateString)
        : [...prev, dateString];
      return updated;
    });
  };

  const prevMonth = () => {
    const { year: newYear, month: newMonth } = shiftMonth(year, month, -1);
    setYear(newYear);
    setMonth(newMonth);
  };

  const nextMonth = () => {
    const { year: newYear, month: newMonth } = shiftMonth(year, month, 1);
    setYear(newYear);
    setMonth(newMonth);
  };

  const weeks = generateMonthGrid(year, month);

  return (
    <form onSubmit={onSubmit}>
      <div className="section">
        <div className="label">タイトル</div>
        <input
          placeholder="タイトルを入力"
          type="text"
          name="title"
          value={draftSchedule.title || ""}
          onChange={onChange}
          required
        />
      </div>

      <div className="section">
        <div className="label">カテゴリ</div>
        <select
          name="category_id"
          value={draftSchedule.category_id || ""}
          onChange={onChange}
          required
        >
          <option value="">選択してください</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="section time-row">
        {/* 開始時間 */}
        <TimePicker
          label="開始"
          mode="start"
          value={start}
          constraintValue={end}
          onChange={setStart}
        />

        {/* 終了時間 */}
        <TimePicker
          label="終了"
          mode="end"
          value={end}
          constraintValue={start}
          onChange={setEnd}
        />
      </div>

      {start && end && (
        <>
          <div className="section">
            <div className="month-nav">
              <button type="button" onClick={prevMonth}>
                &lt;
              </button>
              <div>
                {year}年 {month}月
              </div>
              <button type="button" onClick={nextMonth}>
                &gt;
              </button>
            </div>

            <div className="calendar">
              {weeks.map((week, weekIndex) =>
                week.map((dayObj, dayIndex) => {
                  const { dateString, day, isCurrentMonth } = dayObj;
                  const isSelected = draftSchedule.dates?.some((d) =>
                    d.start_date.startsWith(dateString),
                  );

                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`day ${isSelected ? "selected" : ""}${!isCurrentMonth ? "other-month" : ""}`}
                      onClick={() => {
                        if (!isCurrentMonth) return;
                        handleClick(dateString);
                        addDate(dateString);
                      }}
                    >
                      {day}
                    </div>
                  );
                }),
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="contained"
            onClick={() => setShowDatesModal(true)}
          >
            登録済み日程を見る
          </Button>
        </>
      )}

      <div className="section">
        <div className="label">メモ（任意）</div>
        <textarea
          rows="2"
          placeholder="メモを入力"
          name="note"
          value={draftSchedule.note || ""}
          onChange={onChange}
        ></textarea>
      </div>

      <Button
        type="submit"
        variant="contained"
        className="submit-btn"
        startIcon={<SendIcon />}
        disabled={disabled}
      >
        完了
      </Button>

      <Button
        type="button"
        variant="contained"
        startIcon={<CloseIcon />}
        className="btn-cancel"
        onClick={onCancel}
      >
        終了
      </Button>

      {showDatesModal && (
        <ScheduleDatesModal
          dates={draftSchedule.dates}
          removeDate={removeDate}
          onClose={() => setShowDatesModal(false)}
          onChange={(newDates) => {
            onChange({
              target: {
                name: "dates",
                value: newDates,
              },
            });
          }}
        />
      )}
    </form>
  );
}
