// src/components/alert/AlertToast.jsx
import "./AlertToast.css";
import { ALERT_MESSAGES } from "../../constants/alertMessages";
import { useAlert } from "../../context/AlertContext";
import { useAutoClose } from "./useAutoClose";

const AlertToast = () => {
  const { alertState, hideAlert } = useAlert();

  // 自動クローズ
  useAutoClose(alertState.open, hideAlert, 5000);

  // 表示していないなら何も描画しない
  if (!alertState.open || !alertState.code) return null;

  const alert = ALERT_MESSAGES[alertState.code];

  // safety net
  if (!alert) return null;

  const { type, message } = alert;

  return (
    <div className="toast-container">
      <div className={`toast ${type}`}>
        <div className="toast-message">{message}</div>
        <div className="toast-close" onClick={hideAlert}>
          ×
        </div>
      </div>
    </div>
  );
};

export default AlertToast;
