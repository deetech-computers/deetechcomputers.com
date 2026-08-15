// Rejects malformed addresses (spaces, missing TLD, consecutive/leading/trailing
// dots) rather than the loose "has an @ and a dot" check most forms use.
const EMAIL_PATTERN =
  /^(?!\.)(?!.*\.\.)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?<!\.)@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

// Common disposable/throwaway inboxes - blocking these catches people
// dodging a real contact address, which format checks alone can't do.
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "yopmail.com",
  "trashmail.com",
  "getnada.com",
  "fakeinbox.com",
  "sharklasers.com",
  "dispostable.com",
  "maildrop.cc",
  "moakt.com",
]);

// Returns { status: "empty" } | { status: "valid" } | { status: "invalid", message }
export function getEmailFeedback(rawValue) {
  const value = (rawValue || "").trim();
  if (value.length === 0) {
    return { status: "empty" };
  }
  if (!EMAIL_PATTERN.test(value)) {
    return { status: "invalid", message: "Enter a valid email address" };
  }
  const domain = value.split("@")[1]?.toLowerCase();
  if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { status: "invalid", message: "Please use a permanent email address" };
  }
  return { status: "valid" };
}
