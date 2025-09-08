import { apiFetch } from "./client";

const auth_url = "/auth";

// サインアップ
export async function signup(data) {
  return apiFetch(`${auth_url}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }); 
}

// ログイン
export async function login(data) {
  return apiFetch(`${auth_url}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ログアウト
export async function logout(refreshToken) {
  return apiFetch(`${auth_url}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

// リフレッシュ
export async function refresh(refreshToken) {
  return apiFetch(`${auth_url}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
} 