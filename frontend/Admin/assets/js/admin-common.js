(function () {
  const { API_BASE, BASE_URL, showToast } = window.CONFIG || {};

  function ensureAdminConfirmStyles() {
    if (document.getElementById("adminConfirmStyles")) return;
    const style = document.createElement("style");
    style.id = "adminConfirmStyles";
    style.textContent = `
      .admin-confirm-overlay {
        position: fixed;
        inset: 0;
        background: rgba(2, 6, 23, 0.56);
        z-index: 1400;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
      .admin-confirm-card {
        width: min(460px, 96vw);
        background: #fff;
        border-radius: 14px;
        border: 1px solid #dbe2ef;
        box-shadow: 0 18px 44px rgba(15, 23, 42, 0.24);
        padding: 16px;
      }
      .admin-confirm-card h3 {
        margin: 0 0 8px;
        color: #0f172a;
      }
      .admin-confirm-card p {
        margin: 0;
        color: #334155;
        white-space: pre-line;
      }
      .admin-confirm-actions {
        margin-top: 14px;
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }
      .admin-confirm-btn {
        border: 1px solid #d4dbe8;
        background: #fff;
        color: #0f172a;
        border-radius: 10px;
        padding: 8px 12px;
        font-weight: 700;
        cursor: pointer;
      }
      .admin-confirm-btn.danger {
        background: #b91c1c;
        color: #fff;
        border-color: #b91c1c;
      }
    `;
    document.head.appendChild(style);
  }

  function confirmAction(message, opts = {}) {
    return new Promise((resolve) => {
      const title = String(opts.title || "Please Confirm");
      const confirmText = String(opts.confirmText || "Confirm");
      const cancelText = String(opts.cancelText || "Cancel");

      ensureAdminConfirmStyles();
      const overlay = document.createElement("div");
      overlay.className = "admin-confirm-overlay";
      overlay.innerHTML = `
        <div class="admin-confirm-card" role="dialog" aria-modal="true" aria-label="${title}">
          <h3>${title}</h3>
          <p>${String(message || "")}</p>
          <div class="admin-confirm-actions">
            <button type="button" class="admin-confirm-btn" data-admin-confirm-cancel>${cancelText}</button>
            <button type="button" class="admin-confirm-btn danger" data-admin-confirm-ok>${confirmText}</button>
          </div>
        </div>
      `;

      const cleanup = (value) => {
        overlay.remove();
        resolve(Boolean(value));
      };

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) cleanup(false);
      });

      overlay.querySelector("[data-admin-confirm-cancel]")?.addEventListener("click", () => cleanup(false));
      overlay.querySelector("[data-admin-confirm-ok]")?.addEventListener("click", () => cleanup(true));

      const onKeyDown = (e) => {
        if (e.key === "Escape") {
          document.removeEventListener("keydown", onKeyDown);
          cleanup(false);
        }
      };
      document.addEventListener("keydown", onKeyDown, { once: true });
      document.body.appendChild(overlay);
    });
  }

  function setActiveAdminNav() {
    try {
      const current = (window.location.pathname.split("/").pop() || "").toLowerCase();
      document.querySelectorAll(".admin-nav a").forEach((link) => {
        const href = String(link.getAttribute("href") || "").toLowerCase();
        if (href === current) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        }
      });
    } catch {}
  }

  async function requireAdmin() {
    let user = window.auth?.getUser?.();
    if (user && user.role === "admin") return true;

    const token = window.auth?.getToken?.();
    if (token && API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          user = await res.json();
          if (user && user.email) {
            window.auth?.setUser?.({
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            });
            if (user.role === "admin") return true;
          }
        }
      } catch {}
    }

    window.location.href = "../login.html";
    return false;
  }

  async function apiFetch(url, options = {}) {
    const token = window.auth?.getToken?.();
    const headers = { ...(options.headers || {}) };

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, { ...options, headers });
    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }
    if (!res.ok) {
      const msg = data.message || data.raw || "Request failed";
      if (showToast) showToast(msg, "error");
      throw new Error(msg);
    }
    return data;
  }

  window.AdminAPI = {
    API_BASE,
    BASE_URL,
    requireAdmin,
    apiFetch,
    toast: showToast,
    confirmAction,
  };

  setActiveAdminNav();
})();
