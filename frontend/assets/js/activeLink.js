document.addEventListener("DOMContentLoaded", () => {
  try {
    // Optional: check token/session for consistency across all scripts
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ No auth token found. Some features may be limited.");
    }

    const path = window.location.pathname.split("/").pop(); // e.g. account.html
    const sidebarLinks = document.querySelectorAll(".account-sidebar a");

    sidebarLinks.forEach(link => {
      if (link.getAttribute("href") === path) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  } catch (err) {
    console.error("❌ Error in activeLinks.js:", err.message);
  }
});
