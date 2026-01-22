import { formatDateTime } from "../../../utils/date";
import "./ScheduleCard.css";

export default function ScheduleDatesCard({ date }) {
  return (
    <div key={date.id} className="schedule-dates-card">
      <p className="schedule-dates-date">📅 日時</p>
      <p className="schedule-dates-description">
        {formatDateTime(date.start_date, "date")} 〜{" "}
        {formatDateTime(date.end_date, "date")}
      </p>

      <p className="schedule-dates-time">⏰ 時刻</p>
      <p className="schedule-dates-description">
        {formatDateTime(date.start_date, "time")} 〜{" "}
        {formatDateTime(date.end_date, "time")}
      </p>
    </div>
  );
}
