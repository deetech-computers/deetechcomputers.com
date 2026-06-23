import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith("/admin")) {
    const hasAdminHint = request.cookies.get("dt_admin_hint")?.value === "1";
    if (!hasAdminHint) {
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url, 307);
    }
    return NextResponse.next();
  }

  if (url.pathname === "/change-password") {
    url.pathname = "/forgot-password";
    return NextResponse.redirect(url, 308);
  }

  if (url.pathname === "/thankyou" || url.pathname === "/thankyou.html") {
    url.pathname = "/order-completed";
    return NextResponse.redirect(url, 308);
  }

  if (url.pathname === "/products" && url.searchParams.has("source")) {
    url.searchParams.delete("source");
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/products", "/change-password", "/thankyou", "/thankyou.html"],
};
