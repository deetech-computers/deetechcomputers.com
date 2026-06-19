"use client";

import { useEffect } from "react";

const RECOVERY_KEY = "deetech:chunk-reload-recovered";
const RECOVERY_WINDOW_MS = 60_000;

function isChunkLoadFailure(value) {
  const message = String(value?.message || value || "");
  return (
    message.includes("ChunkLoadError") ||
    message.includes("Loading chunk") ||
    message.includes("/_next/static/chunks/")
  );
}

function reloadOnceForFreshAssets() {
  if (typeof window === "undefined") return;
  const lastReload = Number(window.sessionStorage.getItem(RECOVERY_KEY) || 0);
  const now = Date.now();
  if (now - lastReload < RECOVERY_WINDOW_MS) return;
  window.sessionStorage.setItem(RECOVERY_KEY, String(now));
  window.location.reload();
}

export default function ChunkReloadRecovery() {
  useEffect(() => {
    const handleResourceError = (event) => {
      const target = event.target;
      const src = target?.src || target?.href || "";
      if (typeof src === "string" && src.includes("/_next/static/chunks/")) {
        reloadOnceForFreshAssets();
      }
    };

    const handleRuntimeError = (event) => {
      if (isChunkLoadFailure(event?.error) || isChunkLoadFailure(event)) {
        reloadOnceForFreshAssets();
      }
    };

    const handleUnhandledRejection = (event) => {
      if (isChunkLoadFailure(event?.reason)) {
        reloadOnceForFreshAssets();
      }
    };

    window.addEventListener("error", handleResourceError, true);
    window.addEventListener("error", handleRuntimeError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleResourceError, true);
      window.removeEventListener("error", handleRuntimeError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
