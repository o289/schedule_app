import { Link } from "react-router-dom";
import { useCategory } from "../categories/categoryHandlers"
import { useDateTime } from "../schedules/useDateTime"
import { useSchedule } from "../schedules/useSchedule";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import CalendarBase from "../../components/CalendarBase";

import ScheduleForm from "./ScheduleForm";

import "./ScheduleCalendarPage.css"; // ← CSSを読み込む
import "./ScheduleForm.css"



export default function ScheduleCalendarPage() {
  const { categories, setCategories } = useCategory();


  const {
    schedules,
    handleScheduleCreate,
    handleChange,
    isCreating,
    setIsCreating,
    formData,
    error
  } = useSchedule();

  const {
    handleDateClick,
    events,

  } = useDateTime(schedules);

  return (
    <div style={{ padding: "1rem" }}>
      {isCreating && (
          <ScheduleForm
              formData={formData}
              onChange={handleChange}
              onSubmit={handleScheduleCreate}
              submitLabel="作成"
              onCancel={ () => setIsCreating(false) }
              categories={categories}
              useDateTime={false}
          />
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 作成モード中はカレンダー非表示 */}
      {!isCreating && (
        <>
          <CalendarBase
            events={events}
            handleDateClick={handleDateClick}
            buttonEvent={ () => setIsCreating(true) }
          />
        </>
      )}
    </div>
  );
}