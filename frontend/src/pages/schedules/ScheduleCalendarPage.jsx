import { Link } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import CalendarBase from "../../components/CalendarBase";

import ScheduleForm from "./ScheduleForm";
import useScheduleCalendar from "./useScheduleCalendar";

import "./ScheduleCalendarPage.css"; // ← CSSを読み込む
import "./ScheduleForm.css"



export default function ScheduleCalendarPage() {
  const {
    events,
    categories,
    error,
    isCreating,
    setIsCreating,
    formData,
    handleChange,
    handleCreate,
    selectedDates,
    addDate,
    updateDate,
    removeDate,
    handleDateClick,
  } = useScheduleCalendar();

  return (
    <div style={{ padding: "1rem" }}>
      {isCreating && (
          <>
            <ScheduleForm
              formData={formData}
              onChange={handleChange}
              onSubmit={handleCreate}
              submitLabel="作成"
              categories={categories}
              useDateTime={false}
            />
            <div className="form-group">
              <label>日付</label>
              {selectedDates.map((date, idx) => (
                  <div key={idx} className="date-row">
                  <input
                      type="date"
                      value={date}
                      onChange={(e) => updateDate(idx, e.target.value)}
                      required
                  />
                  <button
                      type="button"
                      className="btn-category btn-cancel"
                      onClick={() => removeDate(idx)}
                  >
                      削除
                  </button>
                  </div>
              ))}
              <button type="button" className="btn-category btn-submit" onClick={addDate}>
                  ＋日付追加
              </button>
              </div>
            <button onClick={() => setIsCreating(false)} className="btn-category btn-cancel">
              キャンセル
            </button>
        </>
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