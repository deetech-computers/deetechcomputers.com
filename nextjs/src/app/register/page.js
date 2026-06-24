"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GoogleAuthButton from "@/components/auth/google-auth-button";
import { useAuth } from "@/hooks/use-auth";
import "@/components/auth/auth-hp-desktop.css";
import "@/components/auth/auth-hp-mobile.css";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, loginWithGoogle, register, status } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "ready" && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router, status]);

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

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = async (credential) => {
    setSubmitting(true);
    setError("");
    try {
      await loginWithGoogle(credential);
      router.push("/");
    } catch (err) {
      setError(err.message || "Google sign-up failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-hp-page">
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
              <label className="field-group">
                <span>First name</span>
                <input className="field" type="text" placeholder="First name *" value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} required />
              </label>
              <label className="field-group">
                <span>Last name</span>
                <input className="field" type="text" placeholder="Last name *" value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} required />
              </label>
            </div>
            <label className="field-group">
              <span>Email address</span>
              <input className="field" type="email" placeholder="Email address *" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} autoComplete="email" required />
            </label>
            <label className="field-group">
              <span>Password</span>
              <div className="password-field">
                <input
                  className="field"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password *"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  autoComplete="new-password"
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
            <label className="field-group">
              <span>Confirm password</span>
              <div className="password-field">
                <input
                  className="field"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password *"
                  value={form.confirmPassword}
                  onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                  autoComplete="new-password"
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
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" className="auth-hp-btn auth-hp-btn--primary" disabled={submitting}>
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
