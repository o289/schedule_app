import "./BaseForm.css";

// 共通で使用するフィールド
// signup, login, schedule(add edit), todo(add)のフォームで使用する。
export default function FormField({ label, children }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {children}
    </div>
  );
}
