"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import {
  fetchProfile,
  googleAuthUser,
  loginUser,
  registerUser,
  updateProfile,
  uploadAvatar as uploadAvatarRequest,
} from "@/lib/auth";
import {
  clearSession,
  readServerSessionSnapshot,
  readSessionSnapshot,
  subscribeToSession,
  syncAdminHintCookie,
  writeSession,
} from "@/lib/session";
import { clearAllCheckoutDrafts } from "@/lib/checkout";
import { useToast } from "./toast-provider";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { pushToast } = useToast();
  const [hydrated, setHydrated] = useState(false);
  const session = useSyncExternalStore(
    subscribeToSession,
    readSessionSnapshot,
    readServerSessionSnapshot
  );
  const user = session.user;
  const token = session.token;
  const status = hydrated ? "ready" : "loading";

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Keeps the /admin access cookie in sync with whatever session is
  // currently active, including a session that was already logged in
  // before this cookie existed (restored straight from localStorage).
  useEffect(() => {
    syncAdminHintCookie(token, user);
  }, [token, user]);

  const normalizeAuthResult = (data) => {
    const tokenValue = data?.token || null;
    const userValue =
      data?.user ||
      (data?._id
        ? {
            _id: data._id,
            name: data.name,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email,
            role: data.role,
            isActive: data.isActive,
            avatarUrl: data.avatarUrl || "",
            authProvider: data.authProvider || "local",
          }
        : null);

    return {
      token: tokenValue,
      user: userValue,
    };
  };

  const login = async ({ email, password }) => {
    const data = await loginUser({ email, password });
    const normalized = normalizeAuthResult(data);
    writeSession({ token: normalized.token, user: normalized.user });
    pushToast("Login successful", "success");
    return data;
  };

  const register = async ({ name, email, password }) => {
    const data = await registerUser({ name, email, password });
    const normalized = normalizeAuthResult(data);
    writeSession({ token: normalized.token, user: normalized.user });
    pushToast("Account created successfully", "success");
    return data;
  };

  const loginWithGoogle = async (credential) => {
    const data = await googleAuthUser(credential);
    const normalized = normalizeAuthResult(data);
    writeSession({ token: normalized.token, user: normalized.user });
    pushToast("Google sign-in successful", "success");
    return data;
  };

  const refreshProfile = async () => {
    if (!token) return null;
    const profile = await fetchProfile(token);
    writeSession({ token, user: profile });
    return profile;
  };

  const saveProfile = async (payload) => {
    if (!token) throw new Error("Login required");
    const profile = await updateProfile(token, payload);
    const nextToken = profile?.token || token;
    const nextUser = {
      ...(user || {}),
      ...(profile || {}),
    };
    writeSession({ token: nextToken, user: nextUser });
    pushToast("Profile updated successfully!", "success");
    return nextUser;
  };

  const uploadAvatar = async (file) => {
    if (!token) throw new Error("Login required");
    const profile = await uploadAvatarRequest(token, file);
    const nextToken = profile?.token || token;
    const nextUser = {
      ...(user || {}),
      ...(profile || {}),
    };
    writeSession({ token: nextToken, user: nextUser });
    pushToast("Profile photo updated", "success");
    return nextUser;
  };

  const logout = () => {
    clearAllCheckoutDrafts();
    clearSession();
    pushToast("You have been logged out", "info");
  };

  const value = {
    user,
    token,
    status,
    isAuthenticated: Boolean(token),
    login,
    loginWithGoogle,
    register,
    refreshProfile,
    saveProfile,
    uploadAvatar,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
