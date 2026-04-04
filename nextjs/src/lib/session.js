const TOKEN_KEY = "token";
const USER_KEY = "loggedInUser";

function safeParse(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function readStoredToken() {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(TOKEN_KEY);
  return token && token !== "null" && token !== "undefined" ? token : null;
}

export function readStoredUser() {
  if (typeof window === "undefined") return null;
  const user = safeParse(window.localStorage.getItem(USER_KEY));
  return user && typeof user === "object" ? user : null;
}

export function writeSession({ token, user }) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}
