import "./BaseForm.css";

import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

export default function BaseForm({
  onSubmit,
  children,
  disabled,
  onCancel,
  submitLabel = "送信",
}) {
  return (
    <form onSubmit={onSubmit} className="base-form">
      {children}
      <div className="form-actions">
        <Button
          type="submit"
          variant="contained"
          startIcon={<SendIcon />}
          disabled={disabled}
        >
          {submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="contained"
            startIcon={<CloseIcon />}
            className="btn-cancel"
            onClick={onCancel}
          >
            キャンセル
          </Button>
        )}
      </div>
    </form>
  );
}
