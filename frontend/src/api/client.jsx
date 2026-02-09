const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(url, options = {}, auth = null) {
  let accessToken = null;
  let refreshToken = null;
  let handleRefresh = null;
  let showAlert = null;
  let clearSession = null;

  if (auth) {
    // authContext が渡された場合のみ分解
    ({ accessToken, refreshToken, handleRefresh, showAlert, clearSession } =
      auth);
  }

  const headers = {
    ...options.headers,
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    "Content-Type": "application/json",
  };

  let res = await fetch(`${API_URL}${url}`, { ...options, headers });
  let data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // 401 特例: refresh → retry
    if (res.status === 401 && refreshToken && handleRefresh) {
      const refreshed = await handleRefresh();
      if (refreshed) {
        const retryHeaders = {
          ...options.headers,
          Authorization: `Bearer ${refreshed}`,
          "Content-Type": "application/json",
        };

        const retryRes = await fetch(`${API_URL}${url}`, {
          ...options,
          headers: retryHeaders,
        });

        if (retryRes.ok) {
          const retryData = await retryRes.json().catch(() => ({}));
          return retryData;
        }
      } else {
        const code = data?.code || "INVALID_REFRESH_TOKEN";
        clearSession?.();
        showAlert?.(code);
        throw { code };
      }
    }

    // 上記以外のエラーは code のみで扱う
    const code = data?.code || "SERVER_ERROR";
    showAlert?.(code);
    throw { code };
  }

  return data;
}
