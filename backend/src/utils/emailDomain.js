// Uses DNS-over-HTTPS (plain HTTPS GET) instead of Node's raw `dns` module.
// Some hosts firewall outbound UDP/53 for containerized workloads, which
// silently breaks dns.resolveMx there - HTTPS is guaranteed to work anywhere
// the backend can already reach the outside world (e.g. to send email).
const DOH_PROVIDERS = ["https://dns.google/resolve", "https://cloudflare-dns.com/dns-query"];
const PER_PROVIDER_TIMEOUT_MS = 1500;
const OVERALL_TIMEOUT_MS = 3000;

async function queryDnsOverHttps(providerUrl, domain, type) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PER_PROVIDER_TIMEOUT_MS);
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

// Races every DoH provider at once for a given record type instead of trying
// them one after another - this keeps latency pinned to whichever provider
// answers first (normally ~150-600ms) and only pays the full timeout if ALL
// of them are unreachable, instead of paying it once per provider in turn.
async function resolveRecordType(domain, type) {
  return Promise.any(DOH_PROVIDERS.map((provider) => queryDnsOverHttps(provider, domain, type)));
}

async function resolveDomainMailCapability(domain) {
  const mxResult = await resolveRecordType(domain, "MX");
  if (hasAnswer(mxResult)) return true;
  // No MX records - fall back to A records, valid per RFC 5321 for domains
  // that receive mail directly on their bare hostname.
  const aResult = await resolveRecordType(domain, "A");
  return hasAnswer(aResult);
}

// Fails open (treats the domain as receivable) if the lookup errors out or
// blows the overall time budget, so a DNS/network hiccup never blocks a real
// signup - this is a typo/junk-domain catch, not a hard security gate. The
// outer timeout bounds total wall time regardless of how many sequential
// steps run inside (MX, then possibly A), each of which is itself already
// bounded by the per-provider race above.
export async function domainCanReceiveMail(domain) {
  if (!domain) return false;

  let overallTimer;
  const overallTimeout = new Promise((resolve) => {
    overallTimer = setTimeout(() => resolve(true), OVERALL_TIMEOUT_MS);
  });

  try {
    return await Promise.race([
      resolveDomainMailCapability(domain).catch(() => true),
      overallTimeout,
    ]);
  } finally {
    clearTimeout(overallTimer);
  }
}
