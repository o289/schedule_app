import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import "../pages/schedules/ScheduleForm.css"

export default function LoginPage() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null); // 送信前にエラーをクリア

    try {
      await handleLogin(email, password);
      navigate("/me"); // 成功したらプロフィールページへ
    } catch (err) {
      setError(err.message || "ログインに失敗しました");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>ログイン</h2>
      <form onSubmit={onSubmit} className="schedule-form">
        <div>
          <label>メール</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">ログイン</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}