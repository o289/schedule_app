// user.js
import { apiFetch } from "./client";

export async function current_user(accessToken) {
  return apiFetch("/auth/me", { method: "GET" }, { accessToken });
}
