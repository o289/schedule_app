import "./ScheduleForm.css"
import { useState, useEffect } from "react";
import { handleDateTime } from "./useDateTime";

import ScheduleDatesModal from "./DatasModal";

export default function ScheduleForm(
  {
    formData,
    onChange,
    onSubmit,
    submitLabel,
    onCancel,
    categories = []
  }
) {
  
  const [showDatesModal, setShowDatesModal] = useState(false);
  const [disabled, setDisabled] = useState(true)
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
    datesDisable
  } = handleDateTime(formData, onChange)

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
    <form onSubmit={onSubmit} className="schedule-form" >
      <div className="form-group">
        <label>タイトル</label>
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label>日程を選択</label>
        <div className="date-group" style={{ marginBottom: "8px" }}>
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
          <button type="button" onClick={addDate} disabled={datesDisable}>＋ 日程追加</button>
        </div>
        <button type="button" onClick={() => setShowDatesModal(true)}>登録済み日程を見る</button>
      </div>

      {showDatesModal && (
        <ScheduleDatesModal
          dates={dates}
          removeDate={removeDate}
          onClose={() => setShowDatesModal(false)}
        />
      )}

      <div className="form-group">
        <label>メモ</label>
        <textarea
          name="note"
          value={formData.note || ""}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label>カテゴリ</label>
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
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit" disabled={disabled}>{submitLabel}</button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-cancel"
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}