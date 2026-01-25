// frontend/src/shared/components/Loading.jsx
import React from "react";

const Loading = () => {
  return (
    <>
      <div style={styles.wrapper}>
        <div style={styles.spinner} />
        <div>読み込み中...</div>
      </div>

      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
};

const styles = {
  wrapper: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    zIndex: 1000,
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid rgba(0,0,0,0.15)",
    borderTopColor: "#007aff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

export default Loading;
