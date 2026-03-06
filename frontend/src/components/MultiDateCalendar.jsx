import { useState } from "react";
import { Button } from "@mui/material";

import { generateMonthGrid, shiftMonth } from "../utils/monthGrid";
//
import TimePicker from "./commonPicker/TimePicker";
//

function TimeRangePicker({ startTime, setStartTime, endTime, setEndTime }) {
  return (
    <>
      {/* 開始時間 */}
      <TimePicker
        label="開始"
        mode="start"
        value={startTime}
        constraintValue={endTime}
        onChange={setStartTime}
      />

      {/* 終了時間 */}
      <TimePicker
        label="終了"
        mode="end"
        value={endTime}
        constraintValue={startTime}
        onChange={setEndTime}
      />
    </>
  );
}

function MultiDateCalendar({ selectedDates, setSelectedDates }) {
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

  // スタイル
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
    padding: "8px",
  };

  const dayStyle = (isSelected) => ({
    textAlign: "center",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: isSelected ? "#4a90e2" : "transparent",
    color: isSelected ? "#fff" : "#000",
    transition: "0.2s",
  });

  const navButtonStyle = {
    margin: "0 10px",
    padding: "6px 12px",
    cursor: "pointer",
  };

  return (
    <div>
      <div
        style={{ display: "block", textAlign: "center", marginBottom: "8px" }}
      >
        <div onClick={prevMonth} style={navButtonStyle}>
          {"<"}
        </div>
        <span style={{ fontWeight: "bold" }}>
          {year}年 {month}月
        </span>
        <div onClick={nextMonth} style={navButtonStyle}>
          {">"}
        </div>
      </div>
      <div style={gridStyle}>
        {weeks.map((week, weekIndex) =>
          week.map((dayObj, dayIndex) => {
            const { dateString, day, isCurrentMonth } = dayObj;
            const isSelected = selectedDates.includes(dateString);

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                style={{
                  ...dayStyle(isSelected),
                  opacity: isCurrentMonth ? 1 : 0.25,
                }}
                onClick={() => {
                  if (!isCurrentMonth) return;
                  handleClick(dateString);
                }}
              >
                {day}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}

// 実際にエクスポートする関数
export default function DaySelectDisplay({
  addDate,
  datesDisable,
  selectedDates,
  setSelectedDates,
  start,
  setStart,
  end,
  setEnd,
}) {
  return (
    <div>
      <MultiDateCalendar
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
      />
      <TimeRangePicker
        startTime={start}
        setStartTime={setStart}
        endTime={end}
        setEndTime={setEnd}
      />
      <Button
        type="button"
        variant="contained"
        onClick={addDate}
        disabled={datesDisable}
      >
        ＋日程追加
      </Button>
    </div>
  );
}
