"use client";

import { useEffect, useId, useRef, useState } from "react";
import { fetchGoogleAuthConfig } from "@/lib/auth";

let googleScriptPromise = null;

function loadGoogleScript() {
  // Keep a single shared Google script loader across auth screens.
  if (typeof window === "undefined") return Promise.reject(new Error("Browser required"));
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-google-gsi="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Google script failed to load.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleGsi = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google script failed to load."));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export default function GoogleAuthButton({
  text = "signin_with",
  onCredential,
  onError,
  disabled = false,
}) {
  const containerRef = useRef(null);
  const callbackRef = useRef(onCredential);
  const errorRef = useRef(onError);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState("");
  const instanceId = useId().replace(/:/g, "-");

  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    errorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      setLoading(true);
      setError("");

      try {
        const config = await fetchGoogleAuthConfig();
        const clientId = String(config?.clientId || "").trim();
        if (!config?.enabled || !clientId) {
          throw new Error("Google sign-in is not available right now.");
        }

        await loadGoogleScript();
        if (cancelled || !window.google?.accounts?.id || !containerRef.current) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            const credential = String(response?.credential || "").trim();
            if (!credential) {
              const nextError = new Error("Google did not return a valid sign-in credential.");
              setError(nextError.message);
              errorRef.current?.(nextError);
              return;
            }
            callbackRef.current?.(credential);
          },
        });

        containerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          text,
          shape: "rectangular",
          size: "large",
          logo_alignment: "left",
        });

        setEnabled(true);
      } catch (setupError) {
        const message = setupError?.message || "Google sign-in could not be loaded.";
        if (!cancelled) {
          setError(message);
          setEnabled(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    setup();
    return () => {
      cancelled = true;
    };
  }, [instanceId, text]);

  return (
    <div className="auth-google">
      <div className="auth-google__divider" aria-hidden="true">
        <span>or</span>
      </div>
      <div
        ref={containerRef}
        className={disabled || loading || !enabled ? "auth-google__button is-disabled" : "auth-google__button"}
        style={{ width: "100%" }}
      />
      {error ? <p className="form-error auth-google__error">{error}</p> : null}
    </div>
  );
}
