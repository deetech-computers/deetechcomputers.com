"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { canonicalCategory } from "@/lib/products";
import { requestWithToken } from "@/lib/resource";

const CATALOG_CATEGORIES = new Set([
  "laptops",
  "phones",
  "monitors",
  "accessories",
  "printers",
  "storage",
  "others",
]);

function resolveTrackedCategory(pathname, searchParams) {
  const path = String(pathname || "").trim().toLowerCase();
  if (!path.startsWith("/products")) return "";

  const pieces = path.split("/").filter(Boolean);
  const routeCategory = canonicalCategory(pieces[1] || "");
  if (CATALOG_CATEGORIES.has(routeCategory)) return routeCategory;

  const queryCategory = canonicalCategory(searchParams.get("category") || "");
  if (CATALOG_CATEGORIES.has(queryCategory)) return queryCategory;

  return "";
}

function normalizeSearchTerm(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .slice(0, 80);
}

export default function UserBehaviorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, token } = useAuth();
  const queryKey = searchParams?.toString() || "";
  const lastSentRef = useRef("");

  const payload = useMemo(() => {
    const searchTerm = normalizeSearchTerm(searchParams?.get("q") || "");
    const category = resolveTrackedCategory(pathname, searchParams);
    const next = {};
    if (searchTerm) next.searchTerm = searchTerm;
    if (category) next.category = category;
    return next;
  }, [pathname, queryKey, searchParams]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    if (!payload.searchTerm && !payload.category) return;

    const dedupeKey = `${pathname}|${payload.searchTerm}|${payload.category}`;
    if (dedupeKey === lastSentRef.current) return;
    lastSentRef.current = dedupeKey;

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      if (cancelled) return;
      try {
        await requestWithToken("/api/users/behavior", token, {
          method: "POST",
          body: JSON.stringify(payload),
          retries: 0,
          timeoutMs: 6000,
        });
      } catch {
        // Silent fail: behavior telemetry should never block UX.
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isAuthenticated, token, pathname, payload]);

  return null;
}
