// frontend/src/pages/TopPage.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import "./TopPage.css";

export default function TopPage() {
    const { user } = useAuth();
    const is_login = !!user;

    return (
        <div className="top-page">
            <div className="hero">
                <h1 className="hero-title">スケジュール管理アプリ</h1>
                <p className="hero-subtitle">
                カテゴリごとに色分けして、予定とタスクを直感的に整理できます。
                </p>
                {is_login ? (
                    <div className="hero-actions">
                        <h2>{user.name}さんようこそ</h2>
                        <Link to="/schedules" className="btn-top btn-primary">
                            スケジュールを見る
                        </Link>
                        <Link to="/categories" className="btn-top btn-secondary">
                            カテゴリ管理
                        </Link>
                    </div>
                ):(
                    <div className="hero-actions">
                        <h2>ユーザー登録・ログインをお願いします。</h2>
                        <Link to="/signup" className="btn-top btn-primary">
                            サインアップ
                        </Link>
                        <Link to="/login" className="btn-top btn-secondary">
                            ログイン
                        </Link>
                    </div>
                )}
                
                 
            </div>

            <div className="features">
                <div className="feature-card">
                <h3>📅 カレンダー管理</h3>
                <p>予定をカレンダー形式で確認。日付クリックで詳細も表示できます。</p>
                </div>
                <div className="feature-card">
                <h3>📝 Todoリスト</h3>
                <p>スケジュールごとにタスクを追加。優先度や期限で管理可能です。</p>
                </div>
                <div className="feature-card">
                <h3>🎨 カテゴリカラー</h3>
                <p>色分けでひと目で把握。自分好みにカスタマイズ可能です。</p>
                </div>
            </div>
        </div>
    );
}