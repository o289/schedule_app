import { Link } from "react-router-dom";
import { useCategory } from "../categories/categoryHandlers";
import { useDateTime } from "../schedules/useDateTime";
import { useSchedule } from "../schedules/useSchedule";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import CalendarBase from "../../components/CalendarBase";
import ScheduleForm from "./ScheduleForm";
import ErrorModal from "../../components/ErrorModal";

import "./ScheduleCalendarPage.css"; // ← CSSを読み込む

export default function ScheduleCalendarPage() {
  const { categories } = useCategory();

  const {
    schedules,
    handleScheduleCreate,
    handleChange,
    isCreating,
    setIsCreating,
    formData,
    error,
  } = useSchedule();

  const { handleDateClick, events } = useDateTime(schedules);

  return (
    <div style={{ padding: "1rem" }}>
      {isCreating ? (
        <ScheduleForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleScheduleCreate}
          submitLabel="作成"
          onCancel={() => setIsCreating(false)}
          categories={categories}
        />
      ) : (
        <CalendarBase
          events={events}
          handleDateClick={handleDateClick}
          buttonEvent={() => setIsCreating(true)}
        />
      )}

      {error && <ErrorModal error={error} />}
    </div>
  );
}
