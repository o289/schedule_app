import { useState, useEffect } from "react";
import "./DatesModal.css";

export default function ScheduleDatesModal({ dates, removeDate, onClose }) {
  // 以下のコードとeffectはdates配列の中身が1になった時に削除を押せないようにする目的
  // 現在、scheduleのdates配列がから配列でも登録されてしまう問題が起きているのでそれを防ぐ目的で定義
  const [minimumDates, setMinimumDates] = useState(false);
  useEffect(() => {
    if (dates.length === 1) {
      setMinimumDates(true);
    } else {
      setMinimumDates(false);
    }
  }, [dates.length]);

  return (
    <div className="dates-modal">
      <div className="dates-modal-contents">
        <h3>登録済み日程</h3>
        {dates.length === 0 && <p>日程はありません。</p>}
        {dates.map((date, index) => (
          <div key={index} className="dates-modal-card">
            <div style={{ display: "block", marginBottom: "4px" }}>
              開始: {date.start_date || "-"}
            </div>
            <div style={{ display: "block" }}>終了: {date.end_date || "-"}</div>
            <button
              type="button"
              onClick={() => removeDate(index)}
              disabled={minimumDates}
              className="dates-modal-delete"
            >
              削除
            </button>
          </div>
        ))}

        {/* 位置の固定   */}
        <button type="button" onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
}
