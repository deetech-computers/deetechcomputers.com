import { requestJson } from "./http";

export async function requestWithToken(url, token, options = {}) {
  return requestJson(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}

export function asArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.orders)) return payload.orders;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.reviews)) return payload.reviews;
  if (Array.isArray(payload?.messages)) return payload.messages;
  if (Array.isArray(payload?.affiliates)) return payload.affiliates;
  if (Array.isArray(payload?.discounts)) return payload.discounts;
  if (Array.isArray(payload?.banners)) return payload.banners;
  return [];
}
