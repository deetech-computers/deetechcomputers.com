// assets/js/contact.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const { API_BASE_SUPPORT, showToast } = window.CONFIG || {};
  const getToken = window.auth?.getToken;
  const getUser = window.auth?.getUser;

  const supportListEl = document.getElementById("supportList");
  const supportEmptyEl = document.getElementById("supportEmpty");
  const supportNoteEl = document.getElementById("supportNote");
  const supportRefreshEl = document.getElementById("supportRefresh");
  const supportInboxEl = document.getElementById("supportInbox");
  const supportToggleEl = document.getElementById("supportToggleInbox");
  const supportPanelEl = document.getElementById("supportInboxPanel");
  const contactFormCard = document.getElementById("contactFormCard");
  let latestTicketId = "";
  let inboxExpanded = false;

  function setInboxExpanded(expanded) {
    inboxExpanded = Boolean(expanded);
    if (supportPanelEl) {
      supportPanelEl.hidden = !inboxExpanded;
    }
    if (supportToggleEl) {
      supportToggleEl.setAttribute("aria-expanded", inboxExpanded ? "true" : "false");
      supportToggleEl.textContent = inboxExpanded ? "Hide chat" : "Click to view chat";
    }
  }

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
  }

  function resolveImage(src) {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
      return src;
    }
    if (src.startsWith("/uploads") || src.startsWith("uploads/")) {
      return `${window.CONFIG?.BASE_URL || ""}${src.startsWith("/") ? "" : "/"}${src}`;
    }
    return src;
  }

  function flattenSupportMessages(tickets = []) {
    const rows = [];
    (Array.isArray(tickets) ? tickets : []).forEach((t) => {
      const baseTime = t.createdAt || t.updatedAt || new Date().toISOString();
      let messages = Array.isArray(t.messages) ? [...t.messages] : [];
      if (!messages.length && t.message) {
        messages.push({
          sender: "user",
          text: t.message,
          imageUrl: t.imageUrl,
          createdAt: baseTime,
        });
      }
      if (t.response) {
        const already = messages.some((m) => m.sender === "admin" && m.text === t.response);
        if (!already) {
          messages.push({
            sender: "admin",
            text: t.response,
            createdAt: t.updatedAt || baseTime,
          });
        }
      }
      messages.forEach((m) => {
        if (!m?.text && !m?.imageUrl) return;
        rows.push({
          ticketId: t._id,
          subject: t.subject || "Support Request",
          sender: m.sender === "admin" ? "admin" : "user",
          text: m.text || "",
          imageUrl: m.imageUrl || "",
          createdAt: m.createdAt || baseTime,
        });
      });
    });
    rows.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    return rows;
  }

  function renderSupport(tickets = []) {
    if (!supportListEl || !supportEmptyEl) return;
    supportListEl.innerHTML = "";
    const sortedTickets = [...(Array.isArray(tickets) ? tickets : [])].sort(
      (a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
    );
    latestTicketId = sortedTickets[0]?._id || "";

    if (supportInboxEl) supportInboxEl.classList.add("is-active");
    if (contactFormCard) contactFormCard.style.display = sortedTickets.length ? "none" : "block";

    const messages = flattenSupportMessages(sortedTickets);
    if (!messages.length) {
      supportEmptyEl.style.display = "block";
    } else {
      supportEmptyEl.style.display = "none";
    }

    const wrapper = document.createElement("div");
    wrapper.className = "support-conversation";
    wrapper.innerHTML = `
      <div class="support-thread support-thread-unified" id="supportThreadUnified"></div>
      <form class="support-reply-form support-reply-form-unified" data-id="${latestTicketId}">
        <textarea name="reply" placeholder="Write a message to support (Shift+Enter for new line)"></textarea>
        <input type="file" name="replyImage" accept="image/*">
        <div class="support-reply-actions">
          <button type="submit" class="support-reply-btn">Send Message</button>
        </div>
      </form>
    `;
    supportListEl.appendChild(wrapper);

    const thread = wrapper.querySelector("#supportThreadUnified");
    if (!thread) return;

    messages.forEach((m) => {
      const bubble = document.createElement("div");
      bubble.className = `support-bubble ${m.sender === "admin" ? "admin" : "user"}`;
      const label = document.createElement("div");
      label.className = "support-bubble-label";
      label.textContent = m.sender === "admin" ? "Admin" : "You";
      bubble.appendChild(label);
      if (m.text) {
        const p = document.createElement("div");
        p.textContent = m.text;
        bubble.appendChild(p);
      }
      if (m.imageUrl) {
        const img = document.createElement("img");
        img.src = resolveImage(m.imageUrl);
        img.alt = "Support attachment";
        bubble.appendChild(img);
      }
      const time = document.createElement("div");
      time.className = "support-bubble-time";
      time.textContent = formatDate(m.createdAt);
      bubble.appendChild(time);
      thread.appendChild(bubble);
    });

    requestAnimationFrame(() => {
      thread.scrollTop = thread.scrollHeight;
    });
  }

  async function loadSupport() {
    if (!API_BASE_SUPPORT || !getToken || !supportListEl) return;
    const token = getToken();
    if (!token) {
      renderSupport([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_SUPPORT}/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to load support messages.", "error");
        return;
      }
      renderSupport(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load support messages.", "error");
    }
  }

  if (supportRefreshEl) {
    supportRefreshEl.addEventListener("click", loadSupport);
  }

  supportToggleEl?.addEventListener("click", () => {
    setInboxExpanded(!inboxExpanded);
  });

  const user = typeof getUser === "function" ? getUser() : null;
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  if (user) {
    if (emailInput && user.email) {
      emailInput.value = user.email;
      emailInput.readOnly = true;
    }
    if (nameInput && user.name) {
      nameInput.value = user.name;
    }
  }
  if (supportNoteEl) {
    supportNoteEl.textContent = user
      ? "Your messages and admin replies will appear here."
      : "Login to see admin replies here after you send a message.";
  }
  setInboxExpanded(false);
  if (user) loadSupport();

  document.querySelectorAll(".support-faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".support-faq-item");
      if (!item) return;
      const isOpen = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  async function uploadSupportImage(file) {
    const token = typeof getToken === "function" ? getToken() : null;
    if (!token) {
      showToast("Login required to upload images.", "info");
      return "";
    }
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_BASE_SUPPORT}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Image upload failed.", "error");
      return "";
    }
    return data.imageUrl || "";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const message = document.getElementById("message")?.value.trim();
    const attachment = document.getElementById("attachment");
    const file = attachment?.files?.[0];

    if (!name || !email || !message) {
      showToast("Please fill in all fields before submitting.", "error");
      return;
    }

    try {
      const token = typeof getToken === "function" ? getToken() : null;
      let imageUrl = "";
      if (file) {
        if (!token) {
          showToast("Login required to attach images.", "info");
          return;
        }
        imageUrl = await uploadSupportImage(file);
        if (!imageUrl) return;
      }
      const res = await fetch(`${API_BASE_SUPPORT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name,
          email,
          subject: "Website Contact",
          message,
          imageUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(`Thank you, ${name}! Your message has been sent.`, "success");
        form.reset();
        await loadSupport();
      } else {
        showToast(data.message || "Failed to save message.", "error");
        console.error(data);
      }
    } catch (err) {
      console.error("Error:", err);
      showToast("Failed to send message. Please try again later.", "error");
    }
  });

  if (supportListEl) {
    supportListEl.addEventListener("keydown", (e) => {
      if (!e.target.classList?.contains("support-reply-form") && !e.target.closest(".support-reply-form")) return;
      const textarea = e.target.closest("textarea[name='reply']");
      if (!textarea) return;
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const formEl = textarea.closest("form");
        if (formEl) formEl.requestSubmit();
      }
    });

    supportListEl.addEventListener("submit", async (e) => {
      if (!e.target.classList.contains("support-reply-form")) return;
      e.preventDefault();
      const token = typeof getToken === "function" ? getToken() : null;
      if (!token) {
        showToast("Login to reply.", "info");
        return;
      }
      const formEl = e.target;
      const ticketId = formEl.dataset.id;
      const textarea = formEl.querySelector("textarea[name='reply']");
      const fileInput = formEl.querySelector("input[name='replyImage']");
      const replyText = textarea?.value.trim() || "";
      const replyFile = fileInput?.files?.[0];
      if (!replyText && !replyFile) {
        showToast("Please type a message or attach an image.", "info");
        return;
      }
      let imageUrl = "";
      if (replyFile) {
        imageUrl = await uploadSupportImage(replyFile);
        if (!imageUrl) return;
      }
      try {
        let res;
        if (ticketId) {
          res = await fetch(`${API_BASE_SUPPORT}/${ticketId}/reply`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              message: replyText,
              imageUrl,
            }),
          });
        } else {
          const currentUser = typeof getUser === "function" ? getUser() : null;
          res = await fetch(`${API_BASE_SUPPORT}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: currentUser?.name || "Customer",
              email: currentUser?.email || "",
              subject: "Support Inbox",
              message: replyText,
              imageUrl,
            }),
          });
        }
        const data = await res.json();
        if (!res.ok) {
          showToast(data.message || "Failed to send reply.", "error");
          return;
        }
        if (textarea) textarea.value = "";
        if (fileInput) fileInput.value = "";
        await loadSupport();
      } catch (err) {
        console.error(err);
        showToast("Failed to send reply.", "error");
      }
    });
  }
});
