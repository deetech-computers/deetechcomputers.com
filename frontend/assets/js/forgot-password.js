// assets/js/forgot-password.js
(function () {
  const { API_BASE_AUTH } = window.CONFIG || {};

  document.getElementById("forgotForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const messageEl = document.getElementById("message");
    const submitBtn = e.target.querySelector("button[type='submit']") || e.target.querySelector("button");

    if (!email) {
      if (messageEl) {
        messageEl.textContent = "Please enter your email.";
        messageEl.className = "message error";
      }
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    if (messageEl) {
      messageEl.textContent = "Sending request...";
      messageEl.className = "message";
    }

    try {
      const res = await fetch(`${API_BASE_AUTH}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (messageEl) {
        if (res.ok) {
          messageEl.textContent = "Reset link sent. Check your email.";
          messageEl.className = "message success";
          e.target.reset();
        } else {
          messageEl.textContent = data.message || "Something went wrong";
          messageEl.className = "message error";
        }
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      if (messageEl) {
        messageEl.textContent = "Server error. Try again later.";
        messageEl.className = "message error";
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
})();
