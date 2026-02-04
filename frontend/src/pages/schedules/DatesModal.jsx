import { useState, useEffect } from "react";
import "./DatesModal.css";
import { formatDateTime, toISODate, toISODatetime } from "../../utils/date";

import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import TimePicker from "../../components/commonPicker/TimePicker";

export default function ScheduleDatesModal({ dates, onClose, onChange }) {
  // モーダル内部でのみ使用する編集用 state
  const [internalDates, setInternalDates] = useState([]);

  // dates を初期値として internalDates を生成
  useEffect(() => {
    setInternalDates(
      dates.map((d) => ({
        date: toISODate(d.start_date), // API用 ISO date (YYYY-MM-DD)
        start: formatDateTime(d.start_date, "time"), // 表示・編集用 HH:mm
        end: formatDateTime(d.end_date, "time"), // 表示・編集用 HH:mm
        _local_id: crypto.randomUUID(),
      }))
    );
  }, [dates]);

  // 日程が1件のみの時、削除を禁止
  const [minimumDates, setMinimumDates] = useState(false);
  useEffect(() => {
    if (internalDates.length === 1) {
      setMinimumDates(true);
    } else {
      setMinimumDates(false);
    }
  }, [internalDates.length]);

  const handleTimeChange = (localId, field, value) => {
    setInternalDates((prev) =>
      prev.map((date) =>
        date._local_id === localId
          ? {
              ...date,
              [field]: value,
            }
          : date
      )
    );
  };

  return (
    <div className="dates-modal">
      <div className="dates-modal-contents">
        <h3>登録済み日程</h3>

        {internalDates.length === 0 && <p>日程はありません。</p>}

        {internalDates.map((date) => (
          <div key={date._local_id} className="dates-modal-card">
            <div style={{ display: "block", marginBottom: "4px" }}>
              日程: {formatDateTime(date.date, "date")}
            </div>

            <div style={{ display: "block", marginBottom: "4px" }}>
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

            <div style={{ display: "block", marginBottom: "8px" }}>
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

            <Button
              type="button"
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={() => {
                setInternalDates((prev) =>
                  prev.filter((d) => d._local_id !== date._local_id)
                );
              }}
              disabled={minimumDates}
            >
              削除
            </Button>
          </div>
        ))}

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
                })
              );
              onChange(merged);
            }
            onClose();
          }}
        >
          閉じる
        </Button>
      </div>
    </div>
  );
}
