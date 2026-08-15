// Framework-agnostic debounced email-domain checker. Kept out of React so
// the cancellation/timeout logic can be driven with real timers in a plain
// script and actually proven correct, rather than trusted by inspection.
//
// Contract:
// - Only the most recently submitted email's result is ever reported -
//   every older in-flight check (its settle timer AND its network request)
//   is cancelled the instant a newer one comes in.
// - onResult always fires within `timeoutMs` of onSettled, no matter what
//   checkFn does (hangs, rejects, or the browser is offline) - it never
//   makes the caller wait past that ceiling.
// - When the real check can't be completed (offline, timeout, error),
//   onResult reports `verified: false` with `ok: true` - i.e. fall back to
//   whatever the caller's local format validation already decided, instead
//   of blocking on a network check that isn't working.
export function createEmailDomainChecker({ checkFn, settleDelayMs = 2000, timeoutMs = 2500 } = {}) {
  let generation = 0;
  let settleTimer = null;
  let activeController = null;

  function cancelPending() {
    generation += 1;
    if (settleTimer) {
      clearTimeout(settleTimer);
      settleTimer = null;
    }
    if (activeController) {
      activeController.abort();
      activeController = null;
    }
  }

  function runCheck(email, myGeneration, onResult) {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      onResult({ ok: true, verified: false });
      return;
    }

    const controller = new AbortController();
    activeController = controller;
    let settled = false;

    const hardTimer = setTimeout(() => {
      if (settled) return;
      settled = true;
      controller.abort();
      onResult({ ok: true, verified: false });
    }, timeoutMs);

    Promise.resolve()
      .then(() => checkFn(email, controller.signal))
      .then((result) => {
        if (settled || myGeneration !== generation) return;
        settled = true;
        clearTimeout(hardTimer);
        onResult({ ok: Boolean(result?.ok), verified: true });
      })
      .catch(() => {
        if (settled || myGeneration !== generation) return;
        settled = true;
        clearTimeout(hardTimer);
        onResult({ ok: true, verified: false });
      });
  }

  // Call on every keystroke/value change. `onSettled` fires once the value
  // has been idle for `settleDelayMs`; `onResult` fires once with the final
  // { ok, verified } outcome for that value, always within timeoutMs of
  // onSettled.
  function submit(email, { onSettled, onResult }) {
    cancelPending();
    const myGeneration = generation;

    settleTimer = setTimeout(() => {
      if (myGeneration !== generation) return;
      onSettled();
      runCheck(email, myGeneration, onResult);
    }, settleDelayMs);
  }

  return { submit, cancel: cancelPending };
}
