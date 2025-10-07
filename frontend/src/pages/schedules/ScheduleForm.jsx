import { useState, useEffect } from "react";
import { handleDateTime } from "./useDateTime";
import ScheduleDatesModal from "./DatesModal";

import BaseForm from "../../components/forms/BaseForm";
import FormField from "../../components/forms/FormField";

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
    tempStart,
    setTempStart,
    tempEnd,
    setTempEnd,
    handleDateChange,
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
    <BaseForm onSubmit={onSubmit} onCancel={onCancel} submitLabel={submitLabel}>
      <FormField label="タイトル">
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={onChange}
          required
        />
      </FormField>
      <FormField label="日程">
        <>
          <input
            type="datetime-local"
            name="temp_start_date"
            value={tempStart}
            onChange={(e) => setTempStart(e.target.value)}
            style={{ marginRight: "8px" }}
          />
          <input
            type="datetime-local"
            name="temp_end_date"
            value={tempEnd}
            onChange={(e) => setTempEnd(e.target.value)}
            style={{ marginRight: "8px" }}
          />
          <button type="button" onClick={addDate} disabled={datesDisable}>
            ＋日程追加
          </button>
        </>
      </FormField>

      <button type="button" onClick={() => setShowDatesModal(true)}>
        登録済み日程を見る
      </button>

      {showDatesModal && (
        <ScheduleDatesModal
          dates={dates}
          removeDate={removeDate}
          onClose={() => setShowDatesModal(false)}
        />
      )}

      <FormField label="メモ">
        <textarea name="note" value={formData.note || ""} onChange={onChange} />
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
    </BaseForm>
  );
}
