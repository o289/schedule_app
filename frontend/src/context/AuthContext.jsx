import { createContext, useState, useContext, useEffect } from "react";
import { signup, login, logout, refresh } from "../api/auth";
import { current_user } from "../api/user";
import ErrorModal from "../components/ErrorModal";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [error, setError] = useState(null); // 共通エラー用 state
  const [initializing, setInitializing] = useState(true);

  const navigate = useNavigate();

  // サインアップ
  const handleSignup = async (email, password, name) => {
    try {
      await signup({ email, password, name });
      // サインアップ後に自動ログイン
      handleLogin(email, password);

      navigate("/me");
    } catch (err) {
      console.error("サインアップ失敗", err);
    }
  };

  // ログイン
  const handleLogin = async (email, password) => {
    const res = await login({ email, password });
    if (res.access_token) {
      setAccessToken(res.access_token);
      setRefreshToken(res.refresh_token);

      // 永続化
      localStorage.setItem("accessToken", res.access_token);
      localStorage.setItem("refreshToken", res.refresh_token);
      console.log("保存した refreshToken:", res.refresh_token);

      // Meエンドポイントでユーザー情報を取得
      const me = await current_user(res.access_token);
      setUser(me);
      localStorage.setItem("user", JSON.stringify(me));
      navigate("/schedules");
      return true;
    } else {
      throw new Error(res.detail || "ログインに失敗しました");
    }
  };

  // ログアウト
  const handleLogout = async () => {
    if (refreshToken) await logout(refreshToken);
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    // localStorage も削除
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login");
  };

  // リフレッシュ
  const handleRefresh = async () => {
    if (!refreshToken) return false;
    try {
      const res = await refresh(refreshToken);
      if (res.access_token) {
        setAccessToken(res.access_token);
        localStorage.setItem("accessToken", res.access_token); // ← 永続化も更新
        console.log("リフレッシュは成功している");
        return res.access_token; // 成功
      }
    } catch (err) {
      console.error("リフレッシュ失敗:", err);
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      return false; // 失敗
    }
  };

  // 初期化: localStorageから復元
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedAccess = localStorage.getItem("accessToken");
    const savedRefresh = localStorage.getItem("refreshToken");

    const initAuth = async () => {
      if (savedUser && savedAccess && savedRefresh) {
        setUser(JSON.parse(savedUser));
        setAccessToken(savedAccess);
        setRefreshToken(savedRefresh);

        // ここで必ずリフレッシュ
        const newToken = await handleRefresh();
        if (newToken) {
          try {
            const me = await current_user(newToken);
            setUser(me);
          } catch (err) {
            console.error("me取得失敗:", err);
            setUser(null);
          }
        }
      }
      setInitializing(false); // ← リフレッシュが終わってから
    };

    initAuth();
  }, []);

  if (initializing) {
    return;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        handleSignup,
        handleLogin,
        handleLogout,
        handleRefresh,
        setAccessToken,
        setUser,
        setError,
      }}
    >
      {children}
      <ErrorModal
        error={error}
        onClose={() => setError(null)}
        onLogout={handleLogout}
      />
    </AuthContext.Provider>
  );
}

// 呼び出し
export function useAuth() {
  return useContext(AuthContext);
}
