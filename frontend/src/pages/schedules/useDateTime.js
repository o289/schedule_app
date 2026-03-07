import { useState, useEffect } from "react";

export function useDateTime(schedules) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!schedules) {
      setEvents([]);
      return;
    }

    const allEvents = schedules.flatMap((s) =>
      (s.dates || []).map((d) => ({
        id: d.id,
        title: s.title,
        start: d.start_date,
        end: d.end_date,
        allDay: false,

        color: s.category?.color || "#000000",
        borderColor: "transparent",
        textColor: "#ffffff",

        extendedProps: {
          // scheduleId: s.id, // ← ここへ移動
          schedule: s,
        },
      })),
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
    Array.isArray(formData.dates) ? formData.dates : [],
  );
  // formData.dates を唯一の真実として同期する
  useEffect(() => {
    if (Array.isArray(formData.dates)) {
      setDates(formData.dates);
    } else {
      setDates([]);
    }
  }, [formData.dates]);

  // --- 編集時：最も多い時間帯を代表値として start / end に反映 ---
  const extractTime = (dateTime) =>
    typeof dateTime === "string" ? dateTime.slice(11, 16) : "";

  const getMostCommonTimePair = (datesArray) => {
    const counter = {};

    datesArray.forEach((d) => {
      const startTime = extractTime(d.start_date);
      const endTime = extractTime(d.end_date);
      const key = `${startTime}-${endTime}`;
      counter[key] = (counter[key] || 0) + 1;
    });

    let maxCount = 0;
    let mostCommonKey = null;

    Object.entries(counter).forEach(([key, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonKey = key;
      }
    });

    if (!mostCommonKey) return { start: "", end: "" };

    const [mostStart, mostEnd] = mostCommonKey.split("-");
    return { start: mostStart, end: mostEnd };
  };

  useEffect(() => {
    if (Array.isArray(formData.dates) && formData.dates.length > 0) {
      const { start: mostStart, end: mostEnd } = getMostCommonTimePair(
        formData.dates,
      );
      setStart(mostStart);
      setEnd(mostEnd);
    }
  }, [formData.dates]);

  const [selectedDates, setSelectedDates] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [datesDisable, setDatesDisable] = useState(false);

  const addDate = (dateString) => {
    if (!start || !end) return;

    const startDateTime = `${dateString}T${start}`;
    const endDateTime = `${dateString}T${end}`;

    const normalize = (str) => str.slice(0, 16);

    const exists = dates.some(
      (existing) =>
        normalize(existing.start_date) === normalize(startDateTime) &&
        normalize(existing.end_date) === normalize(endDateTime),
    );

    if (exists) return;

    const newDates = [
      ...dates,
      { start_date: startDateTime, end_date: endDateTime },
    ];

    setDates(newDates);
    onChange({ target: { name: "dates", value: newDates } });
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
