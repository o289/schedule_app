import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCategory } from "../categories/categoryHandlers";
import { useSchedule } from "../schedules/useSchedule";
import { useScheduleForm } from "../../hooks/schedule/useScheduleForm";

import useIsMobile from "../../hooks/useIsMobile";

import CalendarMain from "../../components/calendar/CalendarMain";
import CalendarAside from "../../components/calendar/CalendarAside/CalendarAside";

import Loading from "../../components/Loading";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

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
      <div className="flex h-full overflow-hidden bg-[#f8f9fb]">
        <div className="w-[368px]">
          <CalendarAside
            draftSchedule={draftSchedule}
            resetForm={resetDraft}
            categories={categories}
            handleChange={handleChange}
            handleScheduleCreate={handleScheduleCreate}
            handleScheduleUpdate={handleScheduleUpdate}
            handleScheduleDelete={handleScheduleDelete}
          />
        </div>

        <div className="flex-1 overflow-auto bg-white px-5">
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
    <div className="h-full bg-[#f8f9fb]">
      <div className="px-4 py-2">
        <IconButton onClick={() => setIsDrawerOpen(true)}>
          <MenuIcon />
        </IconButton>
      </div>

      <CalendarMain
        schedules={schedules}
        setDraftSchedule={setDraftSchedule}
        setIsDrawerOpen={setIsDrawerOpen}
      />

      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
          },
        }}
      >
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
      </Drawer>
    </div>
  );
}
