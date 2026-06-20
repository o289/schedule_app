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

  const handlePrev = () => {
    const api = calendarRef.current?.getApi();

    if (!api) {
      const prevDate = new Date(selectedDate);

      if (currentView === "week") {
        prevDate.setDate(prevDate.getDate() - 7);
      } else {
        prevDate.setDate(prevDate.getDate() - 1);
      }

      setSelectedDate(prevDate);
      return;
    }

    api.prev();

    setSelectedDate(api.getDate());
  };

  const handleNext = () => {
    const api = calendarRef.current?.getApi();

    if (!api) {
      const nextDate = new Date(selectedDate);

      if (currentView === "week") {
        nextDate.setDate(nextDate.getDate() + 7);
      } else {
        nextDate.setDate(nextDate.getDate() + 1);
      }

      setSelectedDate(nextDate);
      return;
    }

    api.next();

    setSelectedDate(api.getDate());
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

      handleNext,
      handlePrev,
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
