import { useState, useEffect } from "react";
import {
  formatLocalDateTime,
  getNowDateTime,
  getNowPlusOneHour,
} from "../../utils/date";

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
  const [tempStart, setTempStart] = useState(getNowDateTime());
  const [tempEnd, setTempEnd] = useState(getNowPlusOneHour());

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

  // スタートの日付・時刻がエンドより後である場合にエンドをスタートの1時間後に固定する
  // スタートがエンドより後にも関わらず入力されてしまうのをを防止
  useEffect(() => {
    if (tempStart > tempEnd) {
      const start = new Date(tempStart);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      setTempEnd(formatLocalDateTime(end));
    }
  }, [tempStart, tempEnd]);

  const addDate = () => {
    if (!tempStart || !tempEnd) return;
    const newDate = { start_date: tempStart, end_date: tempEnd };

    if (tempStart >= tempEnd) return;
    // 予定の時刻の重複を禁止しているので、同じ日にちに同じ時刻スタートの予定を追加できないようにするため
    if (dates.some((date) => date.start_date === newDate.start_date)) return;

    const newDates = [...dates, newDate];
    setDates(newDates);
    onChange({ target: { name: "dates", value: newDates } });

    // 初期値に開始時刻を現在時刻、終了時刻に現在時刻＋1時間を設定
    // こうすることで、日付のフォームの入力後に時刻が空白になることを防ぐ。
    setTempStart(tempStart);
    setTempEnd(tempEnd);
  };

  useEffect(() => {
    const invalid =
      !tempStart ||
      !tempEnd ||
      tempStart >= tempEnd ||
      dates.some((date) => date.start_date === tempStart);

    setDatesDisable(invalid);
  }, [tempStart, tempEnd, dates]);

  const removeDate = (index) => {
    const newDates = dates.filter((_, i) => i !== index);
    setDates(newDates);
    onChange({ target: { name: "dates", value: newDates } });
  };

  return {
    dates,
    setDates,
    tempStart,
    setTempStart,
    tempEnd,
    setTempEnd,
    handleDateChange,
    addDate,
    removeDate,
    datesDisable,
  };
}
