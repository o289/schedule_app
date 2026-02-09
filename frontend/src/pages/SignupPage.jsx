import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import BaseForm from "../components/forms/BaseForm.jsx";
import FormField from "../components/forms/FormField.jsx";

export default function SignupPage() {
  const { handleSignup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true);
  // 入力チェック
  // emailとpasswordの入力が入っていなければ、ボタンを押せないようにする
  const checkValid = name && email && password;
  if (disabled !== !checkValid) setDisabled(!checkValid);

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleSignup(email, password, name);
    navigate("/me"); // プロフィールページへリダイレクト
  };

  return (
    <div style={{ padding: "1rem" }}>
      <BaseForm
        onSubmit={onSubmit}
        onCancel={() => navigate("/")}
        submitLabel="サインアップ"
        disabled={!checkValid}
      >
        <FormField label="名前">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormField>
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
