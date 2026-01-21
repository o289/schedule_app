import { useState } from "react";
import { Button } from "@mui/material";

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

  // 当月の日数を取得
  const daysInMonth = new Date(year, month, 0).getDate();

  // YYYY-MM-DD 形式を生成
  const formatDate = (day) =>
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // 日付クリックでトグル選択
  const handleClick = (day) => {
    const dateStr = String(formatDate(day));

    setSelectedDates((prev) => {
      // 現在の配列(prev)をもとに新しい状態を決定
      const updated = prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr) // すでに選択済なら削除
        : [...prev, dateStr]; // 未選択なら追加

      // 最新の状態を返す（このreturnが新しいstateになる）
      return updated;
    });
  };

  // 前の月へ
  const prevMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };

  // 次の月へ
  const nextMonth = () => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  };

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
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const dateStr = formatDate(day);
          return (
            <div
              key={day}
              style={dayStyle(selectedDates.includes(dateStr))}
              onClick={() => handleClick(day)}
            >
              {day}
            </div>
          );
        })}
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
