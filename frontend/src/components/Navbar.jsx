import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import useIsMobile from "../hooks/useIsMobile.js";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const { user } = useAuth();
  const is_login = !!user;
  const location = useLocation();
  const isMobile = useIsMobile();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
        {!isMobile ? <h1>{pageTitle}</h1> : <h2>{pageTitle}</h2>}
      </div>

      {/* 右側 */}
      <div className="navbar-right">
        <div
          className="navbar-user"
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img src="/user_icon.png" alt="My page" className="app-icon" />
          {dropdownOpen &&
            (is_login ? (
              <div className="dropdown-menu">
                <Link
                  to="/me"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  マイページ
                </Link>
                <Link
                  to="/categories"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  カテゴリー
                </Link>
                <Link
                  to="/schedules"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  スケジュール
                </Link>
              </div>
            ) : (
              <div className="dropdown-menu">
                <Link
                  to="/signup"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  サインアップ
                </Link>
                <Link
                  to="/login"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  ログイン
                </Link>
              </div>
            ))}
        </div>
      </div>
    </nav>
  );
}
