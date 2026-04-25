import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();

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
  matcher: ["/products", "/change-password", "/thankyou", "/thankyou.html"],
};
