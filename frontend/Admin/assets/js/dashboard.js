(async function () {
  const { requireAdmin, apiFetch, API_BASE } = window.AdminAPI || {};
  if (!requireAdmin || !(await requireAdmin())) return;

  function renderLoading(grid) {
    grid.innerHTML = `
      <div class="stat loading-stat"><h4>Users</h4><strong>...</strong></div>
      <div class="stat loading-stat"><h4>Products</h4><strong>...</strong></div>
      <div class="stat loading-stat"><h4>Orders</h4><strong>...</strong></div>
      <div class="stat loading-stat"><h4>Revenue</h4><strong>...</strong></div>
    `;
  }

  async function loadStats() {
    const grid = document.getElementById("statsGrid");
    if (!grid) return;
    renderLoading(grid);

    const stats = await apiFetch(`${API_BASE}/dashboard`);
    const items = [
      { label: "Users", value: Number(stats.totalUsers || 0), accent: "users" },
      { label: "Products", value: Number(stats.totalProducts || 0), accent: "products" },
      { label: "Orders", value: Number(stats.totalOrders || 0), accent: "orders" },
      { label: "Revenue", value: `GHC ${Number(stats.totalRevenue || 0).toFixed(2)}`, accent: "revenue" },
    ];

    grid.innerHTML = "";
    items.forEach((it) => {
      const card = document.createElement("div");
      card.className = `stat stat-${it.accent}`;
      card.innerHTML = `
        <div class="stat-head">
          <h4>${it.label}</h4>
          <span class="stat-dot" aria-hidden="true"></span>
        </div>
        <strong>${it.value}</strong>
      `;
      grid.appendChild(card);
    });
  }

  loadStats().catch((e) => console.error(e));
})();
