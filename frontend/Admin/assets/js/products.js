(async function () {
  const { requireAdmin, apiFetch, API_BASE, toast, confirmAction } = window.AdminAPI || {};
  if (!requireAdmin || !(await requireAdmin())) return;

  const form = document.getElementById("productForm");
  const manageSection = document.getElementById("productsManageSection");
  const createSection = document.getElementById("productCreateSection");
  const editCard = document.getElementById("editProductCard");
  const editForm = document.getElementById("editProductForm");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const showCreateBtn = document.getElementById("showCreateProductBtn");
  const backFromCreateBtn = document.getElementById("backToProductsFromCreate");
  const backFromEditBtn = document.getElementById("backToProductsFromEdit");
  const listEl = document.getElementById("adminProductsList");
  const emptyStateEl = document.getElementById("emptyProductsState");
  const summaryTotalProductsEl = document.getElementById("summaryTotalProducts");
  const summaryFeaturedProductsEl = document.getElementById("summaryFeaturedProducts");
  const summaryTotalImagesEl = document.getElementById("summaryTotalImages");
  const createMainPreview = document.getElementById("createMainPreview");
  const createGalleryPreview = document.getElementById("createGalleryPreview");
  const editMainPreview = document.getElementById("editMainPreview");
  const editGalleryPreview = document.getElementById("editGalleryPreview");
  const editExistingImagesList = document.getElementById("editExistingImagesList");

  let productsCache = [];
  let editExistingImages = [];
  const previewObjectUrls = new WeakMap();
  const FALLBACK_IMAGE =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlNWU3ZWIiLz48cGF0aCBkPSJNMTMwIDEyMEwxOTAgMTgwTDI3MCAxMDAiIHN0cm9rZT0iIzlmYTZiMiIgc3Ryb2tlLXdpZHRoPSIxMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjE2MCIgY3k9IjEwMCIgcj0iMTgiIGZpbGw9IiM5ZmE2YjIiLz48L3N2Zz4=";

  const categoryNames = {
    laptops: "Laptops & Computers",
    phones: "Phones & Tablets",
    monitors: "Monitors & Displays",
    accessories: "Accessories",
    storage: "Storage Devices",
    printers: "Printers & Scanners",
  };

  const homeSectionNames = {
    popular: "Popular",
    best_laptops: "Best Selling Laptops",
    top_smartphones: "Smartphones Top Sellers",
    new_arrivals: "New Arrivals",
    shop_by_brands: "Shop By Brands",
  };

  const brandsByCategory = {
    laptops: ["HP", "Dell", "Lenovo", "Apple", "Asus", "Acer", "Microsoft", "Samsung", "Toshiba", "MSI"],
    phones: ["Apple", "Samsung", "Google", "Huawei", "Xiaomi", "Oppo", "Vivo", "Tecno", "Infinix", "Nokia"],
    monitors: ["Dell", "HP", "Samsung", "LG", "Acer", "Asus", "BenQ", "ViewSonic", "Philips", "AOC"],
    accessories: ["Logitech", "Microsoft", "Apple", "Samsung", "Anker", "JBL", "Sony", "Razer", "Corsair", "HyperX"],
    storage: ["Seagate", "Western Digital", "Samsung", "Toshiba", "Kingston", "SanDisk", "Crucial", "Transcend"],
    printers: ["HP", "Canon", "Epson", "Brother", "Xerox", "Lexmark", "Ricoh", "Kyocera"],
  };

  function canonicalCategory(value) {
    const v = String(value || "").trim().toLowerCase();
    if (v.startsWith("laptop")) return "laptops";
    if (v.startsWith("phone")) return "phones";
    if (v.startsWith("monitor")) return "monitors";
    if (v.startsWith("access")) return "accessories";
    if (v.startsWith("stor")) return "storage";
    if (v.startsWith("print")) return "printers";
    return v || "accessories";
  }

  function categoryLabel(value) {
    return categoryNames[canonicalCategory(value)] || value || "General";
  }

  function stockOf(product) {
    return Number(product.stock_quantity ?? product.countInStock ?? 0);
  }

  function featuredOf(product) {
    return Boolean(product.featured || product.isFeatured);
  }

  function imageOf(product) {
    return String(product.image_url || product.image || (Array.isArray(product.images) ? product.images[0] : "") || "").trim();
  }

  function allImagesOf(product) {
    const out = new Set();
    const main = imageOf(product);
    if (main) out.add(main);
    if (Array.isArray(product.images)) {
      product.images.forEach((img) => {
        const v = String(img || "").trim();
        if (v) out.add(v);
      });
    }
    return [...out];
  }

  function stockStatusClass(stock) {
    if (stock <= 0) return "out-of-stock";
    if (stock <= 5) return "low-stock";
    return "in-stock";
  }

  function parseCsvUrls(input) {
    return String(input || "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  function normalizeSpecsInput(input) {
    if (input === undefined || input === null) return "";
    if (typeof input === "string") return input;
    if (Array.isArray(input)) return input.map((v) => String(v || "").trim()).filter(Boolean).join(", ");
    if (typeof input === "object") {
      return Object.entries(input)
        .map(([key, value]) => {
          const k = String(key || "").trim();
          const v = String(value || "").trim();
          return v ? `${k}: ${v}` : k;
        })
        .filter(Boolean)
        .join(", ");
    }
    return String(input || "");
  }

  function isUploadedImagePath(value) {
    return /^\/?uploads\//i.test(String(value || "").trim());
  }

  function selectedHomeSections(srcForm) {
    if (!srcForm) return [];
    return Array.from(srcForm.querySelectorAll('input[name="homeSections"]:checked'))
      .map((input) => String(input.value || "").trim())
      .filter(Boolean);
  }

  function setHomeSections(srcForm, sections = []) {
    const selected = new Set(
      (Array.isArray(sections) ? sections : String(sections || "").split(","))
        .map((v) => String(v || "").trim().toLowerCase())
        .filter(Boolean)
    );
    if (!srcForm) return;
    Array.from(srcForm.querySelectorAll('input[name="homeSections"]')).forEach((input) => {
      input.checked = selected.has(String(input.value || "").trim().toLowerCase());
    });
  }

  function populateBrandOptions(srcForm, selectedBrand = "") {
    if (!srcForm?.category || !srcForm?.brand) return;
    const category = canonicalCategory(srcForm.category.value);
    const brands = brandsByCategory[category] || [];
    const current = String(selectedBrand || "").trim();
    const options = ['<option value="">Select brand</option>']
      .concat(brands.map((b) => `<option value="${b}">${b}</option>`));

    srcForm.brand.innerHTML = options.join("");
    srcForm.brand.value = brands.includes(current) ? current : "";
  }

  function renderFormPreview(srcForm, mainEl, galleryEl) {
    if (!mainEl || !galleryEl || !srcForm) return;

    const previous = previewObjectUrls.get(srcForm) || [];
    previous.forEach((u) => URL.revokeObjectURL(u));

    const mainUrl = String(srcForm.image_url?.value || "").trim();
    const galleryUrls = parseCsvUrls(srcForm.imageUrls?.value || "");
    const files = srcForm.images?.files ? Array.from(srcForm.images.files) : [];
    const fileUrls = files.map((f) => URL.createObjectURL(f));
    previewObjectUrls.set(srcForm, fileUrls);
    const previewUrls = [...new Set([...galleryUrls, ...fileUrls])];

    mainEl.src = mainUrl || previewUrls[0] || FALLBACK_IMAGE;
    mainEl.classList.remove("image-fallback");
    mainEl.onerror = () => {
      mainEl.onerror = null;
      mainEl.src = FALLBACK_IMAGE;
      mainEl.classList.add("image-fallback");
    };

    galleryEl.innerHTML = "";
    previewUrls.slice(0, 8).forEach((url) => {
      const img = document.createElement("img");
      img.src = url;
      img.alt = "Gallery preview";
      img.addEventListener("error", () => {
        img.onerror = null;
        img.src = FALLBACK_IMAGE;
        img.classList.add("image-fallback");
      });
      galleryEl.appendChild(img);
    });
  }

  function wirePreview(srcForm, mainEl, galleryEl) {
    if (!srcForm) return;
    const refresh = () => renderFormPreview(srcForm, mainEl, galleryEl);
    srcForm.image_url?.addEventListener("input", refresh);
    srcForm.imageUrls?.addEventListener("input", refresh);
    srcForm.images?.addEventListener("change", refresh);
    refresh();
  }

  function wireBrandDependency(srcForm) {
    if (!srcForm?.category || !srcForm?.brand) return;
    srcForm.category.addEventListener("change", () => {
      populateBrandOptions(srcForm, "");
    });
    populateBrandOptions(srcForm, srcForm.brand.value || "");
  }

  function buildPayloadFromForm(srcForm) {
    const options = arguments[1] || {};
    const fd = new FormData();
    const name = String(srcForm.name.value || "").trim();
    const brand = String(srcForm.brand.value || "").trim();
    const category = canonicalCategory(srcForm.category.value);
    const price = Number(srcForm.price.value || 0);
    const stock = Math.max(0, Number(srcForm.stock_quantity.value || 0));
    const shortDesc = String(srcForm.short_description.value || "").trim();
    const description = String(srcForm.description.value || "").trim();
    const specs = String(srcForm.specs?.value || "").trim();
    const mainImage = String(srcForm.image_url.value || "").trim();
    const galleryUrls = String(srcForm.imageUrls.value || "").trim();
    const isFeatured = srcForm.isFeatured.checked;
    const homeSections = selectedHomeSections(srcForm);

    fd.append("name", name);
    fd.append("brand", brand);
    fd.append("category", category);
    fd.append("price", String(price));
    fd.append("stock_quantity", String(stock));
    fd.append("countInStock", String(stock));
    fd.append("short_description", shortDesc);
    fd.append("description", description);
    if (specs) {
      fd.append("specs", specs);
    } else if (srcForm.specs) {
      fd.append("specs", "");
    }
    fd.append("image_url", mainImage);
    fd.append("featured", String(isFeatured));
    fd.append("isFeatured", String(isFeatured));
    if (galleryUrls) fd.append("imageUrls", galleryUrls);
    fd.append("homeSections", homeSections.join(","));
    if (Array.isArray(options.existingImages)) {
      options.existingImages
        .map((v) => String(v || "").trim())
        .filter(Boolean)
        .forEach((img) => fd.append("existingImages", img));
    }

    const files = srcForm.images?.files || [];
    for (let i = 0; i < files.length; i += 1) {
      fd.append("images", files[i]);
    }
    return fd;
  }

  function renderExistingImagesManager() {
    if (!editExistingImagesList) return;
    editExistingImagesList.innerHTML = "";
    if (!editExistingImages.length) {
      editExistingImagesList.innerHTML = `<p class="admin-help-text">No associated images yet.</p>`;
      return;
    }

    editExistingImages.forEach((img, index) => {
      const row = document.createElement("div");
      row.className = "admin-existing-image-item";
      row.innerHTML = `
        <img src="${img}" alt="Associated image">
        <div class="admin-existing-image-meta">
          <strong>${isUploadedImagePath(img) ? "Uploaded Image" : "Image URL"}</strong>
          <small title="${img}">${img}</small>
        </div>
        <button type="button" class="btn-admin btn-small btn-danger" data-remove-existing-image="${index}">Remove</button>
      `;
      const imageEl = row.querySelector("img");
      if (imageEl) {
        imageEl.addEventListener("error", () => {
          imageEl.onerror = null;
          imageEl.src = FALLBACK_IMAGE;
          imageEl.classList.add("image-fallback");
        });
      }
      editExistingImagesList.appendChild(row);
    });
  }

  function showEdit(product) {
    if (!editCard || !editForm) return;
    manageSection?.classList.add("hidden");
    createSection?.classList.add("hidden");
    editCard.classList.remove("hidden");
    editForm.id.value = product._id || product.id || "";
    editForm.name.value = product.name || "";
    editForm.category.value = canonicalCategory(product.category);
    populateBrandOptions(editForm, product.brand || "");
    editForm.price.value = Number(product.price || 0);
    editForm.stock_quantity.value = stockOf(product);
    editForm.short_description.value = product.short_description || "";
    editForm.description.value = product.description || "";
    if (editForm.specs) {
      editForm.specs.value = normalizeSpecsInput(product.specs);
    }
    editExistingImages = allImagesOf(product);
    const mainImage = imageOf(product) || editExistingImages[0] || "";
    editForm.image_url.value = mainImage;
    editForm.imageUrls.value = "";
    editForm.isFeatured.checked = featuredOf(product);
    setHomeSections(editForm, product.homeSections || []);
    renderExistingImagesManager();
    renderFormPreview(editForm, editMainPreview, editGalleryPreview);
    editCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showManage() {
    manageSection?.classList.remove("hidden");
    createSection?.classList.add("hidden");
    editCard?.classList.add("hidden");
  }

  function showCreate() {
    manageSection?.classList.add("hidden");
    editCard?.classList.add("hidden");
    createSection?.classList.remove("hidden");
    form?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function hideEdit(showList = false) {
    if (!editCard || !editForm) return;
    editCard.classList.add("hidden");
    editForm.reset();
    editExistingImages = [];
    setHomeSections(editForm, []);
    renderExistingImagesManager();
    renderFormPreview(editForm, editMainPreview, editGalleryPreview);
    if (showList) showManage();
  }

  async function loadProducts() {
    if (!listEl) return;
    listEl.innerHTML = "<div class='loading'>Loading products...</div>";
    const data = await apiFetch(`${API_BASE}/products`);
    const products = Array.isArray(data) ? data : Array.isArray(data.products) ? data.products : [];
    productsCache = products;

    const totalProducts = products.length;
    const featuredProducts = products.filter((p) => featuredOf(p)).length;
    const totalImages = products.reduce((sum, p) => sum + allImagesOf(p).length, 0);
    if (summaryTotalProductsEl) summaryTotalProductsEl.textContent = String(totalProducts);
    if (summaryFeaturedProductsEl) summaryFeaturedProductsEl.textContent = String(featuredProducts);
    if (summaryTotalImagesEl) summaryTotalImagesEl.textContent = String(totalImages);

    if (!products.length) {
      listEl.innerHTML = "";
      if (emptyStateEl) emptyStateEl.classList.remove("hidden");
      return;
    }
    if (emptyStateEl) emptyStateEl.classList.add("hidden");

    listEl.innerHTML = "";
    products.forEach((p) => {
      const id = p._id || p.id;
      const image = imageOf(p) || FALLBACK_IMAGE;
      const stock = stockOf(p);
      const imageCount = allImagesOf(p).length;
      const updated = p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "-";
      const sectionBadges = (Array.isArray(p.homeSections) ? p.homeSections : [])
        .map((key) => homeSectionNames[String(key).toLowerCase()] || key)
        .slice(0, 3)
        .map((label) => `<span class="product-section-badge">${label}</span>`)
        .join("");
      const card = document.createElement("div");
      card.className = "admin-product-card";
      card.innerHTML = `
        <div class="product-image">
          <img src="${image}" alt="${String(p.name || "")}">
          ${featuredOf(p) ? '<span class="featured-badge">Featured</span>' : ""}
          <span class="images-badge">${imageCount} ${imageCount === 1 ? "image" : "images"}</span>
        </div>
        <div class="product-details">
          <h3>${p.name || "-"}</h3>
          <div class="product-price">${Number(p.price || 0).toFixed(2)}</div>
          <div class="product-category">${categoryLabel(p.category)}</div>
          <div class="product-stock">
            Stock: ${stock}
            <span class="stock-indicator ${stockStatusClass(stock)}">${stock <= 0 ? "Out" : stock <= 5 ? "Low" : "In"}</span>
          </div>
          <p class="product-desc">${p.short_description || p.description || "-"}</p>
          ${sectionBadges ? `<div class="product-section-badges">${sectionBadges}</div>` : ""}
          <div class="product-meta-row">
            <span>Images: ${imageCount}</span>
            <span>Updated: ${updated}</span>
          </div>
        </div>
        <div class="product-actions">
          <button class="btn-admin btn-small btn-ghost" data-edit="${id}">Edit</button>
          <button class="btn-admin btn-small btn-danger" data-delete="${id}">Delete</button>
        </div>
      `;
      const img = card.querySelector("img");
      if (img) {
        img.addEventListener("error", () => {
          img.onerror = null;
          img.src = FALLBACK_IMAGE;
          img.classList.add("image-fallback");
        });
      }
      listEl.appendChild(card);
    });
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = buildPayloadFromForm(form);
    await apiFetch(`${API_BASE}/products`, { method: "POST", body: payload });
    form.reset();
    renderFormPreview(form, createMainPreview, createGalleryPreview);
    populateBrandOptions(form, "");
    if (toast) toast("Product created successfully", "success");
    await loadProducts();
    showManage();
  });

  editForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = editForm.id.value;
    if (!id) return;
    const payload = buildPayloadFromForm(editForm, { existingImages: editExistingImages });
    await apiFetch(`${API_BASE}/products/${id}`, { method: "PUT", body: payload });
    hideEdit(true);
    if (toast) toast("Product updated successfully", "success");
    await loadProducts();
  });

  cancelEditBtn?.addEventListener("click", () => hideEdit(true));
  showCreateBtn?.addEventListener("click", showCreate);
  backFromCreateBtn?.addEventListener("click", showManage);
  backFromEditBtn?.addEventListener("click", () => hideEdit(true));

  wirePreview(form, createMainPreview, createGalleryPreview);
  wirePreview(editForm, editMainPreview, editGalleryPreview);
  wireBrandDependency(form);
  wireBrandDependency(editForm);

  listEl?.addEventListener("click", async (e) => {
    const editBtn = e.target.closest("[data-edit]");
    if (editBtn) {
      const id = editBtn.getAttribute("data-edit");
      const product = productsCache.find((p) => String(p._id || p.id) === String(id));
      if (product) showEdit(product);
      return;
    }

    const delBtn = e.target.closest("[data-delete]");
    if (!delBtn) return;
    const id = delBtn.getAttribute("data-delete");
    const product = productsCache.find((p) => String(p._id || p.id) === String(id));
    const name = product?.name || "this product";
    const ok = await confirmAction?.(`Delete "${name}"?`, {
      title: "Delete Product",
      confirmText: "Delete",
    });
    if (!ok) return;
    await apiFetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
    if (toast) toast("Product deleted", "success");
    await loadProducts();
  });

  editExistingImagesList?.addEventListener("click", (e) => {
    const removeBtn = e.target.closest("[data-remove-existing-image]");
    if (!removeBtn) return;
    const idx = Number(removeBtn.getAttribute("data-remove-existing-image"));
    if (!Number.isInteger(idx) || idx < 0 || idx >= editExistingImages.length) return;
    const removed = editExistingImages[idx];
    editExistingImages.splice(idx, 1);

    if (String(editForm.image_url.value || "").trim() === String(removed || "").trim()) {
      editForm.image_url.value = editExistingImages[0] || "";
    }

    renderExistingImagesManager();
    renderFormPreview(editForm, editMainPreview, editGalleryPreview);
  });

  loadProducts().catch((err) => {
    console.error(err);
    if (toast) toast("Failed to load products", "error");
  });

  showManage();
})();
