import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import "./Navbar.css"

export default function Navbar() {
  const { user } = useAuth();
  const is_login = !!user;

  

  return (
    <nav className="navbar">
      {/* 左側 */}
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          スケジュール管理app
        </Link>
      </div>

      {/* 右側 */}
      <div className="navbar-right">
        {is_login ? (
          <>
            <Link to="/me" className="navbar-user">
              {user.name}
            </Link>
            <Link to="/categories" className="navbar-link">
              カテゴリ一覧
            </Link>
            <Link to="/schedules" className="navbar-link">
              スケジュール一覧
            </Link>
          </>
        ) : (
          <>
            <Link to="/signup" className="navbar-link">サインアップ</Link>
            <Link to="/login" className="navbar-link" style={{ marginLeft: "1rem" }}>
              ログイン
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}