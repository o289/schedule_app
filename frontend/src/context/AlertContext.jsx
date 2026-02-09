// src/context/AlertContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import { ALERT_MESSAGES } from "../constants/alertMessages";
import AlertToast from "../components/alert/AlertToast";

// Context 作成
const AlertContext = createContext(null);

// Provider
export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    open: false,
    code: null,
  });

  /**
   * alert を表示する
   * @param {string} code - backend から返ってきた code
   */
  const showAlert = useCallback((code) => {
    if (!code) return;

    // 定義されていない code は SERVER_ERROR 扱い
    const resolvedCode = ALERT_MESSAGES[code] ? code : "SERVER_ERROR";

    setAlertState({
      open: true,
      code: resolvedCode,
    });
  }, []);

  /**
   * alert を閉じる
   */
  const hideAlert = useCallback(() => {
    setAlertState({
      open: false,
      code: null,
    });
  }, []);

  return (
    <AlertContext.Provider
      value={{
        alertState,
        showAlert,
        hideAlert,
      }}
    >
      {children}
      <AlertToast />
    </AlertContext.Provider>
  );
};

// hook
export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("useAlert must be used within AlertProvider");
  }
  return ctx;
};
