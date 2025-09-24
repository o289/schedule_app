import "./ScheduleForm.css"
import { useState, useEffect } from "react";
import { handleDateTime } from "./useDateTime";

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
    removeDate 
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
          <button type="button" onClick={addDate}>＋ 日程追加</button>
        </div>
        <button type="button" onClick={() => setShowDatesModal(true)}>登録済み日程を見る</button>
      </div>

      {showDatesModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1000,
        }}>
          <div style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "16px",
            zIndex: 1001,
            maxHeight: "300px",
            overflowY: "auto",
            width: "300px"
          }}>
            <h3>登録済み日程</h3>
            {dates.length === 0 && <p>日程はありません。</p>}
            {dates.map((date, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "12px",
                  position: "relative",
                  background: "#fafbfc"
                }}
              >
                <div style={{ display: "block", marginBottom: "4px" }}>
                  開始: {date.start_date || "-"}
                </div>
                <div style={{ display: "block" }}>
                  終了: {date.end_date || "-"}
                </div>
                <button
                  type="button"
                  onClick={() => removeDate(index)}
                  style={{
                    background: "#f6c1c1",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                >
                  削除
                </button>
                
              </div>
            ))}
            <button type="button" onClick={() => setShowDatesModal(false)}>閉じる</button>
          </div>
        </div>
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