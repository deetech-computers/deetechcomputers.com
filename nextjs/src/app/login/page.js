"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GoogleAuthButton from "@/components/auth/google-auth-button";
import { useAuth } from "@/hooks/use-auth";
import "@/components/auth/auth-hp-desktop.css";
import "@/components/auth/auth-hp-mobile.css";

const LAST_EMAIL_KEY = "deetech:last-login-email";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login, loginWithGoogle, status } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [transitionStage, setTransitionStage] = useState("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const stepTimers = useRef([]);

  useEffect(() => {
    if (status === "ready" && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router, status]);

  // Prefill the email of whoever last signed in successfully on this browser,
  // so a returning user doesn't have to retype it every time.
  useEffect(() => {
    try {
      const rememberedEmail = window.localStorage.getItem(LAST_EMAIL_KEY);
      if (rememberedEmail) {
        setForm((current) => ({ ...current, email: rememberedEmail }));
      }
    } catch {
      // ignore unavailable storage
    }
  }, []);

  const emailValid = form.email.trim().length === 0 ? null : EMAIL_PATTERN.test(form.email.trim());
  const isEmpty = {
    email: form.email.trim().length === 0,
    password: form.password.length === 0,
  };

  // "Required" tags only appear once the user leaves a field blank - never on
  // load, and never once a field has something in it (typed or prefilled).
  const showRequired = {
    email: touched.email && isEmpty.email,
    password: touched.password && isEmpty.password,
  };

  const emailFormatError = touched.email && !isEmpty.email && !emailValid ? "Enter a valid email address" : "";

  const fieldHasError = {
    email: showRequired.email || !!emailFormatError,
    password: showRequired.password,
  };

  const isFormValid = !isEmpty.email && emailValid === true && !isEmpty.password;
  const markTouched = (field) => setTouched((current) => ({ ...current, [field]: true }));

  if (status === "loading" || isAuthenticated) {
    return (
      <main className="auth-hp-page">
        <section className="auth-hp-card auth-hp-card--login">
          <div className="auth-hp-frame">
            <h1>Checking session...</h1>
            <p className="hero-copy">Please wait while we confirm your login.</p>
          </div>
        </section>
      </main>
    );
  }

  function startSteps() {
    stepTimers.current.forEach(clearTimeout);
    setLoadingStep(0);
    stepTimers.current = [
      setTimeout(() => setLoadingStep(1), 233),
      setTimeout(() => setLoadingStep(2), 466),
    ];
  }

  function clearSteps() {
    stepTimers.current.forEach(clearTimeout);
    setLoadingStep(0);
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setTouched({ email: true, password: true });
    if (!isFormValid) {
      return;
    }
    setSubmitting(true);
    setTransitionStage("loading");
    startSteps();
    const loadStart = Date.now();

    try {
      const trimmedEmail = form.email.trim().toLowerCase();
      await login({
        email: trimmedEmail,
        password: form.password,
      });
      try {
        window.localStorage.setItem(LAST_EMAIL_KEY, trimmedEmail);
      } catch {
        // ignore unavailable storage
      }
      const remaining = Math.max(0, 700 - (Date.now() - loadStart));
      await new Promise((r) => setTimeout(r, remaining));
      clearSteps();
      setTransitionStage("success");
      setTimeout(() => router.push("/"), 900);
    } catch (err) {
      stepTimers.current.forEach(clearTimeout);
      setLoadingStep(2);
      setTransitionStage("error");
      const msg = err.message;
      setTimeout(() => {
        setLoadingStep(0);
        setTransitionStage("idle");
        setError(msg);
        setSubmitting(false);
      }, 1200);
    }
  };

  const handleGoogleAuth = async (credential) => {
    setSubmitting(true);
    setError("");
    setTransitionStage("loading");
    startSteps();
    const loadStart = Date.now();
    try {
      await loginWithGoogle(credential);
      const remaining = Math.max(0, 700 - (Date.now() - loadStart));
      await new Promise((r) => setTimeout(r, remaining));
      clearSteps();
      setTransitionStage("success");
      setTimeout(() => router.push("/"), 900);
    } catch (err) {
      stepTimers.current.forEach(clearTimeout);
      setLoadingStep(2);
      setTransitionStage("error");
      const msg = err.message || "Google sign-in failed.";
      setTimeout(() => {
        setLoadingStep(0);
        setTransitionStage("idle");
        setError(msg);
        setSubmitting(false);
      }, 1200);
    }
  };

  return (
    <main className="auth-hp-page">
      {transitionStage !== "idle" ? (
        <div className="auth-transition" aria-live="polite">
          <div className="auth-transition__card">
            <div className={`auth-transition__badge${transitionStage === "success" ? " auth-transition__badge--success" : transitionStage === "error" ? " auth-transition__badge--error" : ""}`} aria-hidden="true">
              {transitionStage === "success" ? (
                <svg className="auth-transition__check" viewBox="0 0 52 52" fill="none">
                  <circle className="auth-transition__check-ring" cx="26" cy="26" r="24" />
                  <path className="auth-transition__check-mark" d="M15 27.5 22.5 35 38 18" />
                </svg>
              ) : (
                <span className="auth-transition__spinner" />
              )}
            </div>
            <strong className="auth-transition__title">
              {transitionStage === "success" ? "Welcome back!" : transitionStage === "error" ? "Sign in failed" : "Signing you in…"}
            </strong>
            <p className="auth-transition__message">
              {transitionStage === "success"
                ? "Login successful. Taking you to the homepage."
                : transitionStage === "error"
                ? "Please check your credentials and try again."
                : "Verifying your credentials and setting up your session."}
            </p>
            <div className="auth-transition__steps" aria-hidden="true">
              <span className={`auth-transition__step${transitionStage === "success" || transitionStage === "error" || loadingStep > 0 ? " is-done" : " is-active"}`}>
                <span className="auth-transition__step-dot" />Verify
              </span>
              <span className={`auth-transition__step${transitionStage === "success" || transitionStage === "error" || loadingStep > 1 ? " is-done" : loadingStep === 1 ? " is-active" : ""}`}>
                <span className="auth-transition__step-dot" />Authenticate
              </span>
              <span className={`auth-transition__step${transitionStage === "success" ? " is-done is-active" : transitionStage === "error" ? " is-error" : loadingStep === 2 ? " is-active" : ""}`}>
                <span className="auth-transition__step-dot" />Done
              </span>
            </div>
          </div>
        </div>
      ) : null}
      <section className="auth-hp-card auth-hp-card--login">
        <div className="auth-hp-frame">
          <header className="auth-hp-head">
            <Link href="/" className="auth-hp-logo-link" aria-label="Go to homepage">
              <Image className="auth-hp-logo" src="/favicon-removebg-preview.png" alt="Deetech Computers logo" width={170} height={48} priority />
            </Link>
          </header>
          <h1>Sign in</h1>
          <form className="auth-hp-form" onSubmit={onSubmit}>
            <label className={`field-group${fieldHasError.email ? " field-group--error" : ""}`}>
              <span>
                Email address
                {showRequired.email ? <em className="field-group__required">Required</em> : null}
              </span>
              <input
                className="field"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                onBlur={() => markTouched("email")}
                autoComplete="email"
                aria-invalid={fieldHasError.email}
                required
              />
              {emailFormatError ? <p className="field-group__error">{emailFormatError}</p> : null}
            </label>
            <label className={`field-group${fieldHasError.password ? " field-group--error" : ""}`}>
              <span>
                Password
                {showRequired.password ? <em className="field-group__required">Required</em> : null}
              </span>
              <div className="password-field">
                <input
                  className="field"
                  type={showPassword ? "text" : "password"}
                  placeholder="Use your password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  onBlur={() => markTouched("password")}
                  autoComplete="current-password"
                  aria-invalid={fieldHasError.password}
                  required
                />
                <button
                  type="button"
                  className="password-field__toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button
              type="submit"
              className={`auth-hp-btn auth-hp-btn--primary${submitting ? " auth-hp-btn--loading" : ""}`}
              disabled={submitting || !isFormValid}
            >
              {submitting ? "Logging in..." : "Login"}
            </button>
            <GoogleAuthButton
              text="signin_with"
              onCredential={handleGoogleAuth}
              onError={(err) => setError(err?.message || "Google sign-in failed.")}
              disabled={submitting}
            />
            <Link href="/register" className="auth-hp-link-row">Create account</Link>
            <Link href="/forgot-password" className="auth-hp-link-row">Forgot password?</Link>
          </form>
        </div>
        <Link href="/privacy-policy" className="auth-hp-privacy">Privacy</Link>
      </section>
    </main>
  );
}
