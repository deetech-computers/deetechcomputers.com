import { domainCanReceiveMail } from "../src/utils/emailDomain.js";

// Simulates 150 concurrent users hitting the real DNS-over-HTTPS domain
// checker at once - real network calls, no mocking. Mix of popular real
// domains (repeated across many "users", the realistic case), disposable
// domains (real, resolvable), and genuinely nonexistent domains, to prove
// both correctness and timing hold under real concurrent load.

const REAL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "mailinator.com", // real domain, just disposable - MX check alone should say true
  "protonmail.com",
  "aol.com",
];

const FAKE_DOMAINS = [
  "thisdomaindefinitelydoesnotexist12345.com",
  "totally-made-up-domain-9876543.zzz",
  "asdkjhasdkjh1928.invalid",
];

function buildUsers(n) {
  const users = [];
  for (let i = 0; i < n; i++) {
    // ~85% real domains (the realistic traffic mix), ~15% fake, to also
    // prove genuinely bad domains still get caught correctly under load.
    const pool = i % 7 === 0 ? FAKE_DOMAINS : REAL_DOMAINS;
    const domain = pool[i % pool.length];
    users.push({ id: i, domain, expected: pool === REAL_DOMAINS });
  }
  return users;
}

async function main() {
  const N = 150;
  const users = buildUsers(N);

  console.log(`Firing ${N} concurrent real domain checks (${users.filter(u => u.expected).length} real domains, ${users.filter(u => !u.expected).length} fake)...\n`);

  const start = Date.now();
  const results = await Promise.all(
    users.map(async (u) => {
      const t0 = Date.now();
      const ok = await domainCanReceiveMail(u.domain);
      return { ...u, ok, ms: Date.now() - t0 };
    })
  );
  const wallMs = Date.now() - start;

  const timings = results.map((r) => r.ms).sort((a, b) => a - b);
  const p50 = timings[Math.floor(timings.length * 0.5)];
  const p95 = timings[Math.floor(timings.length * 0.95)];
  const max = timings[timings.length - 1];
  const min = timings[0];

  let correctnessFailures = 0;
  for (const r of results) {
    if (r.ok !== r.expected) {
      correctnessFailures += 1;
      console.error(`MISMATCH: ${r.domain} -> got ${r.ok}, expected ${r.expected}`);
    }
  }

  // Consistency check: every user hitting the same domain concurrently
  // must get the same answer - no races, no shared-state corruption.
  const byDomain = {};
  for (const r of results) {
    byDomain[r.domain] = byDomain[r.domain] || [];
    byDomain[r.domain].push(r.ok);
  }
  let inconsistent = 0;
  for (const [domain, vals] of Object.entries(byDomain)) {
    const allSame = vals.every((v) => v === vals[0]);
    if (!allSame) {
      inconsistent += 1;
      console.error(`INCONSISTENT across concurrent requests: ${domain} ->`, vals);
    }
  }

  const overCeiling = results.filter((r) => r.ms > 3000 + 200); // backend's own 3000ms cap + slack

  console.log("Timing (ms):");
  console.log(`  min: ${min}   p50: ${p50}   p95: ${p95}   max: ${max}`);
  console.log(`  under 1000ms: ${results.filter((r) => r.ms < 1000).length}/${N}`);
  console.log(`  over 3000ms ceiling: ${overCeiling.length}/${N}`);
  console.log(`\nTotal wall time for ${N} concurrent lookups: ${wallMs}ms`);
  console.log(`Correctness: ${N - correctnessFailures}/${N} correct`);
  console.log(`Consistency: ${Object.keys(byDomain).length - inconsistent}/${Object.keys(byDomain).length} domains fully consistent across their concurrent repeats`);

  console.log("\n===================================");
  const failed = correctnessFailures > 0 || inconsistent > 0 || overCeiling.length > 0;
  if (failed) {
    console.error("FAILED");
    process.exit(1);
  } else {
    console.log("All checks passed.");
  }
}

main();
