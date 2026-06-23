const TOKEN_KEY = "token";
const USER_KEY = "loggedInUser";
const ADMIN_HINT_COOKIE = "dt_admin_hint";
export const SESSION_UPDATED_EVENT = "deetech:session-updated";
const EMPTY_SESSION = Object.freeze({ token: null, user: null });

// Non-secret presence flag only - the real authorization boundary is the
// backend's token + role check on every request. This cookie just lets
// middleware decide whether to even show the /admin shell to a visitor who
// has never signed in as an admin on this browser, so a bare /admin visit
// from a stranger doesn't reveal that an admin panel exists at all.
function setAdminHintCookie() {
  if (typeof document === "undefined") return;
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? " Secure;" : "";
  document.cookie = `${ADMIN_HINT_COOKIE}=1; Path=/; Max-Age=2592000; SameSite=Lax;${secure}`;
}

function clearAdminHintCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ADMIN_HINT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax;`;
}

let cachedToken = null;
let cachedUserJson = null;
let cachedUser = null;
let cachedSnapshot = EMPTY_SESSION;

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
  const token = readStoredToken();
  if (typeof window === "undefined") {
    return EMPTY_SESSION;
  }

  const userJson = window.localStorage.getItem(USER_KEY);
  if (cachedToken === token && cachedUserJson === userJson) {
    return cachedSnapshot;
  }

  const user = safeParse(userJson);
  cachedToken = token;
  cachedUserJson = userJson;
  cachedUser = user && typeof user === "object" ? user : null;
  cachedSnapshot = cachedToken || cachedUser
    ? { token: cachedToken, user: cachedUser }
    : EMPTY_SESSION;
  return cachedSnapshot;
}

export function readServerSessionSnapshot() {
  return EMPTY_SESSION;
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
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }

  if (user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(USER_KEY);
  }

  cachedToken = token || null;
  cachedUser = user && typeof user === "object" ? user : null;
  cachedUserJson = cachedUser ? JSON.stringify(cachedUser) : null;
  cachedSnapshot = cachedToken || cachedUser
    ? { token: cachedToken, user: cachedUser }
    : EMPTY_SESSION;

  if (cachedToken && cachedUser?.role === "admin") {
    setAdminHintCookie();
  } else {
    clearAdminHintCookie();
  }

  window.dispatchEvent(new Event(SESSION_UPDATED_EVENT));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  cachedToken = null;
  cachedUserJson = null;
  cachedUser = null;
  cachedSnapshot = EMPTY_SESSION;
  clearAdminHintCookie();
  window.dispatchEvent(new Event(SESSION_UPDATED_EVENT));
}
