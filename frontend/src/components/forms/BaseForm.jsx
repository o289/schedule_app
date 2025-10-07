import "./BaseForm.css";

export default function BaseForm({
  onSubmit,
  children,
  disabled,
  submitLabel = "送信",
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit} className="base-form">
      {children}
      <div className="form-actions">
        <button type="submit" className="btn-submit" disabled={disabled}>
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn-cancel" onClick={onCancel}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}
