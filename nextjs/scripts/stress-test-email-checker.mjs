import { createEmailDomainChecker } from "../src/lib/email-domain-checker.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// A mock network layer with controllable behavior per case, so we can drive
// the checker through every failure mode it needs to survive, at volume.
// "slow" behaves like "ok" but resolves AFTER the ceiling - proves that even
// a check that would have eventually said "valid" still doesn't get to make
// the user wait past the timeout.
function makeCheckFn(behavior, delayMs) {
  return async () => {
    if (behavior === "hang") {
      await new Promise(() => {}); // never resolves
      return { ok: true }; // unreachable
    }
    await sleep(delayMs);
    if (behavior === "throw") throw new Error("simulated network failure");
    if (behavior === "ok" || behavior === "slow") return { ok: true };
    if (behavior === "bad") return { ok: false };
    throw new Error("unknown behavior");
  };
}

const BEHAVIORS = ["ok", "bad", "throw", "hang", "slow"];

function buildCases(n, { settleDelayMs, timeoutMs }) {
  const cases = [];
  for (let i = 0; i < n; i++) {
    const behavior = BEHAVIORS[i % BEHAVIORS.length];
    let delayMs;
    if (behavior === "ok" || behavior === "bad") {
      // Realistic latency comfortably under the ceiling, at varying
      // fractions of it - these should always complete and be verified.
      const fractions = [0.05, 0.15, 0.3, 0.45, 0.65];
      delayMs = Math.round(timeoutMs * fractions[i % fractions.length]);
    } else if (behavior === "throw") {
      delayMs = Math.round(timeoutMs * 0.05); // fails fast regardless of ceiling
    } else if (behavior === "slow") {
      delayMs = Math.round(timeoutMs * 1.6); // would succeed, but only after the ceiling
    } else {
      delayMs = 0; // hang - never resolves, irrelevant
    }
    cases.push({
      id: i,
      email: `user${i}@case-${behavior}-${i}.test`,
      behavior,
      delayMs,
      settleDelayMs,
      timeoutMs,
    });
  }
  return cases;
}

async function runCase(c) {
  const checker = createEmailDomainChecker({
    checkFn: makeCheckFn(c.behavior, c.delayMs),
    settleDelayMs: c.settleDelayMs,
    timeoutMs: c.timeoutMs,
  });

  const start = Date.now();
  let settledAt = null;
  const resultPromise = new Promise((resolve) => {
    checker.submit(c.email, {
      onSettled: () => {
        settledAt = Date.now() - start;
      },
      onResult: (result) => {
        resolve({ result, resultAt: Date.now() - start });
      },
    });
  });

  const { result, resultAt } = await resultPromise;

  // What SHOULD have happened, given the behavior:
  let expected;
  if (c.behavior === "ok") expected = { ok: true, verified: true };
  else if (c.behavior === "bad") expected = { ok: false, verified: true };
  else expected = { ok: true, verified: false }; // throw, hang, or slow -> fail open, unverified

  const checkPhaseMs = resultAt - settledAt;
  const schedulingSlack = Math.min(200, Math.max(40, c.timeoutMs * 0.2));
  const withinCeiling = checkPhaseMs <= c.timeoutMs + schedulingSlack;

  const pass =
    settledAt !== null &&
    result.ok === expected.ok &&
    result.verified === expected.verified &&
    withinCeiling;

  return { ...c, settledAt, resultAt, checkPhaseMs, result, expected, pass };
}

async function main() {
  const TOTAL = 300;
  const CONCURRENCY_BATCH = 40; // run in waves so timers stay accurate under load

  console.log(`Running ${TOTAL} test cases (fast timing: settle=15ms, timeout=120ms) in batches of ${CONCURRENCY_BATCH}...\n`);

  const fastCases = buildCases(TOTAL, { settleDelayMs: 15, timeoutMs: 120 });
  const fastResults = [];
  for (let i = 0; i < fastCases.length; i += CONCURRENCY_BATCH) {
    const batch = fastCases.slice(i, i + CONCURRENCY_BATCH);
    const batchResults = await Promise.all(batch.map(runCase));
    fastResults.push(...batchResults);
  }

  const fastFailures = fastResults.filter((r) => !r.pass);
  const byBehavior = {};
  for (const r of fastResults) {
    byBehavior[r.behavior] = byBehavior[r.behavior] || { total: 0, pass: 0, maxCheckPhaseMs: 0 };
    byBehavior[r.behavior].total += 1;
    if (r.pass) byBehavior[r.behavior].pass += 1;
    byBehavior[r.behavior].maxCheckPhaseMs = Math.max(byBehavior[r.behavior].maxCheckPhaseMs, r.checkPhaseMs);
  }

  console.log("Results by behavior (fast-timing run):");
  for (const [behavior, stats] of Object.entries(byBehavior)) {
    console.log(
      `  ${behavior.padEnd(6)} ${stats.pass}/${stats.total} passed, max check-phase latency: ${stats.maxCheckPhaseMs}ms`
    );
  }
  console.log(`\nFast run: ${fastResults.length - fastFailures.length}/${fastResults.length} passed`);
  if (fastFailures.length) {
    console.log("Failures:");
    fastFailures.slice(0, 10).forEach((f) => console.log("  ", JSON.stringify(f)));
  }

  // Second pass: a sample using the REAL production timing constants
  // (2000ms settle / 2800ms timeout) to confirm actual configured values
  // hold under concurrent load too, not just the scaled-down fast version.
  const REAL_SAMPLE = 40;
  console.log(`\nRunning ${REAL_SAMPLE} cases at REAL production timing (settle=2000ms, timeout=2800ms), all concurrently...`);
  const realCases = buildCases(REAL_SAMPLE, { settleDelayMs: 2000, timeoutMs: 2800 });
  const realStart = Date.now();
  const realResults = await Promise.all(realCases.map(runCase));
  const realWallMs = Date.now() - realStart;

  const realFailures = realResults.filter((r) => !r.pass);
  const maxResultAt = Math.max(...realResults.map((r) => r.resultAt));
  console.log(`Real-timing run: ${realResults.length - realFailures.length}/${realResults.length} passed`);
  console.log(`Total wall time for ${REAL_SAMPLE} concurrent real-timing cases: ${realWallMs}ms`);
  console.log(`Slowest individual case resolved at: ${maxResultAt}ms from its own start (settle 2000ms + check phase)`);
  if (realFailures.length) {
    console.log("Failures:");
    realFailures.forEach((f) => console.log("  ", JSON.stringify(f)));
  }

  const allFailures = fastFailures.length + realFailures.length;
  console.log("\n===================================");
  console.log(`TOTAL: ${TOTAL + REAL_SAMPLE} cases run, ${allFailures} failed`);
  if (allFailures > 0) process.exit(1);
}

main();
