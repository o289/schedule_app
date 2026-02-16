import { createContext, useState, useContext, useEffect } from "react";
import { apiFetch } from "../api/client";
import { useAlert } from "./AlertContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { showAlert } = useAlert();

  const authFetch = (url, options = {}, fetchOptions = {}) => {
    return apiFetch(url, options, {
      accessToken,
      refreshToken,
      showAlert,
      clearSession,
      ...fetchOptions,
    });
  };

  // セッションをクリアにする
  const clearSession = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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
  const handleRefresh = async (tokenOverride = null) => {
    const token = tokenOverride || refreshToken;
    if (!token) return false;

    const res = await apiFetch(
      "/auth/refresh",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: token }),
      },
      { showAlert }
    );

    if (res?.data?.access_token) {
      setAccessToken(res.data.access_token);
      localStorage.setItem("accessToken", res.data.access_token);
      return res.data.access_token;
    }

    return false;
  };

  // 初期化: localStorageから復元
  useEffect(() => {
    const savedAccess = localStorage.getItem("accessToken");
    const savedRefresh = localStorage.getItem("refreshToken");

    const initAuth = async () => {
      if (savedAccess && savedRefresh) {
        setAccessToken(savedAccess);
        setRefreshToken(savedRefresh);

        // ここで必ずリフレッシュ
        const newToken = await handleRefresh(savedRefresh);
        if (newToken) {
          const me = await apiFetch(
            "/auth/me",
            { method: "GET" },
            { accessToken: newToken, showAlert }
          );
          setUser(me);
        }
      }
      setIsLoading(false); // ← リフレッシュが終わってから
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isLoading,
        handleLogout,
        handleRefresh,
        setAccessToken,
        setRefreshToken,
        setUser,
        clearSession,
        authFetch,
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
