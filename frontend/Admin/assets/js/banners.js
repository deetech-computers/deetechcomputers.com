(async function () {
  const { requireAdmin, apiFetch, API_BASE, toast, confirmAction } = window.AdminAPI || {};
  if (!requireAdmin || !(await requireAdmin())) return;

  const FALLBACK_IMAGE =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlNWU3ZWIiLz48cGF0aCBkPSJNMTMwIDgwTDE5MCAxNDBMMjcwIDYwIiBzdHJva2U9IiM5ZmE2YjIiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjE2MCIgY3k9IjYwIiByPSIxNCIgZmlsbD0iIzlmYTZiMiIvPjwvc3ZnPg==";

  const form = document.getElementById("bannerForm");
  const bannersList = document.getElementById("bannersList");
  const emptyState = document.getElementById("emptyBannersState");
  const totalEl = document.getElementById("summaryTotalBanners");
  const bannerMainPreview = document.getElementById("bannerMainPreview");

  const manageSection = document.getElementById("bannersManageSection");
  const createSection = document.getElementById("bannerCreateSection");
  const showCreateBtn = document.getElementById("showCreateBannerBtn");
  const backToBannersBtn = document.getElementById("backToBannersBtn");

  let previewObjectUrl = null;
  let bannersCache = [];

  function showManage() {
    manageSection?.classList.remove("hidden");
    createSection?.classList.add("hidden");
  }

  function showCreate() {
    manageSection?.classList.add("hidden");
    createSection?.classList.remove("hidden");
    createSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function parseImageUrl(raw) {
    const v = String(raw || "").trim();
    return v || FALLBACK_IMAGE;
  }

  function updatePreview() {
    if (!form || !bannerMainPreview) return;

    const inputUrl = String(form.imageUrl?.value || "").trim();
    const file = form.image?.files?.[0];

    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
      previewObjectUrl = null;
    }

    if (file) {
      previewObjectUrl = URL.createObjectURL(file);
      bannerMainPreview.src = previewObjectUrl;
    } else {
      bannerMainPreview.src = parseImageUrl(inputUrl);
    }

    bannerMainPreview.onerror = () => {
      bannerMainPreview.onerror = null;
      bannerMainPreview.src = FALLBACK_IMAGE;
    };
  }

  function renderBanners(list) {
    if (!bannersList) return;
    bannersList.innerHTML = "";

    if (totalEl) totalEl.textContent = String(list.length);
    if (!list.length) {
      emptyState?.classList.remove("hidden");
      return;
    }
    emptyState?.classList.add("hidden");

    list.forEach((banner) => {
      const image = parseImageUrl(banner.imageUrl);
      const card = document.createElement("article");
      card.className = "banner-card";
      card.innerHTML = `
        <div class="banner-thumb">
          <img src="${image}" alt="${String(banner.title || "Banner")}">
        </div>
        <div class="banner-content">
          <h4>${banner.title || "Untitled Banner"}</h4>
          <div class="banner-meta">
            <span class="banner-chip">Order: ${Number(banner.order || 1)}</span>
            <span class="banner-chip">ID: ${String(banner._id || "").slice(-6).toUpperCase()}</span>
          </div>
          <div class="banner-link">${banner.link ? `Link: ${banner.link}` : "No link attached"}</div>
          <div class="banner-actions">
            ${banner.imageUrl ? `<a class="btn-admin btn-ghost" href="${banner.imageUrl}" target="_blank" rel="noreferrer">View</a>` : `<button class="btn-admin btn-ghost" type="button" disabled>No Image</button>`}
            <button class="btn-admin btn-danger" data-delete="${banner._id}">Delete</button>
          </div>
        </div>
      `;
      const img = card.querySelector("img");
      if (img) {
        img.addEventListener("error", () => {
          img.onerror = null;
          img.src = FALLBACK_IMAGE;
        });
      }
      bannersList.appendChild(card);
    });
  }

  async function loadBanners() {
    const list = await apiFetch(`${API_BASE}/banners`);
    bannersCache = Array.isArray(list) ? list : [];
    renderBanners(bannersCache);
  }

  showCreateBtn?.addEventListener("click", showCreate);
  backToBannersBtn?.addEventListener("click", showManage);

  form?.imageUrl?.addEventListener("input", updatePreview);
  form?.image?.addEventListener("change", updatePreview);

  bannersList?.addEventListener("click", async (e) => {
    const delBtn = e.target.closest("[data-delete]");
    if (!delBtn) return;
    const id = delBtn.getAttribute("data-delete");
    const ok = await confirmAction?.("Delete this banner?", {
      title: "Delete Banner",
      confirmText: "Delete",
    });
    if (!ok) return;
    await apiFetch(`${API_BASE}/banners/${id}`, { method: "DELETE" });
    if (toast) toast("Banner deleted", "success");
    await loadBanners();
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const imageUrlInput = String(fd.get("imageUrl") || "").trim();
    const imageFile = fd.get("image");
    let imageUrl = imageUrlInput || "";

    if (!imageUrl && imageFile && imageFile instanceof File && imageFile.size > 0) {
      const uploadFd = new FormData();
      uploadFd.append("image", imageFile);
      const upload = await apiFetch(`${API_BASE}/upload`, {
        method: "POST",
        body: uploadFd,
      });
      imageUrl = upload.imageUrl || "";
    }

    if (!imageUrl) {
      if (toast) toast("Provide an image URL or upload an image", "error");
      return;
    }

    await apiFetch(`${API_BASE}/banners`, {
      method: "POST",
      body: JSON.stringify({
        title: fd.get("title"),
        link: fd.get("link"),
        order: Number(fd.get("order") || 1),
        imageUrl,
      }),
    });

    form.reset();
    updatePreview();
    if (toast) toast("Banner created successfully", "success");
    await loadBanners();
    showManage();
  });

  updatePreview();
  showManage();
  loadBanners().catch((e) => {
    console.error(e);
    if (toast) toast("Failed to load banners", "error");
  });
})();
