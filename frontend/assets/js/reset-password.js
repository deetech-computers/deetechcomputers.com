// assets/js/reset-password.js
(function () {
  const { API_BASE_AUTH, showToast } = window.CONFIG || {};
  const form = document.getElementById("resetPasswordForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (newPassword.length < 6) {
      return showToast("Password must be at least 6 characters.", "error");
    }
    if (newPassword !== confirmPassword) {
      return showToast("Passwords do not match.", "error");
    }

    const params = new URLSearchParams(window.location.search);
    let token = params.get("token");
    if (!token) {
      const parts = window.location.pathname.split("/").filter(Boolean);
      const last = parts[parts.length - 1] || "";
      token = last.includes("reset-password") ? null : last;
    }
    if (!token) {
      return showToast("Invalid or missing reset token.", "error");
    }

    try {
      const res = await fetch(`${API_BASE_AUTH}/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Password updated successfully.", "success");
        setTimeout(() => (location.href = "login.html"), 2000);
      } else {
        showToast(data.message || "Reset failed. Try again.", "error");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      showToast("Something went wrong. Please try again later.", "error");
    }
  });
})();
