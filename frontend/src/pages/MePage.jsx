import { useAuth } from "../context/AuthContext.jsx";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./ProfileCard.css"

export default function MePage() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout= () =>{
    handleLogout();
    navigate("/");
  }

  useEffect(() => {
    if (!user) {
      // 未ログインならログインページへ
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    // リダイレクト直前の瞬間に空画面を返す
    return null;
  }

  return (
    <div className="profile-card">
      <div className="profile-header">
        <h2 className="profile-title">{user.name}</h2>
      </div>

      <div className="profile-body">
        <p><span className="label">Email:</span>{user.email}</p>
        <button onClick={onLogout} className="btn-link-me">
            ログアウト
        </button>
      </div>
    </div>
  );
}