// assets/js/messages.js
document.addEventListener("DOMContentLoaded", async () => {
  const messagesList = document.getElementById("messages-list");
  if (!messagesList) return;

  const { API_BASE_SUPPORT, showToast } = window.CONFIG || {};
  const { getToken, getUser } = window.auth || {};

  const token = typeof getToken === "function" ? getToken() : null;
  const user = typeof getUser === "function" ? getUser() : null;

  if (!token || !user || user.role !== "admin") {
    messagesList.innerHTML = `<p>Admin access required.</p>`;
    return;
  }

  messagesList.innerHTML = `<p>Loading messages...</p>`;

  try {
    const res = await fetch(`${API_BASE_SUPPORT}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to load messages");
    }

    if (!Array.isArray(data) || data.length === 0) {
      messagesList.innerHTML = `<p>No customer messages yet.</p>`;
      return;
    }

    messagesList.innerHTML = "";
    data.forEach((msg) => {
      const card = document.createElement("div");
      card.className = "message-card";
      card.innerHTML = `
        <h3>${msg.name || "Customer"}</h3>
        <small>${msg.email || "No email"} | ${new Date(msg.createdAt || Date.now()).toLocaleString()}</small>
        <p><strong>Subject:</strong> ${msg.subject || "General"}</p>
        <p>${msg.message || ""}</p>
      `;
      messagesList.appendChild(card);
    });
  } catch (err) {
    console.error("Messages fetch error:", err);
    if (typeof showToast === "function") {
      showToast("Error loading messages.", "error");
    }
    messagesList.innerHTML = `<p>Unable to load messages.</p>`;
  }
});
