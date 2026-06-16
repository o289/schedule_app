import { useState, useRef } from "react";
import FullCalendarWrapper from "./FullCalendarWrapper";
import { useCalendarEvents } from "./useCalendarEvent";

export default function CalendarMain({
  schedules,
  selectedDate,
  setSelectedDate,
  setDraftSchedule,
  setAsideMode,
  setSelectedEvent,
  setIsDrawerOpen = null,
}) {
  const { events } = useCalendarEvents(schedules);
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = useState("week");

  return (
    <div className="md:mt-6 rounded-2xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
      <FullCalendarWrapper
        ref={calendarRef}
        events={events}
        selectedDate={selectedDate}
        currentView={currentView}
        onDateClick={(date) => {
          setSelectedDate(date);
          setCurrentView("day");

          const api = calendarRef.current?.getApi();
          if (api) {
            api.changeView("timeGridDay", date);
          }
        }}
        setDraftSchedule={setDraftSchedule}
        setAsideMode={setAsideMode}
        setSelectedEvent={setSelectedEvent}
        setIsDrawerOpen={setIsDrawerOpen}
      />
    </div>
  );
}
