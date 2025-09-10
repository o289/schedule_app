// frontend/src/components/ErrorModal.jsx
import "./ErrorModal.css";

export default function ErrorModal({ error, onClose, onLogout }) {
  if (!error) return null; // エラーがなければ表示しない

  return (
    <div className="error-modal-overlay">
      <div className="error-modal">
        <h2>エラーが発生しました</h2>
        <p className="error-message">{error.message}</p>

        {error.details?.action_plan && (
          <p className="error-details">{error.details.action_plan}</p>
        )}

        <div className="error-actions">
          {error.details?.showLogout ? (
            <button onClick={onLogout} className="btn-logout">
              ログアウト
            </button>
          ) : (
            <button onClick={onClose} className="btn-close">
              閉じる
            </button>
          )}
        </div>
      </div>
    </div>
  );
}