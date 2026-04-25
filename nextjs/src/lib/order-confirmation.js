const LAST_ORDER_KEY = "lastOrder";

function safeParse(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function readLastOrder() {
  if (typeof window === "undefined") return null;
  return safeParse(window.localStorage.getItem(LAST_ORDER_KEY));
}

export function writeLastOrder(order) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
}

export function clearLastOrder() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LAST_ORDER_KEY);
}
