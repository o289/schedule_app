import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 非ログイン状態なら /login にリダイレクト
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // ログイン済みならコンテンツを表示
  return user ? children : null;
}
