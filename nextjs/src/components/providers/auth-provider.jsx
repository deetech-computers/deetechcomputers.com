"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import {
  fetchProfile,
  googleAuthUser,
  loginUser,
  registerUser,
  updateProfile,
} from "@/lib/auth";
import {
  clearSession,
  readServerSessionSnapshot,
  readSessionSnapshot,
  subscribeToSession,
  writeSession,
} from "@/lib/session";
import { useToast } from "./toast-provider";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { pushToast } = useToast();
  const session = useSyncExternalStore(
    subscribeToSession,
    readSessionSnapshot,
    readServerSessionSnapshot
  );
  const user = session.user;
  const token = session.token;
  const status = "ready";

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
            phone: data.phone || "",
            address: data.address || "",
            region: data.region || "",
            city: data.city || "",
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

  const logout = () => {
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
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
