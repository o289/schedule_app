import { createContext, useContext, useMemo, useState, useRef } from "react";

const CalendarContext = createContext(null);

export function CalendarProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("week");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [asideMode, setAsideMode] = useState(null);

  const calendarRef = useRef(null);

  const handleDaySelect = (date) => {
    setSelectedDate(date);
    setCurrentView("day");

    const api = calendarRef.current?.getApi();
    if (api) {
      api.changeView("timeGridDay", date);
    }
  };

  const handleWeekSelect = (date) => {
    setSelectedDate(date);
    setCurrentView("week");

    const api = calendarRef.current?.getApi();
    if (api) {
      api.changeView("timeGridWeek", date);
    }
  };

  const value = useMemo(
    () => ({
      selectedDate,
      setSelectedDate,

      currentView,
      setCurrentView,

      selectedEvent,
      setSelectedEvent,

      asideMode,
      setAsideMode,

      calendarRef,

      handleDaySelect,
      handleWeekSelect,
    }),
    [selectedDate, currentView, selectedEvent, asideMode],
  );

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }

  return context;
}
