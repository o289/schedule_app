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

// scheduleのdatesに追加するための関数
export function handleDateTime(formData, onChange) {
  const [dates, setDates] = useState(
    formData.dates && formData.dates.length > 0
      ? formData.dates
      : [{ start_date: "", end_date: "" }]
  );
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [datesDisable, setDatesDisable] = useState(false);

  const handleDateChange = (index, field, value) => {
    const newDates = dates.map((date, i) => {
      if (i === index) {
        return { ...date, [field]: value };
      }
      return date;
    });
    setDates(newDates);
    onChange({ target: { name: "dates", value: newDates } });
  };

  const addDate = () => {
    if (!start || !end) return;
    const newDate = { start_date: start, end_date: end };

    if (start >= end) return;
    // 予定の時刻の重複を禁止しているので、同じ日にちに同じ時刻スタートの予定を追加できないようにするため
    if (dates.some((date) => date.start_date === newDate.start_date)) return;

    const newDates = [...dates, newDate];
    setDates(newDates);
    onChange({ target: { name: "dates", value: newDates } });

    // 初期値に開始時刻を現在時刻、終了時刻に現在時刻＋1時間を設定
    // こうすることで、日付のフォームの入力後に時刻が空白になることを防ぐ。
    setStart("");
    setEnd("");
  };

  useEffect(() => {
    const invalid =
      !start ||
      !end ||
      start >= end ||
      dates.some((date) => date.start_date === start);

    setDatesDisable(invalid);
  }, [start, end, dates]);

  const removeDate = (index) => {
    const newDates = dates.filter((_, i) => i !== index);
    setDates(newDates);
    onChange({ target: { name: "dates", value: newDates } });
  };

  return {
    dates,
    setDates,
    start,
    setStart,
    end,
    setEnd,
    handleDateChange,
    addDate,
    removeDate,
    datesDisable,
  };
}
