import { useState } from "react";
import { useCalendarEvents } from "./useCalendarEvent";
import { useCalendar } from "../../context/CalendarContext";
import FullCalendarWrapper from "./FullCalendarWrapper";

export default function CalendarMain({
  schedules,
  setDraftSchedule,
  setIsDrawerOpen = null,
}) {
  const { events } = useCalendarEvents(schedules);

  const {
    calendarRef,
    selectedDate,
    setSelectedDate,
    currentView,
    setCurrentView,
    setSelectedEvent,
    setAsideMode,
    handleDaySelect,
  } = useCalendar();

  return (
    <div className="md:mt-6 rounded-2xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
      <FullCalendarWrapper
        ref={calendarRef}
        events={events}
        selectedDate={selectedDate}
        currentView={currentView}
        onDateClick={(date) => handleDaySelect(date)}
        setDraftSchedule={setDraftSchedule}
        setAsideMode={setAsideMode}
        setSelectedEvent={setSelectedEvent}
        setIsDrawerOpen={setIsDrawerOpen}
      />
    </div>
  );
}
