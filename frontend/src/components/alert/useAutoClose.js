// src/components/alert/useAutoClose.js
import { useEffect } from "react";

/**
 * Toast 自動クローズ用 hook
 * @param {boolean} open
 * @param {Function} onClose
 * @param {number} duration
 */
export const useAutoClose = (open, onClose, duration = 5000) => {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [open, onClose, duration]);
};
