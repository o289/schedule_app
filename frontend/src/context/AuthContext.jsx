import { createContext, useState, useContext, useEffect } from "react";
import { apiFetch } from "../api/client";
import { useAlert } from "./AlertContext";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const navigate = useNavigate();

  const { showAlert } = useAlert();

  // セッションをクリアにする
  const clearSession = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login");
  };

  // サインアップ
  const handleSignup = async (email, password, name) => {
    await apiFetch(
      "/auth/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      },
      { showAlert }
    );
    await handleLogin(email, password);
    navigate("/me");
  };

  // ログイン
  const handleLogin = async (email, password) => {
    const res = await apiFetch(
      "/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
      { showAlert }
    );
    if (res?.access_token) {
      setAccessToken(res.access_token);
      setRefreshToken(res.refresh_token);
      localStorage.setItem("accessToken", res.access_token);
      localStorage.setItem("refreshToken", res.refresh_token);
      const me = await apiFetch(
        "/auth/me",
        { method: "GET" },
        { accessToken: res.access_token, showAlert }
      );
      setUser(me);
      localStorage.setItem("user", JSON.stringify(me));
      navigate("/schedules");
      return true;
    }
    return false;
  };

  // ログアウト
  const handleLogout = async () => {
    if (refreshToken) {
      await apiFetch(
        "/auth/logout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        },
        { showAlert }
      );
    }
    clearSession();
  };

  // リフレッシュ
  const handleRefresh = async () => {
    if (!refreshToken) return false;
    const res = await apiFetch(
      "/auth/refresh",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      },
      { showAlert }
    );
    if (res?.access_token) {
      setAccessToken(res.access_token);
      localStorage.setItem("accessToken", res.access_token);
      return res.access_token;
    }
    return false;
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
          const me = await apiFetch(
            "/auth/me",
            { method: "GET" },
            { accessToken: newToken, showAlert }
          );
          setUser(me);
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
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 呼び出し
export function useAuth() {
  return useContext(AuthContext);
}
