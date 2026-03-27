// assets/js/account-mobile-reveal.js
(function () {
  function isMobile() {
    return typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
  }

  function init() {
    const sidebar = document.querySelector(".account-layout .account-sidebar");
    const content = document.querySelector(".account-layout .account-content");
    if (!sidebar || !content) return;

    const openCurrentBtn = document.querySelector("[data-account-open-current]");
    const backBtn = document.querySelector("[data-account-back]");

    const showMenu = () => {
      if (!isMobile()) {
        sidebar.classList.remove("account-hidden");
        content.classList.remove("account-hidden");
        return;
      }
      content.classList.add("account-hidden");
      sidebar.classList.remove("account-hidden");
      sidebar.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const openContent = () => {
      content.classList.remove("account-hidden");
      if (isMobile()) {
        sidebar.classList.add("account-hidden");
        content.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        sidebar.classList.remove("account-hidden");
      }
    };

    openCurrentBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      openContent();
    });

    backBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      showMenu();
    });

    if (isMobile()) {
      showMenu();
    } else {
      openContent();
    }

    window.addEventListener("resize", () => {
      if (!isMobile()) {
        sidebar.classList.remove("account-hidden");
        content.classList.remove("account-hidden");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
