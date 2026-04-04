import { NextResponse } from "next/server";

const API_ORIGIN =
  process.env.DEETECH_API_ORIGIN ||
  process.env.NEXT_PUBLIC_DEETECH_API_BASE ||
  (process.env.NODE_ENV === "production"
    ? "https://deetechcomputers-com.onrender.com"
    : "http://127.0.0.1:5000");

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "x-vercel-cache",
]);

function buildUpstreamUrl(path, requestUrl) {
  const segments = Array.isArray(path) ? path : [];
  const upstream = new URL(`/api/${segments.join("/")}`, API_ORIGIN);
  const incoming = new URL(requestUrl);
  upstream.search = incoming.search;
  return upstream;
}

function buildRequestHeaders(request) {
  const headers = new Headers();

  for (const [key, value] of request.headers.entries()) {
    if (HOP_BY_HOP_HEADERS.has(key.toLowerCase())) continue;
    headers.set(key, value);
  }

  return headers;
}

function buildResponseHeaders(upstreamHeaders) {
  const headers = new Headers();

  for (const [key, value] of upstreamHeaders.entries()) {
    if (HOP_BY_HOP_HEADERS.has(key.toLowerCase())) continue;
    headers.set(key, value);
  }

  return headers;
}

async function proxy(request, context) {
  const params = await context.params;
  const upstreamUrl = buildUpstreamUrl(params?.path, request.url);
  const init = {
    method: request.method,
    headers: buildRequestHeaders(request),
    redirect: "manual",
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl, init);
    const body = request.method === "HEAD" ? null : upstreamResponse.body;

    return new NextResponse(body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: buildResponseHeaders(upstreamResponse.headers),
    });
  } catch (error) {
    console.error(`API proxy failed for ${upstreamUrl}`, error);
    return NextResponse.json(
      {
        message: "Unable to reach the backend service right now.",
      },
      { status: 502 }
    );
  }
}

export const dynamic = "force-dynamic";

export async function GET(request, context) {
  return proxy(request, context);
}

export async function POST(request, context) {
  return proxy(request, context);
}

export async function PUT(request, context) {
  return proxy(request, context);
}

export async function PATCH(request, context) {
  return proxy(request, context);
}

export async function DELETE(request, context) {
  return proxy(request, context);
}

export async function OPTIONS(request, context) {
  return proxy(request, context);
}
