(async function () {
  const { requireAdmin, apiFetch, API_BASE, toast, confirmAction } = window.AdminAPI || {};
  if (!requireAdmin || !(await requireAdmin())) return;

  const els = {
    tbody: document.querySelector("#affiliatesTable tbody"),
    mobileList: document.getElementById("affiliatesMobileList"),
    emptyState: document.getElementById("affiliatesEmptyState"),
    searchInput: document.getElementById("affiliatesSearchInput"),
    tierFilter: document.getElementById("affiliatesTierFilter"),
    statusFilter: document.getElementById("affiliatesStatusFilter"),
    summaryTotalAffiliates: document.getElementById("summaryTotalAffiliates"),
    summaryTotalReferrals: document.getElementById("summaryTotalReferrals"),
    summaryEarnedCommission: document.getElementById("summaryEarnedCommission"),
    statusChart: document.getElementById("adminStatusChart"),
    topAffiliatesChart: document.getElementById("adminTopAffiliatesChart"),
    settingsForm: document.getElementById("affiliateSettingsForm"),
    settingsCommissionRate: document.getElementById("settingsCommissionRate"),
    settingsBronzeThreshold: document.getElementById("settingsBronzeThreshold"),
    settingsSilverThreshold: document.getElementById("settingsSilverThreshold"),
    settingsGoldThreshold: document.getElementById("settingsGoldThreshold"),
    modal: document.getElementById("affiliateDetailsModal"),
    modalTitle: document.getElementById("affiliateDetailsTitle"),
    modalBody: document.getElementById("affiliateDetailsBody"),
    closeModalBtn: document.getElementById("closeAffiliateDetailsModal"),
  };

  const state = {
    affiliates: [],
    filteredAffiliates: [],
    settings: null,
  };

  function text(v) {
    return String(v ?? "").trim();
  }

  function money(v) {
    return `GHC ${Number(v || 0).toFixed(2)}`;
  }

  function formatDate(v) {
    const d = v ? new Date(v) : null;
    if (!d || Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  }

  function statusChip(isActive) {
    const active = isActive !== false;
    return `<span class="status-chip ${active ? "active" : "inactive"}">${active ? "Active" : "Inactive"}</span>`;
  }

  function tierChip(tier) {
    const t = text(tier).toLowerCase() || "starter";
    return `<span class="tier-chip ${t}">${t.charAt(0).toUpperCase()}${t.slice(1)}</span>`;
  }

  function statusTag(status) {
    const s = text(status).toLowerCase();
    if (s === "earned") return `<span class="status-chip active">Earned</span>`;
    if (s === "cancelled") return `<span class="status-chip inactive">Cancelled</span>`;
    return `<span class="status-chip">Pending</span>`;
  }

  function renderMiniChart(container, rows, valueFormatter = (v) => String(v), barClass = "") {
    if (!container) return;
    const safeRows = Array.isArray(rows) ? rows : [];
    if (!safeRows.length) {
      container.innerHTML = `<p class="affiliate-settings-note">No data yet.</p>`;
      return;
    }
    const max = Math.max(...safeRows.map((r) => Number(r.value || 0)), 1);
    container.innerHTML = safeRows
      .map((row) => {
        const value = Number(row.value || 0);
        const pct = Math.max(0, Math.min(100, (value / max) * 100));
        return `
          <div class="mini-chart-row">
            <span class="mini-chart-label">${row.label}</span>
            <div class="mini-chart-track">
              <div class="mini-chart-bar ${barClass}" style="width:${pct}%"></div>
            </div>
            <span class="mini-chart-value">${valueFormatter(value)}</span>
          </div>
        `;
      })
      .join("");
  }

  function monthKeyFromDate(value) {
    const d = value ? new Date(value) : null;
    if (!d || Number.isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }

  function formatMonthLabel(key) {
    if (!key) return "-";
    const [y, m] = String(key).split("-");
    const d = new Date(Number(y), Number(m) - 1, 1);
    return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
  }

  function buildMonthlyCommissionRows(referrals, maxMonths = 6) {
    const map = new Map();
    (Array.isArray(referrals) ? referrals : []).forEach((ref) => {
      const key = monthKeyFromDate(ref.createdAt);
      if (!key) return;
      const earned = text(ref.status).toLowerCase() === "earned";
      const prev = Number(map.get(key) || 0);
      map.set(key, prev + (earned ? Number(ref.commissionAmount || 0) : 0));
    });

    return [...map.entries()]
      .sort((a, b) => String(a[0]).localeCompare(String(b[0])))
      .slice(-maxMonths)
      .map(([key, value]) => ({ label: formatMonthLabel(key), value }));
  }

  function affiliateMatchesFilters(affiliate) {
    const q = text(els.searchInput?.value).toLowerCase();
    const tier = text(els.tierFilter?.value);
    const status = text(els.statusFilter?.value);
    const active = affiliate.isActive !== false;

    if (tier && text(affiliate.tier).toLowerCase() !== tier) return false;
    if (status === "active" && !active) return false;
    if (status === "inactive" && active) return false;

    if (!q) return true;
    const lookup = [
      text(affiliate.user?.name),
      text(affiliate.user?.email),
      text(affiliate.code),
      text(affiliate.user?.phone),
    ]
      .join(" ")
      .toLowerCase();
    return lookup.includes(q);
  }

  function renderSummary() {
    const totalAffiliates = state.filteredAffiliates.length;
    const totalReferrals = state.filteredAffiliates.reduce(
      (sum, a) => sum + Number(a?.stats?.totalReferrals || 0),
      0
    );
    const totalEarned = state.filteredAffiliates.reduce(
      (sum, a) => sum + Number(a?.stats?.earnedCommission || 0),
      0
    );

    if (els.summaryTotalAffiliates) {
      els.summaryTotalAffiliates.textContent = String(totalAffiliates);
    }
    if (els.summaryTotalReferrals) {
      els.summaryTotalReferrals.textContent = String(totalReferrals);
    }
    if (els.summaryEarnedCommission) {
      els.summaryEarnedCommission.textContent = money(totalEarned);
    }
  }

  function renderAnalytics() {
    const pending = state.filteredAffiliates.reduce(
      (sum, a) => sum + Number(a?.stats?.pendingReferrals || 0),
      0
    );
    const earned = state.filteredAffiliates.reduce(
      (sum, a) => sum + Number(a?.stats?.deliveredReferrals || 0),
      0
    );
    const cancelled = state.filteredAffiliates.reduce(
      (sum, a) => sum + Number(a?.stats?.cancelledReferrals || 0),
      0
    );

    renderMiniChart(
      els.statusChart,
      [
        { label: "Pending", value: pending },
        { label: "Earned", value: earned },
        { label: "Cancelled", value: cancelled },
      ],
      (v) => String(v)
    );

    const top = [...state.filteredAffiliates]
      .sort(
        (a, b) =>
          Number(b?.stats?.earnedCommission || 0) - Number(a?.stats?.earnedCommission || 0)
      )
      .slice(0, 5)
      .map((a) => ({
        label: text(a?.user?.firstName || a?.user?.name || a?.code || "Affiliate"),
        value: Number(a?.stats?.earnedCommission || 0),
      }));

    renderMiniChart(els.topAffiliatesChart, top, (v) => money(v));
  }

  function renderTable(rows) {
    if (!els.tbody) return;
    els.tbody.innerHTML = "";

    rows.forEach((affiliate) => {
      const active = affiliate.isActive !== false;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="affiliate-main">
            <strong>${text(affiliate.user?.name) || "-"}</strong>
            <small>${text(affiliate.user?.email) || "-"}</small>
          </div>
        </td>
        <td><strong>${text(affiliate.code) || "-"}</strong></td>
        <td>${tierChip(affiliate.tier)}</td>
        <td>${statusChip(affiliate.isActive)}</td>
        <td>${Number(affiliate?.stats?.totalReferrals || 0)}</td>
        <td>${money(affiliate?.stats?.earnedCommission)}</td>
        <td>
          <div class="affiliate-actions">
            <button class="btn-admin btn-ghost" data-view-affiliate="${affiliate._id}">Details</button>
            <button class="btn-admin btn-ghost" data-toggle-affiliate="${affiliate._id}" data-next-active="${active ? "false" : "true"}">
              ${active ? "Deactivate" : "Activate"}
            </button>
            <button class="btn-admin btn-danger" data-delete-affiliate="${affiliate._id}">Delete</button>
          </div>
        </td>
      `;
      els.tbody.appendChild(tr);
    });
  }

  function renderMobile(rows) {
    if (!els.mobileList) return;
    els.mobileList.innerHTML = "";

    rows.forEach((affiliate) => {
      const active = affiliate.isActive !== false;
      const card = document.createElement("article");
      card.className = "affiliate-card";
      card.innerHTML = `
        <div class="affiliate-card-row">
          <span class="affiliate-label">Affiliate</span>
          <span class="affiliate-value">${text(affiliate.user?.name) || "-"}</span>
        </div>
        <div class="affiliate-card-row">
          <span class="affiliate-label">Code</span>
          <span class="affiliate-value">${text(affiliate.code) || "-"}</span>
        </div>
        <div class="affiliate-card-row">
          <span class="affiliate-label">Tier</span>
          <span class="affiliate-value">${tierChip(affiliate.tier)}</span>
        </div>
        <div class="affiliate-card-row">
          <span class="affiliate-label">Status</span>
          <span class="affiliate-value">${statusChip(affiliate.isActive)}</span>
        </div>
        <div class="affiliate-card-row">
          <span class="affiliate-label">Referrals</span>
          <span class="affiliate-value">${Number(affiliate?.stats?.totalReferrals || 0)}</span>
        </div>
        <div class="affiliate-card-row">
          <span class="affiliate-label">Earned</span>
          <span class="affiliate-value">${money(affiliate?.stats?.earnedCommission)}</span>
        </div>
        <div class="affiliate-actions">
          <button class="btn-admin btn-ghost" data-view-affiliate="${affiliate._id}">Details</button>
          <button class="btn-admin btn-ghost" data-toggle-affiliate="${affiliate._id}" data-next-active="${active ? "false" : "true"}">
            ${active ? "Deactivate" : "Activate"}
          </button>
          <button class="btn-admin btn-danger" data-delete-affiliate="${affiliate._id}">Delete</button>
        </div>
      `;
      els.mobileList.appendChild(card);
    });
  }

  function render() {
    state.filteredAffiliates = state.affiliates.filter(affiliateMatchesFilters);
    renderSummary();
    renderAnalytics();
    renderTable(state.filteredAffiliates);
    renderMobile(state.filteredAffiliates);
    els.emptyState?.classList.toggle("hidden", state.filteredAffiliates.length > 0);
  }

  function applySettingsToForm(settings) {
    state.settings = settings || null;
    if (!settings) return;
    if (els.settingsCommissionRate) {
      els.settingsCommissionRate.value = Number(settings.defaultCommissionRate || 0);
    }
    if (els.settingsBronzeThreshold) {
      els.settingsBronzeThreshold.value = Number(settings?.tierThresholds?.bronze || 5);
    }
    if (els.settingsSilverThreshold) {
      els.settingsSilverThreshold.value = Number(settings?.tierThresholds?.silver || 15);
    }
    if (els.settingsGoldThreshold) {
      els.settingsGoldThreshold.value = Number(settings?.tierThresholds?.gold || 30);
    }
  }

  function closeModal() {
    els.modal?.classList.add("hidden");
    if (els.modalBody) els.modalBody.innerHTML = "";
  }

  async function openDetails(affiliateId) {
    try {
      const detail = await apiFetch(`${API_BASE}/affiliates/admin/${affiliateId}`);
      const affiliate = detail?.affiliate || {};
      const stats = detail?.stats || {};
      const referrals = Array.isArray(detail?.referrals) ? detail.referrals : [];
      const active = affiliate.isActive !== false;

      if (!els.modal || !els.modalBody) return;
      els.modalTitle.textContent = `Affiliate: ${text(affiliate.user?.name) || text(affiliate.code)}`;
      els.modalBody.innerHTML = `
        <div class="affiliate-details-grid">
          <div class="affiliate-detail-item"><div class="affiliate-detail-label">Name</div><div class="affiliate-detail-value">${text(affiliate.user?.name) || "-"}</div></div>
          <div class="affiliate-detail-item"><div class="affiliate-detail-label">Email</div><div class="affiliate-detail-value">${text(affiliate.user?.email) || "-"}</div></div>
          <div class="affiliate-detail-item"><div class="affiliate-detail-label">Phone</div><div class="affiliate-detail-value">${text(affiliate.user?.phone) || "-"}</div></div>
          <div class="affiliate-detail-item"><div class="affiliate-detail-label">Code</div><div class="affiliate-detail-value">${text(affiliate.code) || "-"}</div></div>
          <div class="affiliate-detail-item"><div class="affiliate-detail-label">Tier</div><div class="affiliate-detail-value">${tierChip(affiliate.tier)}</div></div>
          <div class="affiliate-detail-item"><div class="affiliate-detail-label">Status</div><div class="affiliate-detail-value">${statusChip(affiliate.isActive)}</div></div>
          <div class="affiliate-detail-item"><div class="affiliate-detail-label">Total Referrals</div><div class="affiliate-detail-value">${Number(stats.totalReferrals || 0)}</div></div>
          <div class="affiliate-detail-item"><div class="affiliate-detail-label">Pending Commission</div><div class="affiliate-detail-value">${money(stats.pendingCommission)}</div></div>
          <div class="affiliate-detail-item"><div class="affiliate-detail-label">Earned Commission</div><div class="affiliate-detail-value">${money(stats.earnedCommission)}</div></div>
        </div>

        <h4 style="margin:12px 0 6px;">Monthly Earned Commission</h4>
        <div id="affiliateDetailMonthlyChart" class="mini-chart"></div>

        <h4 style="margin:12px 0 6px;">Referral History</h4>
        <table class="affiliate-referrals-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Order Amount</th>
              <th>Commission</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${
              referrals.length
                ? referrals
                    .map(
                      (ref) => `
              <tr>
                <td>#${text(ref.order?._id || ref.order || "").slice(-8).toUpperCase() || "-"}</td>
                <td>${text(ref.customerName) || "-"}</td>
                <td>${money(ref.orderAmount)}</td>
                <td>${money(ref.commissionAmount)}</td>
                <td>${statusTag(ref.status)}</td>
                <td>${formatDate(ref.createdAt)}</td>
              </tr>
            `
                    )
                    .join("")
                : `<tr><td colspan="6">No referrals yet.</td></tr>`
            }
          </tbody>
        </table>
        <div class="affiliate-modal-actions">
          <button class="btn-admin btn-ghost" data-toggle-affiliate="${affiliate._id}" data-next-active="${active ? "false" : "true"}">
            ${active ? "Deactivate Affiliate" : "Activate Affiliate"}
          </button>
          <button class="btn-admin btn-danger" data-delete-affiliate="${affiliate._id}">Delete Affiliate</button>
        </div>
      `;
      els.modal.classList.remove("hidden");

      const monthlyChart = document.getElementById("affiliateDetailMonthlyChart");
      const monthlyRows = buildMonthlyCommissionRows(referrals, 6);
      renderMiniChart(monthlyChart, monthlyRows, (v) => money(v));
    } catch (error) {
      console.error(error);
      if (toast) toast(error.message || "Failed to load affiliate details", "error");
    }
  }

  async function deleteAffiliate(affiliateId) {
    const row = state.affiliates.find((item) => String(item._id) === String(affiliateId));
    const label = text(row?.user?.email || row?.code || affiliateId);
    const ok = await confirmAction?.(
      `Delete affiliate "${label}" and all referral records?`,
      { title: "Delete Affiliate", confirmText: "Delete" }
    );
    if (!ok) return;

    try {
      await apiFetch(`${API_BASE}/affiliates/admin/${affiliateId}`, { method: "DELETE" });
      if (toast) toast("Affiliate deleted", "success");
      await loadAffiliates();
      closeModal();
    } catch (error) {
      console.error(error);
      if (toast) toast(error.message || "Delete failed", "error");
    }
  }

  async function toggleAffiliateStatus(affiliateId, nextActiveRaw) {
    const nextActive = String(nextActiveRaw) === "true";
    try {
      await apiFetch(`${API_BASE}/affiliates/admin/${affiliateId}/status`, {
        method: "PUT",
        body: JSON.stringify({ isActive: nextActive }),
      });
      if (toast) toast(`Affiliate ${nextActive ? "activated" : "deactivated"}`, "success");
      await loadAffiliates();
      if (!els.modal?.classList.contains("hidden")) {
        await openDetails(affiliateId);
      }
    } catch (error) {
      console.error(error);
      if (toast) toast(error.message || "Status update failed", "error");
    }
  }

  async function loadAffiliates() {
    const data = await apiFetch(`${API_BASE}/affiliates/admin`);
    const list = Array.isArray(data) ? data : data?.affiliates;
    state.affiliates = Array.isArray(list) ? list : [];
    applySettingsToForm(data?.settings || null);
    render();
  }

  async function saveSettings(e) {
    e.preventDefault();
    try {
      const payload = {
        defaultCommissionRate: Number(els.settingsCommissionRate?.value || 0),
        tierThresholds: {
          bronze: Number(els.settingsBronzeThreshold?.value || 0),
          silver: Number(els.settingsSilverThreshold?.value || 0),
          gold: Number(els.settingsGoldThreshold?.value || 0),
        },
      };

      await apiFetch(`${API_BASE}/affiliates/admin/settings`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (toast) toast("Affiliate settings updated", "success");
      await loadAffiliates();
    } catch (error) {
      console.error(error);
      if (toast) toast(error.message || "Failed to update settings", "error");
    }
  }

  els.searchInput?.addEventListener("input", render);
  els.tierFilter?.addEventListener("change", render);
  els.statusFilter?.addEventListener("change", render);
  els.settingsForm?.addEventListener("submit", saveSettings);
  els.closeModalBtn?.addEventListener("click", closeModal);
  els.modal?.addEventListener("click", (e) => {
    if (e.target === els.modal) closeModal();
  });

  document.addEventListener("click", async (e) => {
    const viewBtn = e.target.closest("[data-view-affiliate]");
    if (viewBtn) {
      await openDetails(viewBtn.getAttribute("data-view-affiliate"));
      return;
    }

    const toggleBtn = e.target.closest("[data-toggle-affiliate]");
    if (toggleBtn) {
      await toggleAffiliateStatus(
        toggleBtn.getAttribute("data-toggle-affiliate"),
        toggleBtn.getAttribute("data-next-active")
      );
      return;
    }

    const deleteBtn = e.target.closest("[data-delete-affiliate]");
    if (deleteBtn) {
      await deleteAffiliate(deleteBtn.getAttribute("data-delete-affiliate"));
    }
  });

  loadAffiliates().catch((error) => {
    console.error(error);
    if (toast) toast("Failed to load affiliates", "error");
  });
})();
