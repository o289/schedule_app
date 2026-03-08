import { createContext, useState, useContext, useEffect, useRef } from "react";
import { apiFetch } from "../api/client";
import { useAlert } from "./AlertContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { showAlert } = useAlert();

  const refreshPromiseRef = useRef(null);
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

    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    refreshPromiseRef.current = (async () => {
      try {
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
          const newToken = res.data.access_token;

          setAccessToken(newToken);
          localStorage.setItem("accessToken", newToken);

          return newToken;
        }

        return false;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  };

  // 初期化: localStorageから復元
  useEffect(() => {
    const savedAccess = localStorage.getItem("accessToken");
    const savedRefresh = localStorage.getItem("refreshToken");

    const initAuth = async () => {
      try {
        if (savedRefresh) {

          const newToken = await handleRefresh(savedRefresh);

          if (newToken) {
            setAccessToken(newToken);
            setRefreshToken(savedRefresh);

            const me = await apiFetch(
              "/auth/me",
              { method: "GET" },
              { accessToken: newToken, showAlert }
            );

            setUser(me);
          }
        }
      } catch (error) {
        clearSession();
      } finally {
        setIsLoading(false);
      }
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
