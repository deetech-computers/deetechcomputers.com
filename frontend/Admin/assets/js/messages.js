(async function () {
  const { requireAdmin, apiFetch, API_BASE, toast } = window.AdminAPI || {};
  if (!requireAdmin || !(await requireAdmin())) return;

  const els = {
    tbody: document.querySelector("#messagesTable tbody"),
    mobileList: document.getElementById("mobileMessagesList"),
    emptyState: document.getElementById("messagesEmptyState"),
    searchInput: document.getElementById("messagesSearchInput"),
    statusFilter: document.getElementById("messagesStatusFilter"),
    summaryTotal: document.getElementById("summaryTotalMessages"),
    summaryNew: document.getElementById("summaryNewMessages"),
  };

  const state = {
    messages: [],
    grouped: [],
    filtered: [],
    expandedUsers: new Set(),
  };

  function text(v) {
    return String(v ?? "").trim();
  }

  function formatDate(v) {
    const d = v ? new Date(v) : null;
    if (!d || Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  }

  function statusOptions(current) {
    const list = ["new", "in-progress", "resolved"];
    return list
      .map((s) => `<option value="${s}" ${s === current ? "selected" : ""}>${s}</option>`)
      .join("");
  }

  function getGroupKey(msg) {
    return text(msg.email || "").toLowerCase() || `anon-${text(msg._id)}`;
  }

  function buildGroups(messages) {
    const map = new Map();
    messages.forEach((m) => {
      const key = getGroupKey(m);
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: text(m.name) || "Unknown",
          email: text(m.email) || "-",
          messages: [],
          latestAt: m.updatedAt || m.createdAt,
          newCount: 0,
        });
      }
      const g = map.get(key);
      g.messages.push(m);
      if (new Date(m.updatedAt || m.createdAt || 0) > new Date(g.latestAt || 0)) {
        g.latestAt = m.updatedAt || m.createdAt;
      }
      if (text(m.status) === "new") g.newCount += 1;
    });

    const groups = Array.from(map.values()).map((g) => {
      g.messages.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
      return g;
    });

    groups.sort((a, b) => new Date(b.latestAt || 0) - new Date(a.latestAt || 0));
    return groups;
  }

  function groupMatchesFilters(group) {
    const q = text(els.searchInput?.value).toLowerCase();
    const status = text(els.statusFilter?.value);

    const hasStatus = !status || group.messages.some((m) => text(m.status) === status);
    if (!hasStatus) return false;

    if (!q) return true;
    const groupLookup = [group.name, group.email].join(" ").toLowerCase();
    if (groupLookup.includes(q)) return true;
    return group.messages.some((m) =>
      [text(m.subject), text(m.message), text(m.response)].join(" ").toLowerCase().includes(q)
    );
  }

  function renderGroupDetails(group) {
    return group.messages
      .map(
        (m) => `
        <div class="msg-thread-item">
          <div class="msg-thread-head">
            <strong>${text(m.subject) || "-"}</strong>
            <small>${formatDate(m.updatedAt || m.createdAt)}</small>
          </div>
          <div class="msg-thread-body">${text(m.message) || "-"}</div>
          <div class="msg-thread-controls">
            <select data-id="${m._id}" class="msg-status">
              ${statusOptions(text(m.status) || "new")}
            </select>
            <textarea class="msg-response" data-response="${m._id}" rows="2" placeholder="Reply to customer. Press Enter to save, Shift+Enter for new line.">${text(m.response)}</textarea>
            <button class="btn-admin" data-save="${m._id}">Save</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  function renderTable(groups) {
    if (!els.tbody) return;
    els.tbody.innerHTML = "";

    groups.forEach((group) => {
      const isOpen = state.expandedUsers.has(group.key);
      const tr = document.createElement("tr");
      tr.className = "msg-group-row";
      tr.innerHTML = `
        <td>
          <div class="msg-from">
            <strong>${group.name}</strong>
            <small>${group.email}</small>
          </div>
        </td>
        <td>${group.messages.length}</td>
        <td>${group.newCount}</td>
        <td>${formatDate(group.latestAt)}</td>
        <td>
          <button class="btn-admin btn-ghost" data-toggle-group="${group.key}">
            ${isOpen ? "Hide Thread" : "View Thread"}
          </button>
        </td>
        <td></td>
      `;
      els.tbody.appendChild(tr);

      if (isOpen) {
        const details = document.createElement("tr");
        details.className = "msg-group-details-row";
        details.innerHTML = `
          <td colspan="6">
            <div class="msg-thread-wrap">
              ${renderGroupDetails(group)}
            </div>
          </td>
        `;
        els.tbody.appendChild(details);
      }
    });
  }

  function renderMobile(groups) {
    if (!els.mobileList) return;
    els.mobileList.innerHTML = "";

    groups.forEach((group) => {
      const isOpen = state.expandedUsers.has(group.key);
      const card = document.createElement("article");
      card.className = "message-card";
      card.innerHTML = `
        <div class="message-card-header">
          <div class="msg-from">
            <strong>${group.name}</strong>
            <small>${group.email}</small>
          </div>
          <button class="btn-admin btn-ghost" data-toggle-group="${group.key}">
            ${isOpen ? "Hide" : "Open"}
          </button>
        </div>
        <div class="message-card-body">
          <div class="message-row">
            <div class="message-label">Messages</div>
            <div class="message-value">${group.messages.length}</div>
          </div>
          <div class="message-row">
            <div class="message-label">New</div>
            <div class="message-value">${group.newCount}</div>
          </div>
          <div class="message-row">
            <div class="message-label">Latest</div>
            <div class="message-value">${formatDate(group.latestAt)}</div>
          </div>
          ${
            isOpen
              ? `<div class="msg-thread-wrap mobile">
                  ${renderGroupDetails(group)}
                </div>`
              : ""
          }
        </div>
      `;
      els.mobileList.appendChild(card);
    });
  }

  function renderSummary() {
    const filteredMessageCount = state.filtered.reduce((sum, g) => sum + g.messages.length, 0);
    const newCount = state.messages.filter((m) => text(m.status) === "new").length;
    if (els.summaryTotal) els.summaryTotal.textContent = String(filteredMessageCount);
    if (els.summaryNew) els.summaryNew.textContent = String(newCount);
  }

  function render() {
    state.grouped = buildGroups(state.messages);
    state.filtered = state.grouped.filter(groupMatchesFilters);
    renderSummary();
    renderTable(state.filtered);
    renderMobile(state.filtered);
    els.emptyState?.classList.toggle("hidden", state.filtered.length > 0);
  }

  async function saveMessage(id) {
    const statusEl = document.querySelector(`.msg-status[data-id="${id}"]`);
    const responseEl = document.querySelector(`[data-response="${id}"]`);
    const status = statusEl?.value || "new";
    const response = responseEl?.value || "";
    await apiFetch(`${API_BASE}/support/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status, response }),
    });
    const idx = state.messages.findIndex((m) => String(m._id) === String(id));
    if (idx >= 0) {
      state.messages[idx] = { ...state.messages[idx], status, response, updatedAt: new Date().toISOString() };
    }
    render();
    if (toast) toast("Message updated", "success");
  }

  async function loadMessages() {
    const msgs = await apiFetch(`${API_BASE}/support`);
    state.messages = Array.isArray(msgs) ? msgs : [];
    render();
  }

  document.addEventListener("click", async (e) => {
    const toggleBtn = e.target.closest("[data-toggle-group]");
    if (toggleBtn) {
      const key = toggleBtn.getAttribute("data-toggle-group");
      if (state.expandedUsers.has(key)) state.expandedUsers.delete(key);
      else state.expandedUsers.add(key);
      render();
      return;
    }

    const saveBtn = e.target.closest("[data-save]");
    if (!saveBtn) return;
    const id = saveBtn.getAttribute("data-save");
    try {
      await saveMessage(id);
    } catch (error) {
      console.error(error);
      if (toast) toast("Failed to save message", "error");
    }
  });

  document.addEventListener("keydown", async (e) => {
    const target = e.target;
    if (!target || !target.classList?.contains("msg-response")) return;
    if (e.key !== "Enter") return;
    if (e.shiftKey) return; // Keep default newline behavior with Shift+Enter.
    e.preventDefault();

    const id = target.getAttribute("data-response");
    if (!id) return;
    try {
      await saveMessage(id);
    } catch (error) {
      console.error(error);
      if (toast) toast("Failed to save message", "error");
    }
  });

  els.searchInput?.addEventListener("input", render);
  els.statusFilter?.addEventListener("change", render);

  loadMessages().catch((e) => {
    console.error(e);
    if (toast) toast("Failed to load messages", "error");
  });
})();
