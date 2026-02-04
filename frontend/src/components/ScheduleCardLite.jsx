import { darkenColor } from "../utils/color";
import { formatDateTime } from "../utils/date";
import "./ScheduleCard.css";


export default function ScheduleCardLite({ schedule }) {
  return (
    <>
      <div
        className="schedule-card"
        style={{
          "--category-color": schedule.category?.color || "#4a90e2",
          "--category-color-dark": darkenColor(
            schedule.category?.color || "#4a90e2"
          ),
        }}
      >
        <h2 className="schedule-title">{schedule.title}</h2>

        <p className="schedule-category">
          <span style={{ color: schedule.category?.color }}>
            {schedule.category?.name}
          </span>
        </p>

        {schedule.note && <p className="schedule-note">{schedule.note}</p>}
        
        <ul>
          {schedule.dates.map((d) =>(
            <li key={d.id}>
              {formatDateTime(d.start_date)} 〜 {formatDateTime(d.end_date)}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
