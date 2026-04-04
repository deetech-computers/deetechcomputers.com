import { API_BASE_AUTH, API_BASE_USERS } from "./config";
import { requestJson } from "./http";

export async function loginUser(payload) {
  return requestJson(`${API_BASE_AUTH}/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerUser(payload) {
  return requestJson(`${API_BASE_AUTH}/register`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchProfile(token) {
  return requestJson(`${API_BASE_USERS}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateProfile(token, payload) {
  return requestJson(`${API_BASE_USERS}/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}
