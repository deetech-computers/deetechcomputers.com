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
const RETRYABLE_STATUSES = new Set([500, 502, 503, 504]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  const method = request.method;
  const isReadMethod = method === "GET" || method === "HEAD";
  const retries = isReadMethod ? 2 : 0;
  const init = {
    method,
    headers: buildRequestHeaders(request),
    redirect: "manual",
    cache: "no-store",
  };

  if (!isReadMethod) {
    init.body = await request.arrayBuffer();
  }

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    try {
      const upstreamResponse = await fetch(upstreamUrl, {
        ...init,
        signal: controller.signal,
      });
      if (isReadMethod && RETRYABLE_STATUSES.has(upstreamResponse.status) && attempt < retries) {
        await sleep(300 * (attempt + 1));
        continue;
      }
      const body = method === "HEAD" ? null : upstreamResponse.body;

      return new NextResponse(body, {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        headers: buildResponseHeaders(upstreamResponse.headers),
      });
    } catch (error) {
      if (attempt < retries) {
        await sleep(300 * (attempt + 1));
        continue;
      }
      console.error(`API proxy failed for ${upstreamUrl}`, error);
      return NextResponse.json(
        {
          message: "Unable to reach the backend service right now.",
        },
        { status: 502 }
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return NextResponse.json({ message: "Unable to reach the backend service right now." }, { status: 502 });
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
