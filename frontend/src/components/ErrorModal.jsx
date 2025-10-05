// frontend/src/components/ErrorModal.jsx
import "./ErrorModal.css";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function ErrorModal({ error, onClose }) {
  if (!error) return null; // エラーがなければ表示しない

  // デフォルトに関する処理
  // 通常はエラーモーダルをとじる
  // もし特殊処理がある場合は引数で受け取らせる
  const [close, setClose] = useState(false);
  const defaultClose = () => {
    setClose(false);
  };
  const handleClose = () => {
    defaultClose();
    if (onClose) onClose();
  };

  const { handleLogout } = useAuth();
  const onLogout = () => {
    handleLogout();
    navigate("/");
  };

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
            <button onClick={handleClose} className="btn-close">
              閉じる
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
