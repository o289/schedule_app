// components/FullCalendarWrapper.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, forwardRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import { Link } from "react-router-dom";
import useIsMobile from "../../hooks/useIsMobile";

const FullCalendarWrapper = forwardRef(function FullCalendarWrapper(
  {
    events = [],
    selectedDate,
    setSelectedEvent,
    currentView,
    onDateClick,
    setDraftSchedule,
    setAsideMode,
    setIsDrawerOpen = null,
  },
  ref,
) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  /* =============================
     View制御（PC: week / Mobile: day）
  ============================= */

  useEffect(() => {
    const calendarApi = ref?.current?.getApi();
    if (!calendarApi) return;

    // モバイルでもweekを使用
    calendarApi.changeView("timeGridWeek");
  }, [isMobile, ref]);

  /* =============================
     親からselectedDate / currentViewが
     変更された場合の同期
  ============================= */

  useEffect(() => {
    const calendarApi = ref?.current?.getApi();
    if (!calendarApi) return;

    if (!selectedDate) return;

    if (currentView === "day") {
      calendarApi.changeView("timeGridDay", selectedDate);
    } else {
      calendarApi.changeView("timeGridWeek", selectedDate);
    }
  }, [selectedDate, currentView, ref]);

  /* =============================
     dateClick → 親へ通知
  ============================= */

  const handleDateClick = (arg) => {
    onDateClick?.(arg.date);
  };

  return (
    <FullCalendar
      ref={ref}
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      locale={jaLocale}
      firstDay={0} // 日曜始まり
      events={events}
      dateClick={handleDateClick}
      headerToolbar={false}
      slotDuration="00:30:00"
      expandRows={false}
      allDaySlot={false}
      slotLabelContent={(arg) => {
        if (isMobile && arg.view.type === "timeGridWeek") {
          return null;
        }
        return arg.text;
      }}
      height="auto"
      dayHeaderContent={(arg) => {
        const date = arg.date;
        const day = date.getDate();
        const month = date.getMonth() + 1;

        const isWeek = arg.view.type === "timeGridWeek";
        const isMobileWeek = isMobile && isWeek;

        const weekday = date.toLocaleDateString("ja-JP", {
          weekday: isMobileWeek ? "short" : "long",
        });

        // 月跨ぎ判定
        const viewStartMonth = arg.view.currentStart.getMonth();
        const isCrossMonth = month - 1 !== viewStartMonth;

        if (day === 1 && isCrossMonth) {
          return isMobileWeek
            ? `${month}/${day}・${weekday}`
            : `${month}月${day}日・${weekday}`;
        }

        return isMobileWeek ? `${day}日・${weekday}` : `${day}日・${weekday}`;
      }}
      eventTimeFormat={{
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }}
      eventClick={(info) => {
        setSelectedEvent(info.event)
        setDraftSchedule(info.event.extendedProps.schedule);
        if (setIsDrawerOpen) {
          setIsDrawerOpen(true);
        }
        setAsideMode("detail");
      }}
      eventContent={(arg) => {
        return (
          <>
            <div className="ios-event-time">{arg.timeText}</div>
            <div className="ios-event-title">{arg.event.title}</div>
          </>
        );
      }}
    />
  );
});

export default FullCalendarWrapper;
