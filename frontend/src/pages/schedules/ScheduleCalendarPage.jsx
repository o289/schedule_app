import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCategory } from "../categories/categoryHandlers";
import { useSchedule } from "../schedules/useSchedule";
import { useScheduleForm } from "../../hooks/schedule/useScheduleForm";

import useIsMobile from "../../hooks/useIsMobile";

import "./ScheduleCalendarPage.css";
import CalendarMain from "../../components/calendar/CalendarMain";
import CalendarAside from "../../components/calendar/CalendarAside/CalendarAside";
import Loading from "../../components/Loading";

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

  // =============================
  // Unified State
  // =============================
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile(1024);

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
          draftSchedule={draftSchedule}
          resetForm={resetDraft}
          categories={categories}
          handleChange={handleChange}
          handleScheduleCreate={handleScheduleCreate}
          handleScheduleUpdate={handleScheduleUpdate}
          handleScheduleDelete={handleScheduleDelete}
        />

        <div className="calendar-main">
          <CalendarMain
            schedules={schedules}
            setDraftSchedule={setDraftSchedule}
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
      <CalendarMain
        schedules={schedules}
        setDraftSchedule={setDraftSchedule}
        setIsDrawerOpen={setIsDrawerOpen}
      />

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <CalendarAside
              draftSchedule={draftSchedule}
              resetForm={resetDraft}
              categories={categories}
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
