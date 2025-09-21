import "./ScheduleForm.css"

export default function ScheduleForm({
  formData,
  onChange,
  onSubmit,
  submitLabel,
  onCancel,
  categories = [],
  useDateTime = false, // ← 追加
}) {
  

  return (
    <form onSubmit={onSubmit} className="schedule-form">
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
    <label>開始</label>
    <input
      type={useDateTime ? "datetime-local" : "time"}
      step="60"
      name="start_time"
      value={formData.start_time || ""}
      onChange={onChange}
      required
    />
  </div>

  <div className="form-group">
    <label>終了</label>
    <input
      type={useDateTime ? "datetime-local" : "time"}
      step="60"
      name="end_time"
      value={formData.end_time || ""}
      onChange={onChange}
      required
    />
  </div>

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
    <button type="submit" className="btn-submit">{submitLabel}</button>
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