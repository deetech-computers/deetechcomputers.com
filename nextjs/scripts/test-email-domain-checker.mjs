import { createEmailDomainChecker } from "../src/lib/email-domain-checker.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let failures = 0;
function assert(cond, msg) {
  if (!cond) {
    failures += 1;
    console.error("FAIL:", msg);
  } else {
    console.log("ok:  ", msg);
  }
}

async function test1_singleInputSucceeds() {
  console.log("\n-- test 1: single input, fast successful check --");
  const checker = createEmailDomainChecker({
    checkFn: async () => ({ ok: true }),
    settleDelayMs: 200,
    timeoutMs: 1000,
  });

  let settled = false;
  let result = null;
  const start = Date.now();
  checker.submit("a@gmail.com", {
    onSettled: () => (settled = true),
    onResult: (r) => (result = r),
  });

  await sleep(350);
  assert(settled, "onSettled fired");
  assert(result && result.ok === true && result.verified === true, "result is ok+verified");
  assert(Date.now() - start < 500, "resolved quickly, well under timeout");
}

async function test2_rapidRetyping_onlyLastFires() {
  console.log("\n-- test 2: rapid retyping - only the LAST value's result should ever fire --");
  const seen = [];
  const checker = createEmailDomainChecker({
    checkFn: async (email) => ({ ok: !email.includes("bad") }),
    settleDelayMs: 150,
    timeoutMs: 1000,
  });

  // Simulate fast keystrokes: each new submit cancels the previous one.
  checker.submit("a", { onSettled: () => seen.push("settled:a"), onResult: (r) => seen.push(["result:a", r]) });
  await sleep(30);
  checker.submit("ab", { onSettled: () => seen.push("settled:ab"), onResult: (r) => seen.push(["result:ab", r]) });
  await sleep(30);
  checker.submit("abc@good.com", { onSettled: () => seen.push("settled:abc"), onResult: (r) => seen.push(["result:abc", r]) });

  await sleep(400);
  assert(seen.filter((s) => s === "settled:a").length === 0, "input #1 (a) never settled - superseded");
  assert(seen.filter((s) => s === "settled:ab").length === 0, "input #2 (ab) never settled - superseded");
  assert(seen.filter((s) => s === "settled:abc").length === 1, "input #3 (abc@good.com) settled exactly once");
  const finalResult = seen.find((s) => Array.isArray(s) && s[0] === "result:abc");
  assert(finalResult && finalResult[1].ok === true, "only the final input's result fired, and it's correct");
}

async function test3_clearThenRetype() {
  console.log("\n-- test 3: type, let it resolve, CLEAR, retype - the exact reported bug scenario --");
  const events = [];
  const checker = createEmailDomainChecker({
    checkFn: async (email) => ({ ok: email === "second@good.com" }),
    settleDelayMs: 150,
    timeoutMs: 1000,
  });

  // Input #1: type a full email and let it fully resolve.
  checker.submit("first@example.com", {
    onSettled: () => events.push("settled:first"),
    onResult: (r) => events.push(["result:first", r]),
  });
  await sleep(300);
  assert(events.includes("settled:first"), "first input settled");
  assert(events.some((e) => Array.isArray(e) && e[0] === "result:first"), "first input produced a result");

  // Clear the field - per the checker's contract, the CALLER is responsible
  // for not submitting empty values (the register page checks this before
  // calling submit()); clearing should instead cancel any pending work.
  checker.cancel();
  await sleep(300);
  assert(
    !events.some((e) => e === "settled:empty" || (Array.isArray(e) && e[0] === "result:empty")),
    "clearing produces no settle/result events of its own"
  );

  // Type a second, different email - THIS is what the user says "wasn't working".
  checker.submit("second@good.com", {
    onSettled: () => events.push("settled:second"),
    onResult: (r) => events.push(["result:second", r]),
  });
  await sleep(300);

  assert(events.includes("settled:second"), "second input DID settle after clear+retype");
  const secondResult = events.find((e) => Array.isArray(e) && e[0] === "result:second");
  assert(secondResult && secondResult[1].ok === true && secondResult[1].verified === true, "second input DID produce a correct, verified result");
}

