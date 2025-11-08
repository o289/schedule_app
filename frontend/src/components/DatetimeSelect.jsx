import { useState, useEffect, useMemo } from "react";
import { handleDateTime } from "../pages/schedules/useDateTime";

function DatePicker({ value, onChange, min, max }) {
   const handleFocus = (e) => {
    // Chromeなどではカレンダーを自動で開く
    e.target.showPicker?.(); // ← showPicker() は標準API（対応ブラウザのみ有効）
  };

  return (
    <>
      <input type="date" value={value} onChange={onChange} onFocus={handleFocus} min={min} max={max} style={{ border: "none", outline: "none", width: "180px"}} />
    </>
  );
}

function TimePicker({ value, onChange, minTime, maxTime }) {
  const timeOptions = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => {
        const hours = String(Math.floor(i / 2)).padStart(2, "0");
        const minutes = i % 2 === 0 ? "00" : "30";
        return `${hours}:${minutes}`;
      }),
    []
  );

  const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const filteredOptions = useMemo(() => {
    return timeOptions.filter((t) => {
      if (minTime && toMinutes(t) < toMinutes(minTime)) return false;
      if (maxTime && toMinutes(t) > toMinutes(maxTime)) return false;
      return true;
    });
  }, [timeOptions, minTime, maxTime]);

  return (
    <>
      <select
        value={value}
        onChange={onChange}
        style={{ border: "none", outline: "none", height: "2.5rem" }}
      >
        <option value="">--選択--</option>
        {filteredOptions.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </>
  );
}


export default function ScheduleDateTimeSelect({ setStart, setEnd }) {
  
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  // 日時の結合
  useEffect(() => {
    if (
      startDate &&
      startTime &&
      startDate.includes("-") &&
      startTime.includes(":")
    ) {
      setStart(`${startDate}T${startTime}`);
    }
    if (endDate && endTime && endDate.includes("-") && endTime.includes(":")) {
      setEnd(`${endDate}T${endTime}`);
    }
  }, [startDate, startTime, endDate, endTime]);

  return (
    <div className="datetime-select-wrapper">
      {/* 開始日時 */}
      <div style={{ border: "1px solid #ccc", borderRadius: "6px", display: "flex", alignItems: "left", gap: "0.5rem" }}>
        <div style={{ display: "flex", margin: "0", flexDirection: "row", alignItems: "left", gap: "1rem" }}>
            <DatePicker
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
            />
            <TimePicker
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              maxTime={endTime || undefined}
            />
        </div>
      </div>

      {/* 終了日時 */}
      <div style={{ border: "1px solid #ccc", borderRadius: "6px", display: "flex", alignItems: "left", gap: "0.5rem" }}>
        <div style={{ display: "flex", margin: "0", flexDirection: "row", alignItems: "left", gap: "1rem" }}>
            <DatePicker
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
            />
            <TimePicker
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              minTime={startTime || undefined}
            />
        </div>
      </div>
    </div>
  );
}
