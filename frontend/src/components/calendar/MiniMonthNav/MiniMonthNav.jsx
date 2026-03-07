import { useState } from "react";
import "./miniMonthNav.css";

import { isSameDate } from "../../../utils/dateUtils";
import { generateMonthGrid } from "../../../utils/monthGrid";

export default function MiniMonthNav({
  selectedDate,
  setSelectedDate,
  onDayClick,
  onWeekClick,
  setIsDrawerOpen = null,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const weeks = generateMonthGrid(year, month);

  const handlePrev = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="mini-calendar">
      <div className="mini-header">
        <button className="nav-btn" onClick={handlePrev}>
          &lt;
        </button>
        <div className="mini-title">
          {year}年{month}月
        </div>
        <button className="nav-btn" onClick={handleNext}>
          &gt;
        </button>
      </div>

      <div className="mini-weekdays">
        <div></div>
        <div className="sun">日</div>
        <div>月</div>
        <div>火</div>
        <div>水</div>
        <div>木</div>
        <div>金</div>
        <div className="sat">土</div>
      </div>

      {weeks.map((week, weekIndex) => (
        <div className="mini-week" key={weekIndex}>
          <div
            className="week-index"
            onClick={() => {
              const weekStart = week[0].date;
              onWeekClick?.(weekStart);
              setIsDrawerOpen?.(false);
            }}
          >
            {weekIndex + 1}
          </div>

          {week.map((item, idx) => {
            const { date, isCurrentMonth } = item;
            const isToday = isSameDate(date, new Date());
            const isSelected = isSameDate(date, selectedDate);

            return (
              <div
                key={idx}
                className={`day
                  ${!isCurrentMonth ? "other-month" : ""}
                  ${date.getDay() === 0 ? "sun" : ""}
                  ${date.getDay() === 6 ? "sat" : ""}
                  ${isToday ? "today" : ""}
                  ${isSelected ? "selected" : ""}
                `}
                onClick={() => {
                  setSelectedDate(date);
                  onDayClick?.(date);
                  setIsDrawerOpen(false);
                }}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