async function test4_hangingNetwork_hardCeiling() {
  console.log("\n-- test 4: network that never resolves - must fire within timeoutMs, never later --");
  const checker = createEmailDomainChecker({
    checkFn: () => new Promise(() => {}), // never resolves
    settleDelayMs: 100,
    timeoutMs: 800,
  });

  let settledAt = null;
  let resultAt = null;
  let result = null;
  const start = Date.now();
  checker.submit("stuck@example.com", {
    onSettled: () => (settledAt = Date.now() - start),
    onResult: (r) => {
      resultAt = Date.now() - start;
      result = r;
    },
  });

  await sleep(1200);
  assert(settledAt !== null && settledAt < 200, `settled quickly (${settledAt}ms)`);
  assert(resultAt !== null, "onResult DID fire even though checkFn never resolved");
  assert(resultAt >= 800 && resultAt < 950, `onResult fired right at the ceiling (~800ms), not indefinitely (actual: ${resultAt}ms)`);
  assert(result && result.ok === true && result.verified === false, "fell back to ok:true, verified:false (local validation wins)");
}

async function test5_rejectingNetwork() {
  console.log("\n-- test 5: network call throws immediately --");
  const checker = createEmailDomainChecker({
    checkFn: async () => {
      throw new Error("network down");
    },
    settleDelayMs: 100,
    timeoutMs: 1000,
  });

  let result = null;
  const start = Date.now();
  checker.submit("x@example.com", {
    onSettled: () => {},
    onResult: (r) => (result = r),
  });

  await sleep(300);
  assert(result && result.ok === true && result.verified === false, "immediate failure falls back to ok:true, verified:false");
  assert(Date.now() - start < 500, "did NOT wait for the full timeout when the failure was immediate");
}

async function test6_badDomainReported() {
  console.log("\n-- test 6: a real, verified 'bad domain' result must still say ok:false --");
  const checker = createEmailDomainChecker({
    checkFn: async () => ({ ok: false }),
    settleDelayMs: 100,
    timeoutMs: 1000,
  });

  let result = null;
  checker.submit("junk@thisdoesnotexist.zzz", {
    onSettled: () => {},
    onResult: (r) => (result = r),
  });
  await sleep(300);
  assert(result && result.ok === false && result.verified === true, "genuinely bad domain correctly reported as ok:false, verified:true");
}

async function test7_concurrentIndependentCheckers() {
  console.log("\n-- test 7: many independent checker instances run concurrently without cross-talk --");
  const N = 25;
  const results = await Promise.all(
    Array.from({ length: N }, (_, i) => {
      const email = i % 5 === 0 ? "bad@junk.zzz" : `user${i}@good.com`;
      const checker = createEmailDomainChecker({
        checkFn: async (e) => ({ ok: !e.includes("junk") }),
        settleDelayMs: 20 + (i % 7) * 5,
        timeoutMs: 1000,
      });
      return new Promise((resolve) => {
        checker.submit(email, {
          onSettled: () => {},
          onResult: (r) => resolve({ email, r }),
        });
      });
    })
  );

  let ok = true;
  for (const { email, r } of results) {
    const expected = !email.includes("junk");
    if (r.ok !== expected || r.verified !== true) {
      ok = false;
      console.error("  mismatch:", email, r);
    }
  }
  assert(ok, `all ${N} concurrent independent checkers resolved correctly with no cross-talk`);
}

async function main() {
  await test1_singleInputSucceeds();
  await test2_rapidRetyping_onlyLastFires();
  await test3_clearThenRetype();
  await test4_hangingNetwork_hardCeiling();
  await test5_rejectingNetwork();
  await test6_badDomainReported();
  await test7_concurrentIndependentCheckers();

  console.log("\n===================================");
  if (failures > 0) {
    console.error(`${failures} assertion(s) FAILED`);
    process.exit(1);
  } else {
    console.log("All assertions passed.");
  }
}

main();
