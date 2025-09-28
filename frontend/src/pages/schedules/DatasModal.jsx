// src/components/ScheduleDatesModal.jsx
export default function ScheduleDatesModal({ dates, removeDate, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "16px",
          zIndex: 1001,
          maxHeight: "300px",
          overflowY: "auto",
          width: "300px",
        }}
      >
        <h3>登録済み日程</h3>
        {dates.length === 0 && <p>日程はありません。</p>}
        {dates.map((date, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
              position: "relative",
              background: "#fafbfc",
            }}
          >
            <div style={{ display: "block", marginBottom: "4px" }}>
              開始: {date.start_date || "-"}
            </div>
            <div style={{ display: "block" }}>終了: {date.end_date || "-"}</div>
            <button
              type="button"
              onClick={() => removeDate(index)}
              style={{
                background: "#fc5959ff",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              削除
            </button>
          </div>
        ))}
        <button type="button" onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
}
