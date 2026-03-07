import { useState } from "react";

const initialSchedule = {
    title: "",
    note: "",
    dates: [],
    category_id: ""
};

export function useScheduleForm() {
  const [draftSchedule, setDraftSchedule] = useState(initialSchedule);

  const handleChange = (e) => {
    setDraftSchedule({
      ...draftSchedule,
      [e.target.name]: e.target.value,
    });
  };

  const resetDraft = () => {
    setDraftSchedule(initialSchedule);
  };

  const loadSchedule = (schedule) => {
    setDraftSchedule({
      title: schedule.title,
      note: schedule.note || "",
      dates: schedule.dates || [],
      category_id: schedule.category_id,
    });
  };

  return {
    draftSchedule,
    setDraftSchedule,
    handleChange,
    resetDraft,
    loadSchedule,
  };
}