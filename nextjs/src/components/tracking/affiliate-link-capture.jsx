"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getAffiliateCodeFromSearchParams, saveAffiliateAttribution } from "@/lib/affiliate-attribution";

export default function AffiliateLinkCapture() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const code = getAffiliateCodeFromSearchParams(params);
    if (!code) return;
    saveAffiliateAttribution(code, "url");
  }, [pathname]);

  return null;
}
