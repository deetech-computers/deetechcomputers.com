"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchProfile, loginUser, registerUser, updateProfile } from "@/lib/auth";
import { clearSession, readStoredToken, readStoredUser, writeSession } from "@/lib/session";
import { useToast } from "./toast-provider";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { pushToast } = useToast();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setUser(readStoredUser());
    setToken(readStoredToken());
    setStatus("ready");
  }, []);

  const setSessionState = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    writeSession({ token: nextToken, user: nextUser });
  };

  const login = async ({ email, password }) => {
    const data = await loginUser({ email, password });
    setSessionState(data.token || null, data.user || null);
    pushToast("Login successful", "success");
    return data;
  };

  const register = async ({ name, email, password }) => {
    const data = await registerUser({ name, email, password });
    setSessionState(data.token || null, data.user || null);
    pushToast("Account created successfully", "success");
    return data;
  };

  const refreshProfile = async () => {
    if (!token) return null;
    const profile = await fetchProfile(token);
    setUser(profile);
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
    setToken(nextToken);
    setUser(nextUser);
    writeSession({ token: nextToken, user: nextUser });
    pushToast("Profile updated successfully!", "success");
    return nextUser;
  };

  const logout = () => {
    clearSession();
    setUser(null);
    setToken(null);
    pushToast("You have been logged out", "info");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      status,
      isAuthenticated: Boolean(token),
      login,
      register,
      refreshProfile,
      saveProfile,
      logout,
    }),
    [status, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
