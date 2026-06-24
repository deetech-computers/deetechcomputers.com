"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GoogleAuthButton from "@/components/auth/google-auth-button";
import { useAuth } from "@/hooks/use-auth";
import "@/components/auth/auth-hp-desktop.css";
import "@/components/auth/auth-hp-mobile.css";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login, loginWithGoogle, status } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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
        <section className="auth-hp-card auth-hp-card--login">
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
    setSubmitting(true);
    setError("");

    try {
      await login({
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
      setError(err.message || "Google sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-hp-page">
      <section className="auth-hp-card auth-hp-card--login">
        <div className="auth-hp-frame">
          <header className="auth-hp-head">
            <Link href="/" className="auth-hp-logo-link" aria-label="Go to homepage">
              <Image className="auth-hp-logo" src="/favicon-removebg-preview.png" alt="Deetech Computers logo" width={170} height={48} priority />
            </Link>
          </header>
          <h1>Sign in</h1>
          <form className="auth-hp-form" onSubmit={onSubmit}>
            <label className="field-group">
              <span>Email address</span>
              <input
                className="field"
                type="email"
                placeholder="Username or Email Address"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                autoComplete="email"
                required
              />
            </label>
            <label className="field-group">
              <span>Password</span>
              <div className="password-field">
                <input
                  className="field"
                  type={showPassword ? "text" : "password"}
                  placeholder="Use your password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  autoComplete="current-password"
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
            <button type="submit" className="auth-hp-btn auth-hp-btn--primary" disabled={submitting}>
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
