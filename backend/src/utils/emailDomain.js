// Uses DNS-over-HTTPS (plain HTTPS GET) instead of Node's raw `dns` module.
// Some hosts firewall outbound UDP/53 for containerized workloads, which
// silently breaks dns.resolveMx there - HTTPS is guaranteed to work anywhere
// the backend can already reach the outside world (e.g. to send email).
const DOH_PROVIDERS = ["https://dns.google/resolve", "https://cloudflare-dns.com/dns-query"];

async function queryDnsOverHttps(providerUrl, domain, type, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = `${providerUrl}?name=${encodeURIComponent(domain)}&type=${type}`;
    const response = await fetch(url, {
      headers: { accept: "application/dns-json" },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`DoH request failed with status ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function hasAnswer(result) {
  return Boolean(result && result.Status === 0 && Array.isArray(result.Answer) && result.Answer.length > 0);
}

// Tries each DoH provider in turn (in case one is unreachable from this
// network) before giving up on a given record type.
async function resolveRecordType(domain, type, timeoutMs) {
  let lastError = null;
  for (const provider of DOH_PROVIDERS) {
    try {
      return await queryDnsOverHttps(provider, domain, type, timeoutMs);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("All DoH providers failed");
}

async function resolveDomainMailCapability(domain, timeoutMs) {
  const mxResult = await resolveRecordType(domain, "MX", timeoutMs);
  if (hasAnswer(mxResult)) return true;
  // No MX records - fall back to A records, valid per RFC 5321 for domains
  // that receive mail directly on their bare hostname.
  const aResult = await resolveRecordType(domain, "A", timeoutMs);
  return hasAnswer(aResult);
}

// Fails open (treats the domain as receivable) if every DoH lookup fails or
// times out, so a network hiccup never blocks a real signup - this is a
// typo/junk-domain catch, not a hard security gate.
export async function domainCanReceiveMail(domain, timeoutMs = 3500) {
  if (!domain) return false;
  try {
    return await resolveDomainMailCapability(domain, timeoutMs);
  } catch {
    return true;
  }
}
