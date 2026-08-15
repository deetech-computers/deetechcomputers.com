"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GoogleAuthButton from "@/components/auth/google-auth-button";
import { useAuth } from "@/hooks/use-auth";
import "@/components/auth/auth-hp-desktop.css";
import "@/components/auth/auth-hp-mobile.css";

const REGISTER_DRAFT_KEY = "deetech:register-draft";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, loginWithGoogle, register, status } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // Restore a partially-filled signup (name/email only - never the password) so
  // someone who navigates away mid-registration doesn't have to start over.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(REGISTER_DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      setForm((current) => ({
        ...current,
        firstName: draft.firstName || current.firstName,
        lastName: draft.lastName || current.lastName,
        email: draft.email || current.email,
      }));
    } catch {
      // ignore malformed/unavailable storage
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        REGISTER_DRAFT_KEY,
        JSON.stringify({ firstName: form.firstName, lastName: form.lastName, email: form.email })
      );
    } catch {
      // ignore unavailable storage (private browsing, etc.)
    }
  }, [form.firstName, form.lastName, form.email]);

  const emailValid = form.email.trim().length === 0 ? null : EMAIL_PATTERN.test(form.email.trim());
  const passwordHasMinLength = form.password.length >= 6;
  const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  const fieldErrors = {
    firstName: form.firstName.trim().length === 0 ? "First name is required" : "",
    lastName: form.lastName.trim().length === 0 ? "Last name is required" : "",
    email:
      form.email.trim().length === 0
        ? "Email address is required"
        : !emailValid
        ? "Enter a valid email address"
        : "",
    password: !passwordHasMinLength ? "Password must be at least 6 characters" : "",
    confirmPassword: !passwordsMatch ? "Passwords must match" : "",
  };

  const isFormValid = Object.values(fieldErrors).every((message) => message === "");

  const markTouched = (field) => setTouched((current) => ({ ...current, [field]: true }));

  if (status === "loading" || isAuthenticated) {
    return (
      <main className="auth-hp-page">
        <section className="auth-hp-card auth-hp-card--register">
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
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true });

    if (!isFormValid) {
      return;
    }

    setSubmitting(true);
    setTransitionStage("loading");
    startSteps();
    const loadStart = Date.now();
    try {
      await register({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      try {
        window.localStorage.removeItem(REGISTER_DRAFT_KEY);
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
      const msg = err.message || "Google sign-up failed.";
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
              {transitionStage === "success" ? "Account created!" : transitionStage === "error" ? "Registration failed" : "Creating your account…"}
            </strong>
            <p className="auth-transition__message">
              {transitionStage === "success"
                ? "You're all set. Taking you to the homepage."
                : transitionStage === "error"
                ? "Something went wrong. Please try again."
                : "Setting up your profile and sending your welcome email."}
            </p>
            <div className="auth-transition__steps" aria-hidden="true">
              <span className={`auth-transition__step${transitionStage === "success" || transitionStage === "error" || loadingStep > 0 ? " is-done" : " is-active"}`}>
                <span className="auth-transition__step-dot" />Register
              </span>
              <span className={`auth-transition__step${transitionStage === "success" || transitionStage === "error" || loadingStep > 1 ? " is-done" : loadingStep === 1 ? " is-active" : ""}`}>
                <span className="auth-transition__step-dot" />Confirm
              </span>
              <span className={`auth-transition__step${transitionStage === "success" ? " is-done is-active" : transitionStage === "error" ? " is-error" : loadingStep === 2 ? " is-active" : ""}`}>
                <span className="auth-transition__step-dot" />Done
              </span>
            </div>
          </div>
        </div>
      ) : null}
      <section className="auth-hp-card auth-hp-card--register">
        <div className="auth-hp-frame">
          <header className="auth-hp-head">
            <Link href="/" className="auth-hp-logo-link" aria-label="Go to homepage">
              <Image className="auth-hp-logo" src="/favicon-removebg-preview.png" alt="Deetech Computers logo" width={170} height={48} priority />
            </Link>
          </header>
          <h1>Create account</h1>
          <form className="auth-hp-form" onSubmit={onSubmit}>
            <div className="auth-hp-grid-two">
              <label className={`field-group${touched.firstName && fieldErrors.firstName ? " field-group--error" : ""}`}>
                <span>
                  First name
                  <em className="field-group__required">Required</em>
                </span>
                <input
                  className="field"
                  type="text"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
                  onBlur={() => markTouched("firstName")}
                  aria-invalid={touched.firstName && !!fieldErrors.firstName}
                  required
                />
                {touched.firstName && fieldErrors.firstName ? <p className="field-group__error">{fieldErrors.firstName}</p> : null}
              </label>
              <label className={`field-group${touched.lastName && fieldErrors.lastName ? " field-group--error" : ""}`}>
                <span>
                  Last name
                  <em className="field-group__required">Required</em>
                </span>
                <input
                  className="field"
                  type="text"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
                  onBlur={() => markTouched("lastName")}
                  aria-invalid={touched.lastName && !!fieldErrors.lastName}
                  required
                />
                {touched.lastName && fieldErrors.lastName ? <p className="field-group__error">{fieldErrors.lastName}</p> : null}
              </label>
            </div>
            <label className={`field-group${touched.email && fieldErrors.email ? " field-group--error" : ""}`}>
              <span>
                Email address
                <em className="field-group__required">Required</em>
              </span>
              <input
                className="field"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                onBlur={() => markTouched("email")}
                autoComplete="email"
                aria-invalid={touched.email && !!fieldErrors.email}
                required
              />
              {touched.email && fieldErrors.email ? <p className="field-group__error">{fieldErrors.email}</p> : null}
            </label>
            <label className={`field-group${touched.password && fieldErrors.password ? " field-group--error" : ""}`}>
              <span>
                Password
                <em className="field-group__required">Required</em>
              </span>
              <div className="password-field">
                <input
                  className="field"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  onBlur={() => markTouched("password")}
                  autoComplete="new-password"
                  aria-invalid={touched.password && !!fieldErrors.password}
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
              <ul className="password-requirements">
                <li className={`password-requirements__item${passwordHasMinLength ? " is-met" : ""}`}>
                  <span className="password-requirements__item-icon" aria-hidden="true">✓</span>
                  At least 6 characters
                </li>
              </ul>
            </label>
            <label className={`field-group${touched.confirmPassword && fieldErrors.confirmPassword ? " field-group--error" : ""}`}>
              <span>
                Confirm password
                <em className="field-group__required">Required</em>
              </span>
              <div className="password-field">
                <input
                  className="field"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                  onBlur={() => markTouched("confirmPassword")}
                  autoComplete="new-password"
                  aria-invalid={touched.confirmPassword && !!fieldErrors.confirmPassword}
                  required
                />
                <button
                  type="button"
                  className="password-field__toggle"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  aria-pressed={showConfirmPassword}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              <ul className="password-requirements">
                <li className={`password-requirements__item${passwordsMatch ? " is-met" : ""}`}>
                  <span className="password-requirements__item-icon" aria-hidden="true">✓</span>
                  Passwords match
                </li>
              </ul>
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" className="auth-hp-btn auth-hp-btn--primary" disabled={submitting || !isFormValid}>
              {submitting ? "Creating account..." : "Create"}
            </button>
            <GoogleAuthButton
              text="signup_with"
              onCredential={handleGoogleAuth}
              onError={(err) => setError(err?.message || "Google sign-up failed.")}
              disabled={submitting}
            />
            <Link href="/login" className="auth-hp-link-row">Sign in</Link>
          </form>
        </div>
        <Link href="/privacy-policy" className="auth-hp-privacy">Privacy</Link>
      </section>
    </main>
  );
}
