const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

function isJsonContentType(contentType) {
  return String(contentType || "").toLowerCase().includes("application/json");
}

function looksLikeHtml(text) {
  return /<!doctype html>|<html[\s>]/i.test(String(text || ""));
}

function getFriendlyHttpMessage(status, fallback = "Request failed") {
  if (status === 429) return "Too many requests right now. Please try again in a moment.";
  if (status === 502 || status === 503 || status === 504) {
    return "Service is temporarily unavailable. Please try again shortly.";
  }
  if (status >= 500) return "Server error. Please try again shortly.";
  if (status === 404) return "The requested resource was not found.";
  if (status === 401 || status === 403) return "You are not authorized to perform this action.";
  return fallback;
}

function getErrorMessageFromPayload(payload, status) {
  if (payload && typeof payload === "object" && payload.message) {
    return String(payload.message);
  }
  if (typeof payload === "string" && payload.trim()) {
    if (looksLikeHtml(payload)) return getFriendlyHttpMessage(status);
    return payload.trim().slice(0, 240);
  }
  return getFriendlyHttpMessage(status);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function requestJson(url, options = {}) {
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };
  const method = String(options.method || "GET").toUpperCase();
  const retries = Number(options.retries ?? (method === "GET" ? 1 : 0));
  const timeoutMs = Number(options.timeoutMs || 20000);

  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        cache: options.cache || "no-store",
        signal: controller.signal,
      });
      const contentType = response.headers.get("content-type") || "";
      const text = await response.text();
      let data = null;

      if (text) {
        if (isJsonContentType(contentType)) {
          try {
            data = JSON.parse(text);
          } catch {
            data = null;
          }
        } else {
          data = text;
        }
      }

      if (!response.ok) {
        const retryable = RETRYABLE_STATUS.has(response.status);
        if (retryable && attempt < retries) {
          await sleep(350 * (attempt + 1));
          continue;
        }

        const error = new Error(getErrorMessageFromPayload(data, response.status));
        error.status = response.status;
        error.url = url;
        throw error;
      }

      if (!isJsonContentType(contentType) && looksLikeHtml(text)) {
        const error = new Error(getFriendlyHttpMessage(502));
        error.status = 502;
        error.url = url;
        throw error;
      }

      return data;
    } catch (error) {
      lastError = error;
      const isAbort = error?.name === "AbortError";
      const isRetryableStatus = RETRYABLE_STATUS.has(Number(error?.status || 0));
      const isNetworkFailure = !error?.status || isAbort;
      const canRetry = attempt < retries && (isRetryableStatus || isNetworkFailure);

      if (!canRetry) break;
      await sleep(350 * (attempt + 1));
    } finally {
      clearTimeout(timeoutId);
    }
  }

  if (lastError?.name === "AbortError") {
    throw new Error("Request timed out. Please try again.");
  }

  throw lastError || new Error("Request failed");
}
