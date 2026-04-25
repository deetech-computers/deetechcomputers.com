"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function RouteScrollTop() {
  const pathname = usePathname();
  const previousPathRef = useRef(pathname);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const previousRestoration = window.history.scrollRestoration;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const navigationEntry = window.performance
      ?.getEntriesByType?.("navigation")
      ?.at?.(0);
    const isReload = navigationEntry?.type === "reload";
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (isReload) {
      // Wait one frame so any restored scroll position is applied, then animate to top.
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: reduceMotion ? "auto" : "smooth",
        });
      });
    }

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = previousRestoration || "auto";
      }
    };
  }, []);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      previousPathRef.current = pathname;
      return;
    }

    if (!pathname || pathname === previousPathRef.current) return;

    previousPathRef.current = pathname;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  }, [pathname]);

  return null;
}
