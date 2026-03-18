(async function () {
  const { requireAdmin, apiFetch, API_BASE, toast } = window.AdminAPI || {};
  if (!requireAdmin || !(await requireAdmin())) return;

  const form = document.getElementById("discountForm");
  const tbody = document.querySelector("#discountsTable tbody");
  const mobileList = document.getElementById("discountsMobileList");
  const newCodes = document.getElementById("newCodes");
  const emptyState = document.getElementById("discountsEmptyState");
  const totalCodesEl = document.getElementById("summaryTotalCodes");
  const usedCodesEl = document.getElementById("summaryUsedCodes");

  function formatDate(v) {
    const d = v ? new Date(v) : null;
    if (!d || Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  }

  function renderSummary(list) {
    if (totalCodesEl) totalCodesEl.textContent = String(list.length);
    if (usedCodesEl) usedCodesEl.textContent = String(list.filter((i) => Boolean(i.used)).length);
  }

  function renderTable(list) {
    if (!tbody) return;
    tbody.innerHTML = "";
    list.forEach((d) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><span class="discount-code">${d.code}</span></td>
        <td>${Number(d.percent || 0)}%</td>
        <td><span class="used-chip ${d.used ? "yes" : "no"}">${d.used ? "Yes" : "No"}</span></td>
        <td>${formatDate(d.createdAt)}</td>
      `;
      tbody.appendChild(row);
    });
  }

  function renderMobile(list) {
    if (!mobileList) return;
    mobileList.innerHTML = "";
    list.forEach((d) => {
      const card = document.createElement("article");
      card.className = "discount-card";
      card.innerHTML = `
        <div class="discount-card-row">
          <span class="discount-card-label">Code</span>
          <span class="discount-card-value discount-code">${d.code}</span>
        </div>
        <div class="discount-card-row">
          <span class="discount-card-label">Percent</span>
          <span class="discount-card-value">${Number(d.percent || 0)}%</span>
        </div>
        <div class="discount-card-row">
          <span class="discount-card-label">Used</span>
          <span class="discount-card-value"><span class="used-chip ${d.used ? "yes" : "no"}">${d.used ? "Yes" : "No"}</span></span>
        </div>
        <div class="discount-card-row">
          <span class="discount-card-label">Created</span>
          <span class="discount-card-value">${formatDate(d.createdAt)}</span>
        </div>
      `;
      mobileList.appendChild(card);
    });
  }

  async function loadDiscounts() {
    const list = await apiFetch(`${API_BASE}/admin/discounts`);
    const discounts = Array.isArray(list) ? list : [];
    renderSummary(discounts);
    renderTable(discounts);
    renderMobile(discounts);
    emptyState?.classList.toggle("hidden", discounts.length > 0);
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const percent = Number(fd.get("percent"));
    const count = Number(fd.get("count") || 1);
    const res = await apiFetch(`${API_BASE}/admin/discounts`, {
      method: "POST",
      body: JSON.stringify({ percent, count }),
    });

    if (Array.isArray(res.codes) && res.codes.length > 0) {
      newCodes.textContent = `New codes: ${res.codes.join(", ")}`;
      newCodes.classList.remove("hidden");
    } else {
      newCodes.textContent = "";
      newCodes.classList.add("hidden");
    }

    form.reset();
    if (toast) toast("Discount codes generated", "success");
    loadDiscounts();
  });

  loadDiscounts().catch((e) => {
    console.error(e);
    if (toast) toast("Failed to load discount codes", "error");
  });
})();
