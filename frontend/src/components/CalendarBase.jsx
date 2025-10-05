// components/CalendarBase.jsx
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid"; // 週・日ビュー用
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import { Link } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";

export default function CalendarBase({ events, handleDateClick, buttonEvent }) {
  const isMobile = useIsMobile();

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={window.innerWidth < 768 ? "dayGridDay" : "dayGridMonth"}
      events={events}
      dateClick={handleDateClick}
      locale={jaLocale}
      firstDay={1} // 月曜始まり
      displayEventTime={false}
      headerToolbar={{
        left:
          window.innerWidth < 768
            ? "addScheduleButton" // 📱スマホ → 左に新規作成ボタン
            : "prev today next addScheduleButton",

        center: "title",

        right:
          window.innerWidth < 768
            ? "prev next today" // 📱スマホ → 右に今日ボタン
            : "dayGridMonth timeGridWeek timeGridDay",
      }}
      // --- ボタンの日本語化 ---
      buttonText={{
        today: "今日",
        month: "月",
        week: "週",
        day: "日",
      }}
      customButtons={{
        addScheduleButton: {
          text: "＋新規作成",
          click: buttonEvent, // 予定作成フォームを表示
        },
      }}
      height="auto"
      contentHeight="auto"
      windowResize={(arg) => {
        const calendarApi = arg.view.calendar;
        if (window.innerWidth < 768 && calendarApi.view.type !== "dayGridDay") {
          calendarApi.changeView("dayGridDay");
        }
        if (
          window.innerWidth >= 768 &&
          calendarApi.view.type === "dayGridDay"
        ) {
          calendarApi.changeView("dayGridMonth");
        }
      }}
      // --- カレンダー上部タイトル ---
      titleFormat={
        window.innerWidth < 768
          ? { month: "numeric", day: "numeric" } // 例: 9/6
          : { year: "numeric", month: "long" } // 例: 2025年9月
      }
      // --- 曜日ラベル ---
      dayHeaderFormat={{ weekday: "short" }}
      // --- イベント時刻表記 ---
      eventTimeFormat={{
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }}
      // --- ビューごとの設定 ---
      views={{
        dayGridMonth: {
          titleFormat: { year: "numeric", month: "long" },
        },
        timeGridWeek: {
          titleFormat: {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
          slotLabelFormat: {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          },
        },
        timeGridDay: {
          titleFormat: {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          },
          slotLabelFormat: {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          },
        },
      }}
      // --- イベントの見た目 ---
      eventContent={(arg) => {
        const color = arg.event.extendedProps.categoryColor || "gray";
        return (
          <Link
            to={`/schedules/${arg.event.extendedProps.scheduleId}`}
            state={{ dateId: arg.event.extendedProps.dateId }}
            className="fc-event-link"
            style={{ "--hover-color": color }}
          >
            <span className="fc-event-title">{arg.event.title}</span>
          </Link>
        );
      }}
    />
  );
}
