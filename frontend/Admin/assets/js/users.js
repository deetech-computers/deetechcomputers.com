(async function () {
  const { requireAdmin, apiFetch, API_BASE, toast, confirmAction } = window.AdminAPI || {};
  if (!requireAdmin || !(await requireAdmin())) return;

  const els = {
    tbody: document.querySelector("#usersTable tbody"),
    mobileList: document.getElementById("usersMobileList"),
    emptyState: document.getElementById("usersEmptyState"),
    searchInput: document.getElementById("usersSearchInput"),
    roleFilter: document.getElementById("usersRoleFilter"),
    statusFilter: document.getElementById("usersStatusFilter"),
    summaryTotalUsers: document.getElementById("summaryTotalUsers"),
    summaryAdmins: document.getElementById("summaryAdmins"),
    summaryInactive: document.getElementById("summaryInactive"),
    modal: document.getElementById("userDetailsModal"),
    modalTitle: document.getElementById("userDetailsTitle"),
    modalBody: document.getElementById("userDetailsBody"),
    closeModalBtn: document.getElementById("closeUserDetailsModal"),
    resetModal: document.getElementById("resetPasswordModal"),
    resetForm: document.getElementById("resetPasswordForm"),
    resetUserEmail: document.getElementById("resetPasswordUserEmail"),
    resetPasswordInput: document.getElementById("resetPasswordInput"),
    generateResetPasswordBtn: document.getElementById("generateResetPasswordBtn"),
    copyResetPasswordBtn: document.getElementById("copyResetPasswordBtn"),
    closeResetPasswordBtn: document.getElementById("closeResetPasswordModal"),
  };

  const state = {
    users: [],
    filteredUsers: [],
    resetUserId: "",
  };

  function text(v) {
    return String(v ?? "").trim();
  }

  function formatDate(v) {
    const d = v ? new Date(v) : null;
    if (!d || Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  }

  function roleChip(role) {
    const r = text(role) || "user";
    return `<span class="role-chip ${r === "admin" ? "admin" : "user"}">${r}</span>`;
  }

  function statusChip(user) {
    const active = user.isActive !== false;
    return `<span class="status-chip ${active ? "active" : "inactive"}">${active ? "Active" : "Inactive"}</span>`;
  }

  function userMatchesFilters(user) {
    const q = text(els.searchInput?.value).toLowerCase();
    const role = text(els.roleFilter?.value);
    const status = text(els.statusFilter?.value);
    const isActive = user.isActive !== false;

    if (role && text(user.role) !== role) return false;
    if (status === "active" && !isActive) return false;
    if (status === "inactive" && isActive) return false;

    if (!q) return true;
    const lookup = [
      text(user.name),
      text(user.email),
      text(user.phone),
      text(user.firstName),
      text(user.lastName),
    ]
      .join(" ")
      .toLowerCase();
    return lookup.includes(q);
  }

  function renderSummary() {
    if (els.summaryTotalUsers) els.summaryTotalUsers.textContent = String(state.filteredUsers.length);
    if (els.summaryAdmins) els.summaryAdmins.textContent = String(state.users.filter((u) => text(u.role) === "admin").length);
    if (els.summaryInactive) els.summaryInactive.textContent = String(state.users.filter((u) => u.isActive === false).length);
  }

  function renderTable(users) {
    if (!els.tbody) return;
    els.tbody.innerHTML = "";

    users.forEach((user) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="user-main">
            <strong>${text(user.name) || "-"}</strong>
            <small>${text(user.email) || "-"}</small>
            <small>${text(user.phone) || "-"}</small>
          </div>
        </td>
        <td>${roleChip(user.role)}</td>
        <td>${statusChip(user)}</td>
        <td>${formatDate(user.createdAt)}</td>
        <td>
          <div class="user-actions">
            <button class="btn-admin btn-ghost btn-user-action" data-view-user="${user._id}">Details</button>
            <button class="btn-admin btn-ghost btn-user-action" data-toggle-user="${user._id}">${user.isActive === false ? "Activate" : "Deactivate"}</button>
            <button class="btn-admin btn-ghost btn-user-action" data-reset-pass="${user._id}">Reset Password</button>
            <button class="btn-admin btn-danger btn-user-action" data-delete-user="${user._id}">Delete</button>
          </div>
        </td>
      `;
      els.tbody.appendChild(tr);
    });
  }

  function renderMobile(users) {
    if (!els.mobileList) return;
    els.mobileList.innerHTML = "";
    users.forEach((user) => {
      const card = document.createElement("article");
      card.className = "user-card";
      card.innerHTML = `
        <div class="user-card-row">
          <span class="user-label">Name</span>
          <span class="user-value">${text(user.name) || "-"}</span>
        </div>
        <div class="user-card-row">
          <span class="user-label">Email</span>
          <span class="user-value">${text(user.email) || "-"}</span>
        </div>
        <div class="user-card-row">
          <span class="user-label">Role</span>
          <span class="user-value">${roleChip(user.role)}</span>
        </div>
        <div class="user-card-row">
          <span class="user-label">Status</span>
          <span class="user-value">${statusChip(user)}</span>
        </div>
        <div class="user-card-row">
          <span class="user-label">Joined</span>
          <span class="user-value">${formatDate(user.createdAt)}</span>
        </div>
        <div class="user-card-actions">
          <button class="btn-admin btn-ghost btn-user-action" data-view-user="${user._id}">Details</button>
          <button class="btn-admin btn-ghost btn-user-action" data-toggle-user="${user._id}">${user.isActive === false ? "Activate" : "Deactivate"}</button>
          <button class="btn-admin btn-ghost btn-user-action" data-reset-pass="${user._id}">Reset Password</button>
          <button class="btn-admin btn-danger btn-user-action" data-delete-user="${user._id}">Delete</button>
        </div>
      `;
      els.mobileList.appendChild(card);
    });
  }

  function render() {
    state.filteredUsers = state.users.filter(userMatchesFilters);
    renderSummary();
    renderTable(state.filteredUsers);
    renderMobile(state.filteredUsers);
    els.emptyState?.classList.toggle("hidden", state.filteredUsers.length > 0);
  }

  function randomPassword(length = 12) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    let out = "";
    for (let i = 0; i < length; i += 1) {
      out += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return out;
  }

  function findUser(id) {
    return state.users.find((u) => String(u._id) === String(id));
  }

  function openDetails(user) {
    if (!user || !els.modal || !els.modalBody) return;
    els.modalTitle.textContent = `User: ${text(user.name) || "-"}`;
    els.modalBody.innerHTML = `
      <div class="user-details-grid">
        <div class="user-detail-item"><div class="user-detail-label">Name</div><div class="user-detail-value">${text(user.name) || "-"}</div></div>
        <div class="user-detail-item"><div class="user-detail-label">Email</div><div class="user-detail-value">${text(user.email) || "-"}</div></div>
        <div class="user-detail-item"><div class="user-detail-label">Phone</div><div class="user-detail-value">${text(user.phone) || "-"}</div></div>
        <div class="user-detail-item"><div class="user-detail-label">Role</div><div class="user-detail-value">${text(user.role) || "user"}</div></div>
        <div class="user-detail-item"><div class="user-detail-label">Status</div><div class="user-detail-value">${user.isActive === false ? "Inactive" : "Active"}</div></div>
        <div class="user-detail-item"><div class="user-detail-label">Joined</div><div class="user-detail-value">${formatDate(user.createdAt)}</div></div>
        <div class="user-detail-item"><div class="user-detail-label">Address</div><div class="user-detail-value">${text(user.address) || "-"}</div></div>
        <div class="user-detail-item"><div class="user-detail-label">Location</div><div class="user-detail-value">${[text(user.city), text(user.region)].filter(Boolean).join(", ") || "-"}</div></div>
      </div>
      <div class="user-modal-actions">
        <button class="btn-admin btn-ghost btn-user-action" data-toggle-user="${user._id}">${user.isActive === false ? "Activate Account" : "Deactivate Account"}</button>
        <button class="btn-admin btn-ghost btn-user-action" data-reset-pass="${user._id}">Reset Password</button>
        <button class="btn-admin btn-danger btn-user-action" data-delete-user="${user._id}">Delete User</button>
      </div>
      <p class="user-modal-note">Password visibility is disabled by design. Use secure reset only.</p>
    `;
    els.modal.classList.remove("hidden");
  }

  function closeDetails() {
    els.modal?.classList.add("hidden");
    if (els.modalBody) els.modalBody.innerHTML = "";
  }

  async function loadUsers() {
    const users = await apiFetch(`${API_BASE}/users/admin/users`);
    state.users = Array.isArray(users) ? users : [];
    render();
  }

  async function toggleUser(userId) {
    const user = findUser(userId);
    if (!user) return;
    const nextStatus = user.isActive === false;
    await apiFetch(`${API_BASE}/users/admin/users/${userId}/status`, {
      method: "PUT",
      body: JSON.stringify({ isActive: nextStatus }),
    });
    if (toast) toast(`User ${nextStatus ? "activated" : "deactivated"}`, "success");
    await loadUsers();
  }

  async function resetPassword(userId, newPassword) {
    await apiFetch(`${API_BASE}/users/admin/users/${userId}/reset-password`, {
      method: "PUT",
      body: JSON.stringify({ newPassword }),
    });
    if (toast) toast("Password reset completed", "success");
  }

  function openResetPasswordModal(userId) {
    const user = findUser(userId);
    if (!user || !els.resetModal || !els.resetPasswordInput || !els.resetUserEmail) return;
    state.resetUserId = String(userId);
    els.resetUserEmail.textContent = text(user.email) || text(user.name) || "Unknown user";
    els.resetPasswordInput.value = randomPassword(12);
    els.resetModal.classList.remove("hidden");
    setTimeout(() => {
      els.resetPasswordInput?.focus();
      els.resetPasswordInput?.select();
    }, 0);
  }

  function closeResetPasswordModal() {
    state.resetUserId = "";
    if (els.resetForm) els.resetForm.reset();
    if (els.resetModal) els.resetModal.classList.add("hidden");
  }

  async function copyResetPassword() {
    const value = text(els.resetPasswordInput?.value);
    if (!value) {
      if (toast) toast("No password to copy", "error");
      return;
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = value;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }
      if (toast) toast("Password copied", "success");
    } catch (error) {
      if (toast) toast("Copy failed", "error");
    }
  }

  async function deleteUser(userId) {
    const user = findUser(userId);
    if (!user) return;
    const ok = await confirmAction?.(
      `Delete user "${text(user.email)}"? This action cannot be undone.`,
      { title: "Delete User", confirmText: "Delete" }
    );
    if (!ok) return;
    await apiFetch(`${API_BASE}/users/admin/users/${userId}`, { method: "DELETE" });
    if (toast) toast("User deleted", "success");
    await loadUsers();
  }

  els.searchInput?.addEventListener("input", render);
  els.roleFilter?.addEventListener("change", render);
  els.statusFilter?.addEventListener("change", render);

  els.closeModalBtn?.addEventListener("click", closeDetails);
  els.modal?.addEventListener("click", (e) => {
    if (e.target === els.modal) closeDetails();
  });

  els.closeResetPasswordBtn?.addEventListener("click", closeResetPasswordModal);
  els.resetModal?.addEventListener("click", (e) => {
    if (e.target === els.resetModal) closeResetPasswordModal();
  });
  els.generateResetPasswordBtn?.addEventListener("click", () => {
    if (els.resetPasswordInput) {
      els.resetPasswordInput.value = randomPassword(12);
      els.resetPasswordInput.focus();
      els.resetPasswordInput.select();
    }
  });
  els.copyResetPasswordBtn?.addEventListener("click", () => {
    copyResetPassword().catch((error) => {
      console.error(error);
      if (toast) toast("Copy failed", "error");
    });
  });
  els.resetForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const password = text(els.resetPasswordInput?.value);
      if (!state.resetUserId) {
        if (toast) toast("No user selected for reset", "error");
        return;
      }
      if (password.length < 8) {
        if (toast) toast("Password must be at least 8 characters", "error");
        return;
      }
      await resetPassword(state.resetUserId, password);
      closeResetPasswordModal();
    } catch (error) {
      console.error(error);
      if (toast) toast(error.message || "Password reset failed", "error");
    }
  });

  document.addEventListener("click", async (e) => {
    try {
      const viewBtn = e.target.closest("[data-view-user]");
      if (viewBtn) {
        const user = findUser(viewBtn.getAttribute("data-view-user"));
        if (user) openDetails(user);
        return;
      }

      const toggleBtn = e.target.closest("[data-toggle-user]");
      if (toggleBtn) {
        await toggleUser(toggleBtn.getAttribute("data-toggle-user"));
        return;
      }

      const resetBtn = e.target.closest("[data-reset-pass]");
      if (resetBtn) {
        openResetPasswordModal(resetBtn.getAttribute("data-reset-pass"));
        return;
      }

      const delBtn = e.target.closest("[data-delete-user]");
      if (delBtn) {
        await deleteUser(delBtn.getAttribute("data-delete-user"));
      }
    } catch (error) {
      console.error(error);
      if (toast) toast(error.message || "Action failed", "error");
    }
  });

  loadUsers().catch((error) => {
    console.error(error);
    if (toast) toast("Failed to load users", "error");
  });
})();
