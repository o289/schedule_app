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
  let data = await res.json().catch(() => ({}))
  
  if (!res.ok){
    // レスポンス内容
    const errorObj = {
      code: res.status,
      message: data?.error?.message || "不明なエラーが発生しました",
      details: data?.error?.details || {},
    };

    // ステータスコードによる分岐
    switch (res.status){
      case 400:
        message = message || "入力内容に誤りがあります。もう一度ご確認ください。"
        break;
      case 401:
        if (refreshToken && handleRefresh){
          const refreshed = await handleRefresh();
          if (refreshed) {
            // Context から最新の accessToken を取得し直す
            
            // リフレッシュ成功 → 再試行
            const retryHeaders = {
              ...options.headers,
              "Authorization": `Bearer ${refreshed}`, // Context側で更新済みを参照
              "Content-Type": "application/json",
            };

            retryRes = await fetch(`${API_URL}${url}`, { ...options, headers: retryHeaders });

            if (res.ok) {
              retryData = await retryRes.json().catch(() => ({}))
              return await retryData; // ← リトライ成功時は throw しない
            }
          } else {
            errorObj.message = "長時間操作がなかったためセッションが切れました";
            errorObj.details = { ...errorObj.details, showLogout: true, action_plan: "再度ログインしてください。" };
          }
        };
        break;
      
      case 403:
        errorObj.message = "この操作を行う権限がありません。";
        break;
      case 404:
        errorObj.message = "お探しのページやデータが見つかりませんでした。";
        break;
      case 500:
        errorObj.message = "サーバーでエラーが発生しました。しばらくしてからもう一度お試しください。"
        break;
      
      case 204:
        return

      default:
        errorObj.message = errorObj.message || "予期しないエラーが発生しました。時間を置いて再度お試しください。";
        break;
    };
    // UI表示
    // AuthProviderのエラーUIに渡す
    if (auth?.setError) {
      auth.setError(errorObj);
    }

    throw errorObj;
  };

  return data;
}