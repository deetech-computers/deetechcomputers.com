// assets/js/edit-account.js
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("updateProfileForm");
  const nameInput = document.getElementById("updateName");
  const emailInput = document.getElementById("updateEmail");
  const messageDiv = document.getElementById("editAccountMessage");

  const { API_BASE_USERS, showToast } = window.CONFIG || {};
  const { getToken, clearUser, clearToken, getUser, setUser, setToken } =
    window.auth || {};

  function setMessage(msg, ok = true) {
    if (!messageDiv) return;
    messageDiv.textContent = msg;
    messageDiv.style.color = ok ? "green" : "red";
  }

  const token = typeof getToken === "function" ? getToken() : null;
  const isOffline = () => typeof navigator !== "undefined" && navigator.onLine === false;
  if (!token) {
    if (isOffline()) {
      setMessage("You're offline. Sign in when internet is back.", false);
      return;
    }
    location.href = "login.html";
    return;
  }

  // 1. Load current user info
  try {
    const res = await fetch(`${API_BASE_USERS}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to load profile");
    const user = await res.json();
    if (nameInput) nameInput.value = user.name || "";
  if (emailInput) {
      emailInput.value = user.email || "";
      emailInput.disabled = true;
    }
  } catch (err) {
    console.error(err);
    setMessage("Error loading account info.", false);
  }

  // 2. Handle form submit
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      setMessage("");

      const updatedData = {
        name: nameInput?.value?.trim(),
      };

      try {
        const res = await fetch(`${API_BASE_USERS}/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        });

        if (res.status === 401 || res.status === 403) {
          if (isOffline()) {
            setMessage("You're offline. Reconnect to continue.", false);
            return;
          }
          if (typeof clearUser === "function") clearUser();
          if (typeof clearToken === "function") clearToken();
          location.href = "login.html";
          return;
        }

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Update failed");
        }

        const data = await res.json();
        const existing = typeof getUser === "function" ? getUser() : {};
        const updatedUser = {
          _id: data._id || existing?._id,
          name: data.name || existing?.name,
          email: data.email || existing?.email,
          role: data.role || existing?.role,
        };
        if (typeof setUser === "function") setUser(updatedUser);
        if (data.token && typeof setToken === "function") setToken(data.token);
        setMessage("Profile updated successfully!", true);
        if (typeof showToast === "function") {
          showToast("Profile updated successfully!", "success");
        }
        setTimeout(() => (window.location.href = "account.html"), 1200);
      } catch (err) {
        console.error(err);
        setMessage(err.message || "Update failed", false);
      }
    });
  }
});
