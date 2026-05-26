const TOKEN_KEY = "token";
const USER_KEY = "loggedInUser";
export const SESSION_UPDATED_EVENT = "deetech:session-updated";

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

export function readSessionSnapshot() {
  return {
    token: readStoredToken(),
    user: readStoredUser(),
  };
}

export function readServerSessionSnapshot() {
  return {
    token: null,
    user: null,
  };
}

export function subscribeToSession(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const notify = () => callback();
  const onStorage = (event) => {
    if (!event.key || event.key === TOKEN_KEY || event.key === USER_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(SESSION_UPDATED_EVENT, notify);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(SESSION_UPDATED_EVENT, notify);
  };
}

export function writeSession({ token, user }) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(SESSION_UPDATED_EVENT));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(SESSION_UPDATED_EVENT));
}
