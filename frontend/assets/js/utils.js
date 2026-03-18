// utils.js - shared cart + helper functions

// --- Cart Helpers ---
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));

  // ✅ Fire global update event so badge & pages sync
  document.dispatchEvent(new Event("cart-updated"));
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + (item.quantity || 0), 0);
}

function getCartTotal() {
  return getCart().reduce(
    (sum, item) => sum + (item.quantity || 0) * Number(item.price || 0),
    0
  );
}

// --- Cart Modifiers ---
function addToCart(product, qty = 1) {
  let cart = getCart();
  const index = cart.findIndex((i) => i._id === product._id);

  if (index > -1) {
    cart[index].quantity += qty;
  } else {
    cart.push({ ...product, quantity: qty });
  }

  saveCart(cart);
  showToast(`${product.name} added to cart ✅`);
}

function removeFromCart(productId) {
  let cart = getCart().filter((i) => i._id !== productId);
  saveCart(cart);
  showToast("Removed from cart ❌", "error");
}

function clearCart() {
  saveCart([]);
  showToast("Cart cleared 🛒", "error");
}

// --- Format Helpers ---
function formatCurrency(amount, symbol = "₵") {
  return `${symbol}${Number(amount).toFixed(2)}`;
}

// --- Toast ---
function showToast(msg, type = "success") {
  let wrap = document.getElementById("toastWrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "toastWrap";
    wrap.style.position = "fixed";
    wrap.style.right = "16px";
    wrap.style.bottom = "16px";
    wrap.style.zIndex = "9999";
    document.body.appendChild(wrap);
  }
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.padding = "10px 14px";
  t.style.marginTop = "8px";
  t.style.borderRadius = "8px";
  t.style.background = type === "error" ? "#b00020" : "#0f9d58";
  t.style.color = "#fff";
  t.style.fontSize = "14px";
  t.style.boxShadow = "0 6px 20px rgba(0,0,0,.2)";
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}
