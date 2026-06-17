import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { formatDateTime, toISODate, toISODatetime } from "../../utils/date";

import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import TimePicker from "../../components/commonPicker/TimePicker";

export default function ScheduleDatesModal({ dates, onClose, onChange }) {
  // モーダル内部でのみ使用する編集用 state
  const [internalDates, setInternalDates] = useState([]);

  // モーダルの見た目制御のため(MUI製)
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // dates を初期値として internalDates を生成
  useEffect(() => {
    setInternalDates(
      dates.map((d) => ({
        date: toISODate(d.start_date), // API用 ISO date (YYYY-MM-DD)
        start: formatDateTime(d.start_date, "time"), // 表示・編集用 HH:mm
        end: formatDateTime(d.end_date, "time"), // 表示・編集用 HH:mm
        _local_id: crypto.randomUUID(),
      })),
    );
  }, [dates]);

  const handleTimeChange = (localId, field, value) => {
    setInternalDates((prev) =>
      prev.map((date) =>
        date._local_id === localId
          ? {
              ...date,
              [field]: value,
            }
          : date,
      ),
    );
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>登録済み日程</DialogTitle>

      <DialogContent dividers>
        {internalDates.length === 0 && <p>日程はありません。</p>}

        {internalDates.map((date) => (
          <div
            key={date._local_id}
            className="relative mb-3 rounded-lg border border-[#ddd] bg-[#fafbfc] p-3"
          >
            <div style={{ display: "block", marginBottom: "4px" }}>
              日程: {formatDateTime(date.date, "date")}
            </div>

            <div className="m-3">
              <TimePicker
                label="開始"
                mode="start"
                value={date.start}
                constraintValue={date.end}
                onChange={(value) =>
                  handleTimeChange(date._local_id, "start", value)
                }
              />
            </div>

            <div className="m-3">
              <TimePicker
                label="終了"
                mode="end"
                value={date.end}
                constraintValue={date.start}
                onChange={(value) =>
                  handleTimeChange(date._local_id, "end", value)
                }
              />
            </div>
          </div>
        ))}
      </DialogContent>

      <DialogActions>
        <Button
          type="button"
          variant="contained"
          startIcon={<CloseIcon />}
          onClick={() => {
            if (onChange) {
              const merged = internalDates.map(
                ({ _local_id, date, start, end }) => ({
                  start_date: toISODatetime(date, start),
                  end_date: toISODatetime(date, end),
                }),
              );
              onChange(merged);
            }
            onClose();
          }}
        >
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
}
