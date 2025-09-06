const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(url, options = {}, auth=null) {
  let accessToken = null;
  let refreshToken = null;
  let handleRefresh = null;


  if (auth) {
    // authContext が渡された場合のみ分解
    ({ accessToken, refreshToken, handleRefresh } = auth);
  }

  const headers = {
    ...options.headers,
    ...(accessToken && { "Authorization": `Bearer ${accessToken}` }),
    "Content-Type": "application/json",
  };

  let res = await fetch(`${API_URL}${url}`, { ...options, headers });

  switch (res.status){
    case 401:
      if (refreshToken && handleRefresh){
        const refreshed = await handleRefresh();
        if (refreshed) {
          // Context から最新の accessToken を取得し直す
          // const newAccessToken = auth.accessToken;
    
          // リフレッシュ成功 → 再試行
          const retryHeaders = {
            ...options.headers,
            "Authorization": `Bearer ${refreshed}`, // Context側で更新済みを参照
            "Content-Type": "application/json",
          };
          res = await fetch(`${API_URL}${url}`, { ...options, headers: retryHeaders });
        }
        break
    };

    case 204: 
    return 

    default:
    break

  };
  

  // 共通レスポンス処理
  if (!res.ok) {
    let errMessage = "処理に失敗しました";

    if (res.status >= 500) {
      throw new Error("サーバーエラーが発生しました");
    }

    try {
      const errData = await res.json();
      if (errData.detail) errMessage = errData.detail;
    } catch (_) {
      // JSONじゃないレスポンスは無視
    }

    throw new Error(errMessage);
  }

  return res.json();
}