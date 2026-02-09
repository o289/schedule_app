import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import BaseForm from "../components/forms/BaseForm.jsx";
import FormField from "../components/forms/FormField.jsx";

export default function LoginPage() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true);

  // 入力チェック
  // emailとpasswordの入力が入っていなければ、ボタンを押せないようにする
  const checkValid = email && password;
  if (disabled !== !checkValid) setDisabled(!checkValid);

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(email, password);
    navigate("/schedules");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <BaseForm
        onSubmit={onSubmit}
        onCancel={() => navigate("/")}
        submitLabel="ログイン"
        disabled={!checkValid}
      >
        <FormField label="メール">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormField>
        <FormField label="パスワード">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormField>
      </BaseForm>
    </div>
  );
}
