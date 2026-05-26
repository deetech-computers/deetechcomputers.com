"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getAffiliateCodeFromSearchParams, saveAffiliateAttribution } from "@/lib/affiliate-attribution";

export default function AffiliateLinkCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryKey = searchParams?.toString() || "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const code = getAffiliateCodeFromSearchParams(params);
    if (!code) return;
    const source = pathname?.startsWith("/products/") ? "product-link" : "url";
    saveAffiliateAttribution(code, source, { pathname });
  }, [pathname, queryKey]);

  return null;
}
