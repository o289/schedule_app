// DateTimeCard.jsx
import { useState } from "react";
import TimePicker from "../../commonPicker/TimePicker";
import "./dateTimeCard.css";
import {
  formatDate,
  normalizeDates,
  getVisibleDates,
} from "./dateTimeCardLogic";

export function DateTimeCard({ timeGroup }) {
  const dates = normalizeDates(timeGroup?.dates);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="date-card">
      {/* 時刻帯 */}
      <div className="section">
        <div className="section-title">⏰ 時刻帯</div>

        <div className="time-row">
          <div className="label">開始</div>
          <span className="time-text">{timeGroup.start}</span>
        </div>

        <div className="time-row">
          <div className="label">終了</div>
          <span className="time-text">{timeGroup.end}</span>
        </div>
      </div>

      {/* 日付一覧 */}
      <div className="section">
        <div className="section-title">📅 対象日</div>

        {dates.length > 0 ? (
          (() => {
            const { visible, rest } = getVisibleDates(dates);
            const shownDates = isExpanded ? dates : visible;

            return (
              <ul className="date-list">
                {shownDates.map((d) => (
                  <li
                    key={d.id}
                    className={
                      d.isPast ? "date-item date-item--past" : "date-item"
                    }
                  >
                    {formatDate(d.date)}
                  </li>
                ))}
                {!isExpanded && rest > 0 && (
                  <li onClick={() => setIsExpanded(true)}>…その他 {rest} 件</li>
                )}
              </ul>
            );
          })()
        ) : (
          <p>日程はまだ登録されていません。</p>
        )}
      </div>
    </div>
  );
}
