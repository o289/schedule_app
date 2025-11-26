import { useState, useEffect } from "react";
import { handleDateTime } from "./useDateTime";
import ScheduleDatesModal from "./DatesModal";

import BaseForm from "../../components/forms/BaseForm";
import FormField from "../../components/forms/FormField";

import { Button } from "@mui/material";
import DaySelectDisplay from "../../components/MultiDateCalendar";

export default function ScheduleForm({
  formData,
  onChange,
  onSubmit,
  submitLabel,
  onCancel,
  categories = [],
}) {
  const [showDatesModal, setShowDatesModal] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const {
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
  } = handleDateTime(formData, onChange);

  useEffect(() => {
    if (
      formData.title &&
      formData.title.trim() !== "" &&
      dates.length > 0 &&
      formData.category_id
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [formData.title, dates, formData.category_id]);

  return (
    <BaseForm
      onSubmit={onSubmit}
      disabled={disabled}
      onCancel={onCancel}
      submitLabel={submitLabel}
    >
      <FormField label="タイトル">
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={onChange}
          required
        />
      </FormField>

      <FormField label="カテゴリー">
        <select
          name="category_id"
          value={formData.category_id || ""}
          onChange={onChange}
          required
        >
          <option value="">選択してください</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="メモ">
        <textarea name="note" value={formData.note || ""} onChange={onChange} />
      </FormField>

      <FormField label="日程">
        <DaySelectDisplay
          addDate={() => addDate(selectedDates)}
          datesDisable={datesDisable}
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          start={start}
          setStart={setStart}
          end={end}
          setEnd={setEnd}
        />
      </FormField>

      <Button
        type="button"
        variant="contained"
        onClick={() => setShowDatesModal(true)}
      >
        登録済み日程を見る
      </Button>

      {showDatesModal && (
        <ScheduleDatesModal
          dates={dates}
          removeDate={removeDate}
          onClose={() => setShowDatesModal(false)}
        />
      )}
    </BaseForm>
  );
}
