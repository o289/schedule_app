import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCategory } from "../categories/categoryHandlers";
import { useDateTime } from "../schedules/useDateTime";
import { useSchedule } from "../schedules/useSchedule";
import { useScheduleForm } from "../../hooks/schedule/useScheduleForm";
import { useCalendarEvents } from "../../components/calendar/useCalendarEvent";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import FullCalendarWrapper from "../../components/calendar/FullCalendarWrapper";
import CalendarAside from "../../components/calendar/CalendarAside/CalendarAside";
import useIsMobile from "../../hooks/useIsMobile";

import Loading from "../../components/Loading";

import "./ScheduleCalendarPage.css";

export default function ScheduleCalendarPage() {
  const { categories } = useCategory();

  const {
    schedules,
    isFetching,
    handleScheduleCreate,
    handleScheduleUpdate,
    handleScheduleDelete,
    fetchSchedules,
    draftSchedule,
    setDraftSchedule,
    resetDraft,
    handleChange,
  } = useSchedule();

  const { handleDateClick } = useDateTime(schedules);
  const { events } = useCalendarEvents(schedules);
  const [asideMode, setAsideMode] = useState(null);

  // =============================
  // Unified State
  // =============================

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState("week");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const calendarRef = useRef(null);
  const isMobile = useIsMobile(1024);

  // =============================
  // Handlers
  // =============================

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

  useEffect(() => {
    fetchSchedules(); // ← マウント時に必ず実行
  }, []);

  if (isFetching || !schedules) {
    return <Loading />;
  }

  // =============================
  // Desktop Layout
  // =============================

  if (!isMobile) {
    return (
      <div className="calendar-layout">
        <CalendarAside
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedEvent={selectedEvent}
          onDayClick={handleDaySelect}
          onWeekClick={handleWeekSelect}
          draftSchedule={draftSchedule}
          resetForm={resetDraft}
          categories={categories}
          asideMode={asideMode}
          setAsideMode={setAsideMode}
          handleChange={handleChange}
          handleScheduleCreate={handleScheduleCreate}
          handleScheduleUpdate={handleScheduleUpdate}
          handleScheduleDelete={handleScheduleDelete}
        />

        <div className="calendar-main">
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
          />
        </div>
      </div>
    );
  }

  // =============================
  // Mobile Layout
  // =============================

  return (
    <div className="calender-contents">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="hamburger" onClick={() => setIsDrawerOpen(true)}>
          ☰
        </div>
      </div>

      {/* Calendar */}
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

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <CalendarAside
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedEvent={selectedEvent}
              onDayClick={handleDaySelect}
              onWeekClick={handleWeekSelect}
              draftSchedule={draftSchedule}
              resetForm={resetDraft}
              categories={categories}
              asideMode={asideMode}
              setAsideMode={setAsideMode}
              handleChange={handleChange}
              handleScheduleCreate={handleScheduleCreate}
              handleScheduleUpdate={handleScheduleUpdate}
              handleScheduleDelete={handleScheduleDelete}
              setIsDrawerOpen={setIsDrawerOpen}
              closeButton={() => {
                setIsDrawerOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
