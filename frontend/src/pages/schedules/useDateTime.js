import { useState, useEffect } from "react";

export function useDateTime(schedules) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!schedules) {
      setEvents([]);
      return;
    }

    // 各 schedule の中の dates を展開して FullCalendar 用イベントに変換
    const allEvents = schedules.flatMap((s) =>
      (s.dates || []).map((d) => ({
        id: d.id,
        scheduleId: s.id,
        title: s.title,
        start: d.start_date,
        end: d.end_date,
        categoryColor: s.category?.color || "gray",
      }))
    );

    setEvents(allEvents);
  }, [schedules]);

  return {
    selectedDate,
    setSelectedDate,
    events,
  };
}

// scheduleのdatesを「追加・削除」するためのUI専用ロジック
// Single Source of Truth は formData.dates
export function handleDateTime(formData, onChange) {
  const [dates, setDates] = useState(
    Array.isArray(formData.dates) ? formData.dates : []
  );
  // formData.dates を唯一の真実として同期する
  useEffect(() => {
    if (Array.isArray(formData.dates)) {
      setDates(formData.dates);
    } else {
      setDates([]);
    }
  }, [formData.dates]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [datesDisable, setDatesDisable] = useState(false);

  const addDate = (selectedDates) => {
    if (
      !Array.isArray(selectedDates) ||
      !selectedDates ||
      selectedDates.length === 0 ||
      !start ||
      !end
    )
      return;

    const newDateObjects = selectedDates.map((dateObj) => {
      const dateStr =
        typeof dateObj === "object" && dateObj.start_date
          ? dateObj.start_date.split("T")[0]
          : dateObj;

      const startDateTime = `${dateStr}T${start}`;
      const endDateTime = `${dateStr}T${end}`;
      return { start_date: startDateTime, end_date: endDateTime };
    });

    // 既存datesと重複を除外して結合
    const normalize = (str) => str.slice(0, 16); // "YYYY-MM-DDTHH:mm" まで
    const uniqueDates = newDateObjects.filter(
      (d) =>
        !dates.some(
          (existing) =>
            normalize(existing.start_date) === normalize(d.start_date) &&
            normalize(existing.end_date) === normalize(d.end_date)
        )
    );

    if (uniqueDates.length === 0) return;

    const newDates = [...dates, ...uniqueDates];
    setDates(newDates);

    // onChange で親フォームに反映
    onChange({ target: { name: "dates", value: newDates } });

    // 入力をリセット
    setSelectedDates([]);
    setStart("");
    setEnd("");
  };

  const removeDate = (index) => {
    const newDates = dates.filter((_, i) => i !== index);
    setDates(newDates);
    onChange({ target: { name: "dates", value: newDates } });
  };

  return {
    dates,
    setDates,
    selectedDates,
    setSelectedDates,
    start,
    setStart,
    end,
    setEnd,
    addDate,
    removeDate,
    datesDisable,
  };
}
