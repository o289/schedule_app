import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import useIsMobile from "../hooks/useIsMobile.js";
import "./Navbar.css"

export default function Navbar() {
  const { user } = useAuth();
  const is_login = !!user;
  const location = useLocation();
  const isMobile = useIsMobile();

  // パスごとのタイトルマッピング
  const pathTitles = {
    "/": "ページトップ",
    "/categories": "カテゴリー",
    "/schedules": "スケジュール",
    "/me": "マイページ",
    "/login": "ログイン",
    "/signup": "サインアップ",
  };

  // 現在のパスに応じたタイトル
  const pageTitle = pathTitles[location.pathname] || "";


  return (
    <nav className="navbar">
      {/* 左側 */}
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <img src="/app_icon.png" alt="App Icon" className="app-icon" />
        </Link>
      </div>


       {/* 中央（ページタイトル） */}
      <div className="navbar-center">
        {!isMobile ? (
            <h1>{pageTitle}</h1>
        ) : (
            <h2>{pageTitle}</h2>
        )}
        

      </div>

      {/* 右側 */}
      <div className="navbar-right">
        {is_login ? (
          <>
            <Link to="/me" className="navbar-user">
              <img src="/user_icon.png" alt="My page" className="app-icon" />
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