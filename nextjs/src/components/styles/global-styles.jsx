"use client";

const styles = `
:root {
  color-scheme: light;
  --panel: #ffffff;
  --panel-soft: #f8f2e6;
  --text: #1b1916;
  --muted: #7f7668;
  --line: #e8e0d4;
  --brand: #d9a441;
  --brand-strong: #b98014;
  --accent: #1d1a16;
  --danger: #c0392b;
  --shadow: 0 18px 60px rgba(27, 25, 22, 0.08);
}
* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; }
html, body {
  max-width: 100%;
  overflow-x: clip;
}
body {
  background:
    radial-gradient(circle at top, rgba(217, 164, 65, 0.12), transparent 30%),
    linear-gradient(180deg, #fcfaf6 0%, #f5f0e7 100%);
  color: var(--text);
  font-family: "Poppins", sans-serif;
}
img, svg, video, canvas {
  max-width: 100%;
}
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
.app-shell { min-height: 100vh; display: flex; flex-direction: column; max-width: 100%; overflow-x: clip; }
.app-content { flex: 1; }
.shell { width: min(1180px, calc(100vw - 32px)); margin: 0 auto; }
.site-header {
  position: sticky; top: 0; z-index: 20; backdrop-filter: blur(18px);
  background: rgba(255, 255, 255, 0.96); border-bottom: 1px solid rgba(232, 224, 212, 0.92);
}
.header-topbar {
  background: #171513; color: rgba(255, 255, 255, 0.82); font-size: 0.68rem;
  letter-spacing: 0.08em; text-transform: uppercase;
}
.header-topbar__inner {
  min-height: 36px; display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.header-inner {
  display: grid; grid-template-columns: auto auto; align-items: center; gap: 16px;
  min-height: 78px; padding: 12px 0;
}
.header-mobile-top {
  display: grid; grid-column: 1 / -1; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 12px;
}
.header-mobile-main {
  display: flex; align-items: center; gap: 14px; min-width: 0;
}
.header-mobile-quick-actions {
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
}
.brand-mark { display: inline-flex; align-items: center; gap: 12px; min-width: 0; }
.brand-mark__image { width: auto; height: 40px; object-fit: contain; }
.brand-mark--mobile .brand-mark__image { height: 42px; }
.brand-mark--desktop-shell .brand-mark__image { height: 46px; }
.brand-mark--desktop-shell {
  display: none;
}
.main-nav, .header-actions, .hero-actions, .stack-actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.main-nav {
  display: none;
}
.nav-link {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  padding: 10px 0; color: #423a2e; text-transform: uppercase; font-size: 0.72rem; font-weight: 600;
  letter-spacing: 0.14em;
}
.nav-link::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: -10px; height: 2px;
  border-radius: 999px; background: transparent; transition: background 180ms ease, transform 180ms ease;
  transform: scaleX(0.5);
}
.nav-link.is-active, .nav-link:hover { color: var(--text); }
.nav-link.is-active::after, .nav-link:hover::after { background: var(--brand); transform: scaleX(1); }
.header-icon-actions {
  margin-left: auto; display: flex; align-items: center; justify-content: flex-end; gap: 6px;
}
.mobile-header-search {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
}
.mobile-header-search .search-input {
  min-width: 0; height: 42px; border-radius: 12px; padding: 11px 14px 11px 40px;
  border-color: #dfd5c8;
  background: #fff;
}
.mobile-header-search__icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1b1916;
}
.mobile-header-search__icon {
  left: 12px;
  pointer-events: none;
}
.mobile-header-search__icon svg {
  width: 1rem;
  height: 1rem;
}
.icon-button {
  width: 42px; height: 42px; border: 1px solid transparent; border-radius: 999px; background: transparent;
  display: inline-flex; align-items: center; justify-content: center; color: var(--text); cursor: pointer;
  transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
}
.icon-button:hover { background: rgba(217, 164, 65, 0.1); border-color: rgba(217, 164, 65, 0.22); }
.icon-button svg { width: 1.1rem; height: 1.1rem; }
.icon-button--mobile {
  width: 30px; height: 30px; border: 0; border-radius: 0; background: transparent; flex-direction: column; gap: 4px;
  box-shadow: none; padding: 0;
}
.icon-button--mobile span {
  width: 18px; height: 2px; border-radius: 0; background: var(--text); display: block;
}
.icon-button--mobile-action {
  width: 28px; height: 28px; border: 0; border-radius: 0; background: transparent; padding: 0;
}
.icon-button--mobile-action svg {
  width: 1.12rem; height: 1.12rem;
}
.icon-button--desktop { display: none; }
.cart-button { position: relative; }
.cart-button span {
  position: absolute; top: -2px; right: -1px; min-width: 18px; height: 18px; padding: 0 4px;
  border-radius: 999px; background: var(--brand); color: #171513; font-size: 0.7rem; font-weight: 700;
  display: grid; place-items: center;
}
.mobile-menu {
  position: fixed; inset: 0; z-index: 2147483647; background: #ffffff;
  padding: max(18px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom));
  display: grid; grid-template-rows: auto auto 1fr auto; gap: 20px;
  min-height: 100dvh; width: 100vw; overflow-y: auto; overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch; isolation: isolate; touch-action: pan-y;
  opacity: 0; visibility: hidden; pointer-events: none; transform: translate3d(0, -16px, 0);
  transition: opacity 220ms ease, transform 220ms ease, visibility 220ms ease;
}
.mobile-menu.is-open { opacity: 1; visibility: visible; pointer-events: auto; transform: translate3d(0, 0, 0); }
.mobile-menu__header {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.mobile-menu__close {
  width: 44px; height: 44px; border: 1px solid var(--line); border-radius: 999px; background: white;
  display: inline-flex; align-items: center; justify-content: center; position: relative; cursor: pointer;
}
.mobile-menu__close span {
  position: absolute; width: 18px; height: 2px; border-radius: 999px; background: var(--text);
}
.mobile-menu__close span:first-child { transform: rotate(45deg); }
.mobile-menu__close span:last-child { transform: rotate(-45deg); }
.mobile-menu__search { display: grid; }
.mobile-menu__nav {
  display: grid; align-content: start; gap: 10px;
}
.mobile-menu__link {
  border: 1px solid rgba(232, 224, 212, 0.92); border-radius: 24px; background: rgba(255, 255, 255, 0.84);
  padding: 16px 18px; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.12em;
  box-shadow: var(--shadow);
}
.mobile-menu__link.is-active {
  border-color: rgba(217, 164, 65, 0.4); background: rgba(217, 164, 65, 0.12);
}
.mobile-menu__actions {
  display: grid; gap: 12px;
}
.search-form { width: 100%; }
.search-input, .field {
  width: 100%; border: 1px solid var(--line); border-radius: 16px; padding: 13px 15px;
  background: white; color: var(--text); outline: none;
}
.search-input:focus, .field:focus {
  border-color: rgba(15, 98, 254, 0.45); box-shadow: 0 0 0 4px rgba(15, 98, 254, 0.08);
}
.primary-link, .ghost-link, .primary-button, .ghost-button, .cart-pill {
  border: 0; border-radius: 999px; padding: 12px 18px; display: inline-flex;
  align-items: center; justify-content: center; gap: 10px; cursor: pointer;
}
.primary-link, .primary-button {
  background: linear-gradient(135deg, var(--brand), var(--brand-strong));
  color: #171513; box-shadow: var(--shadow); font-weight: 700;
}
.ghost-link, .ghost-button { background: white; color: var(--text); border: 1px solid var(--line); }
.cart-pill { background: var(--text); color: white; }
.cart-pill span {
  min-width: 26px; height: 26px; border-radius: 999px; display: grid; place-items: center;
  background: rgba(255,255,255,0.18);
}
.hero-section, .page-section { padding: 32px 0 48px; }
.hero-grid, .filters-panel, .cart-layout, .account-grid, .product-detail, .footer-grid, .admin-layout, .resource-grid {
  display: grid; gap: 18px;
}
.hero-grid { grid-template-columns: 1.4fr 1fr; }
.hero-grid h1, .section-header h1, .panel h1 { margin: 0; font-size: clamp(2rem, 5vw, 4rem); line-height: 1.02; }
.hero-copy, .section-kicker, .product-card__eyebrow, .auth-copy, .form-error, .muted { color: var(--muted); }
.section-kicker { text-transform: uppercase; letter-spacing: 0.16em; font-size: 0.78rem; font-weight: 700; }
.hero-banner {
  position: relative; overflow: hidden; min-height: 580px;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.05) 0 12%, transparent 12% 24%, rgba(255,255,255,0.04) 24% 36%, transparent 36% 48%, rgba(255,255,255,0.03) 48% 60%, transparent 60% 72%, rgba(255,255,255,0.03) 72% 84%, transparent 84% 100%),
    linear-gradient(180deg, #303030 0%, #1d1d1d 100%);
  box-shadow: 0 28px 70px rgba(16, 16, 16, 0.24);
  display: grid;
}
.hero-banner__inner {
  min-height: 580px; padding: 72px 22px 26px; display: grid; align-items: end; gap: 24px;
}
.hero-banner::before,
.hero-banner::after {
  content: ""; position: absolute; inset: auto; pointer-events: none;
}
.hero-banner::before {
  top: -8%; left: -20%; width: 140%; height: 140%;
  background:
    linear-gradient(125deg, transparent 0 14%, rgba(255,255,255,0.035) 14% 22%, transparent 22% 34%, rgba(255,255,255,0.03) 34% 42%, transparent 42% 56%, rgba(255,255,255,0.03) 56% 64%, transparent 64% 100%);
}
.hero-banner::after {
  right: -80px; top: 60px; width: 220px; height: 220px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.08), transparent 72%);
}
.hero-banner__inner,
.hero-banner__content,
.hero-banner__visual,
.hero-banner__arrow { position: relative; z-index: 1; }
.hero-banner__content {
  display: grid; gap: 14px; max-width: 320px; order: 2;
}
.hero-banner__eyebrow {
  margin: 0; color: #d69a3f; font-size: 0.86rem; font-weight: 600;
}
.hero-banner__content h1 {
  margin: 0; color: #f6f2eb; font-size: clamp(2rem, 8vw, 3.4rem); line-height: 1.02; font-weight: 400;
}
.hero-banner__content h1 span {
  display: block; margin-top: 8px; color: white; font-weight: 700;
}
.hero-banner .hero-copy {
  margin: 0; color: rgba(255,255,255,0.72); max-width: 30rem;
}
.hero-banner .hero-actions {
  gap: 12px; margin-top: 4px;
}
.hero-banner .primary-link {
  min-width: 124px; text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.72rem;
}
.hero-banner__ghost {
  background: rgba(255,255,255,0.08); color: white; border-color: rgba(255,255,255,0.14);
}
.hero-banner__visual {
  min-height: 270px; order: 1; display: flex; align-items: end; justify-content: center;
}
.hero-banner__arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 42px; height: 42px; border: 0; border-radius: 999px;
  background: rgba(255,255,255,0.04); color: white; display: inline-flex;
  align-items: center; justify-content: center; cursor: pointer;
}
.hero-banner__arrow span {
  width: 13px; height: 13px; display: block; border-top: 2px solid currentColor; border-right: 2px solid currentColor;
}
.hero-banner__arrow--left { left: 8px; }
.hero-banner__arrow--left span { transform: rotate(-135deg); margin-left: 4px; }
.hero-banner__arrow--right { right: 8px; }
.hero-banner__arrow--right span { transform: rotate(45deg); margin-right: 4px; }
.hero-speaker {
  position: relative; flex: 0 0 auto; background: linear-gradient(180deg, #2f2f2f 0%, #090909 100%);
  box-shadow: 0 18px 40px rgba(0,0,0,0.34), inset 0 0 0 1px rgba(255,255,255,0.04);
}
.hero-speaker--rear {
  width: 106px; height: 190px; border-radius: 34px; margin-right: -12px; margin-bottom: 18px;
}
.hero-speaker__top {
  position: absolute; left: 17px; right: 17px; top: 8px; height: 20px; border-radius: 999px;
  background: linear-gradient(180deg, #202020, #080808);
  box-shadow: inset 0 2px 6px rgba(255,255,255,0.06);
}
.hero-speaker__control {
  position: absolute; left: 50%; transform: translateX(-50%); width: 22px; border-radius: 999px;
  background: rgba(255,255,255,0.14);
}
.hero-speaker__control--one { top: 78px; height: 38px; width: 6px; }
.hero-speaker__control--two { top: 124px; height: 20px; width: 30px; }
.hero-speaker__control--three { top: 149px; height: 7px; width: 22px; }
.hero-speaker--main {
  width: 182px; height: 218px; border-radius: 42px; z-index: 1;
}
.hero-speaker--main::before {
  content: ""; position: absolute; inset: 6px; border-radius: 36px;
  background:
    radial-gradient(circle at 50% 34%, rgba(255,255,255,0.1), transparent 26%),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 3px),
    linear-gradient(180deg, #222 0%, #090909 100%);
}
.hero-speaker--main::after {
  content: ""; position: absolute; left: 20px; right: 20px; bottom: 8px; height: 4px; border-radius: 999px;
  background: linear-gradient(90deg, #137db8, #3de7fb, #137db8);
  box-shadow: 0 0 12px rgba(61,231,251,0.5);
}
.hero-speaker__halo {
  position: absolute; left: 50%; top: -28px; width: 104px; height: 18px; transform: translateX(-50%);
  border-radius: 999px; background: radial-gradient(ellipse at center, rgba(82,207,245,0.8), rgba(255,255,255,0.06) 62%, transparent 74%);
}
.hero-speaker__logo {
  position: absolute; left: 50%; top: 86px; transform: translateX(-50%) rotate(-16deg);
  color: white; font-size: 2.5rem; font-weight: 700; font-family: "Poppins", sans-serif;
  text-shadow: 0 0 10px rgba(255,255,255,0.2);
}
.category-showcase {
  display: grid; gap: 18px; padding: 28px 0 10px;
}
.service-banner {
  padding: 8px 0 6px;
}
.service-banner__grid {
  display: grid; gap: 12px;
}
.service-banner__card {
  border: 1px solid var(--line); background: rgba(255,255,255,0.84);
  padding: 16px 18px; display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: center;
}
.service-banner__icon {
  width: 42px; height: 42px; border-radius: 999px; display: grid; place-items: center;
  background: rgba(217, 164, 65, 0.12); color: var(--brand-strong);
}
.service-banner__icon svg {
  width: 1.2rem; height: 1.2rem;
}
.service-banner__copy {
  display: grid; gap: 4px;
}
.service-banner__copy strong {
  font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.12em;
}
.service-banner__copy span {
  color: var(--muted); font-size: 0.92rem;
}
.category-showcase__intro {
  display: grid; gap: 8px; max-width: 640px;
}
.category-showcase__intro h2 {
  margin: 0; font-size: clamp(1.6rem, 3vw, 2.4rem); line-height: 1.05;
}
.category-showcase__intro .hero-copy {
  margin: 0;
}
.category-showcase__grid {
  display: grid; gap: 12px;
}
.category-showcase__rail {
  display: grid; gap: 12px;
}
.category-tile {
  position: relative; overflow: hidden; min-height: 220px; border-radius: 0; background: #232323;
  box-shadow: 0 16px 44px rgba(16,16,16,0.14);
}
.category-tile--large,
.category-tile--featured {
  min-height: 320px;
}
.category-tile--compact {
  min-height: 190px;
}
.category-tile__media,
.category-tile__overlay,
.category-tile__content {
  position: absolute; inset: 0;
}
.category-art,
.category-tile__fallback {
  width: 100%; height: 100%; display: block; object-fit: cover;
}
.category-tile__fallback {
  background:
    linear-gradient(135deg, rgba(255,255,255,0.05) 0 12%, transparent 12% 24%, rgba(255,255,255,0.04) 24% 36%, transparent 36% 48%, rgba(255,255,255,0.03) 48% 60%, transparent 60% 72%, rgba(255,255,255,0.03) 72% 84%, transparent 84% 100%),
    linear-gradient(180deg, #303030 0%, #1d1d1d 100%);
}
.category-art {
  position: relative;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.05) 0 12%, transparent 12% 24%, rgba(255,255,255,0.04) 24% 36%, transparent 36% 48%, rgba(255,255,255,0.03) 48% 60%, transparent 60% 72%, rgba(255,255,255,0.03) 72% 84%, transparent 84% 100%),
    linear-gradient(180deg, #333 0%, #1b1b1b 100%);
}
.category-art__shape,
.category-art__glow {
  position: absolute; display: block;
}
.category-art__glow {
  width: 42%; height: 18%; left: 30%; top: 12%;
  border-radius: 999px; background: radial-gradient(ellipse at center, rgba(255,255,255,0.24), transparent 70%);
}
.category-art__shape--one {
  width: 46%; height: 56%; left: 27%; top: 20%; border-radius: 24px;
  background: linear-gradient(180deg, #171717, #2d2d2d);
  box-shadow: inset 0 0 0 2px rgba(255,255,255,0.08), 0 18px 32px rgba(0,0,0,0.3);
}
.category-art__shape--two {
  width: 26%; height: 10%; left: 37%; bottom: 18%; border-radius: 999px;
  background: linear-gradient(90deg, #0bb7ef, #83f4ff);
}
.category-art__shape--three {
  width: 18%; height: 18%; right: 18%; top: 18%; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%);
}
.category-art--laptops .category-art__shape--one,
.category-art--monitors .category-art__shape--one {
  left: 17%; right: 17%; top: 18%; bottom: 26%; border-radius: 14px;
  background: linear-gradient(180deg, #111, #2c2c2c);
  box-shadow: inset 0 0 0 3px rgba(255,255,255,0.08), 0 16px 28px rgba(0,0,0,0.28);
}
.category-art--laptops .category-art__shape--two,
.category-art--monitors .category-art__shape--two {
  left: 37%; right: 37%; bottom: 14%; height: 8%;
  background: linear-gradient(180deg, #252525, #090909);
  border-radius: 8px 8px 14px 14px;
}
.category-art--laptops .category-art__shape--three,
.category-art--monitors .category-art__shape--three {
  left: 28%; right: 28%; bottom: 9%; height: 4%;
  background: linear-gradient(90deg, #0b0b0b, #323232, #0b0b0b);
  border-radius: 999px;
}
.category-art--phones .category-art__shape--one,
.category-art--accessories .category-art__shape--one {
  width: 42%; height: 68%; left: 30%; top: 14%; border-radius: 28px;
  background: linear-gradient(180deg, #0e0e0e, #2d2d2d);
  box-shadow: inset 0 0 0 3px rgba(255,255,255,0.08), 0 18px 32px rgba(0,0,0,0.3);
  transform: rotate(-14deg);
}
.category-art--phones .category-art__shape--two,
.category-art--accessories .category-art__shape--two {
  width: 28%; height: 32%; left: 37%; top: 24%; border-radius: 18px;
  background: conic-gradient(from 180deg, #1fd1ff, #8eff8b, #f9d34d, #ff6d59, #1fd1ff);
  transform: rotate(-14deg);
}
.category-art--phones .category-art__shape--three,
.category-art--accessories .category-art__shape--three {
  width: 8%; height: 4%; left: 47%; bottom: 20%; border-radius: 999px;
  background: rgba(255,255,255,0.25); transform: rotate(-14deg);
}
.category-art--storage .category-art__shape--one,
.category-art--others .category-art__shape--one {
  width: 44%; height: 58%; left: 28%; top: 20%; border-radius: 28px;
  background: linear-gradient(180deg, #1b1b1b, #060606);
  box-shadow: inset 0 0 0 2px rgba(255,255,255,0.06), 0 18px 36px rgba(0,0,0,0.28);
  transform: rotate(-22deg);
}
.category-art--storage .category-art__shape--two,
.category-art--others .category-art__shape--two {
  width: 16%; height: 8%; left: 42%; bottom: 22%; border-radius: 999px;
  background: linear-gradient(90deg, #00b3ff, #7af7ff);
  box-shadow: 0 0 10px rgba(72,226,255,0.45);
  transform: rotate(-22deg);
}
.category-art--storage .category-art__shape--three,
.category-art--others .category-art__shape--three {
  width: 20%; height: 20%; right: 16%; top: 18%; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%);
}
.category-art--audio .category-art__shape--one {
  width: 56%; height: 44%; left: 22%; top: 30%;
  border-radius: 999px 999px 44px 44px;
  background: linear-gradient(180deg, #1b1b1b, #050505);
  box-shadow: inset 0 0 0 2px rgba(255,255,255,0.07), 0 18px 36px rgba(0,0,0,0.32);
}
.category-art--audio .category-art__shape--two {
  width: 24%; height: 24%; left: 38%; top: 14%;
  border-radius: 50%;
  background: transparent;
  box-shadow: 0 0 0 12px #141414, 0 0 0 16px rgba(255,255,255,0.08);
}
.category-art--audio .category-art__shape--three {
  width: 38%; height: 3%; left: 31%; bottom: 18%;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, #16d1ff, transparent);
}
.category-art--gaming .category-art__shape--one {
  width: 60%; height: 40%; left: 20%; top: 38%;
  border-radius: 44px;
  background: linear-gradient(180deg, #1d1d1d, #050505);
  box-shadow: inset 0 0 0 2px rgba(255,255,255,0.06), 0 18px 36px rgba(0,0,0,0.32);
}
.category-art--gaming .category-art__shape--two {
  width: 12%; height: 12%; left: 30%; top: 49%;
  border-radius: 50%;
  background: radial-gradient(circle, #5f5f5f, #111 70%);
  box-shadow: 28px 4px 0 -6px #2a2a2a, 40px -8px 0 -7px #2a2a2a, 54px 4px 0 -6px #2a2a2a;
}
.category-art--gaming .category-art__shape--three {
  width: 12%; height: 12%; right: 30%; top: 49%;
  border-radius: 50%;
  background: radial-gradient(circle, #5f5f5f, #111 70%);
}
.category-art--camera .category-art__shape--one {
  width: 44%; height: 52%; left: 28%; top: 24%;
  border-radius: 24px;
  background: linear-gradient(180deg, #202020, #070707);
  box-shadow: inset 0 0 0 2px rgba(255,255,255,0.07), 0 18px 36px rgba(0,0,0,0.3);
}
.category-art--camera .category-art__shape--two {
  width: 20%; height: 20%; left: 40%; top: 38%;
  border-radius: 50%;
  background: radial-gradient(circle, #676767, #151515 64%, #030303 100%);
  box-shadow: 0 0 0 10px #101010;
}
.category-art--camera .category-art__shape--three {
  width: 6%; height: 24%; right: 23%; top: 22%;
  border-radius: 999px;
  background: linear-gradient(180deg, #2c2c2c, #0d0d0d);
}
.category-art--printers .category-art__shape--one {
  left: 19%; right: 19%; top: 26%; height: 34%; border-radius: 20px;
  background: linear-gradient(180deg, #2c2c2c, #0e0e0e);
  box-shadow: inset 0 0 0 2px rgba(255,255,255,0.07), 0 18px 36px rgba(0,0,0,0.3);
}
.category-art--printers .category-art__shape--two {
  left: 27%; right: 27%; top: 17%; height: 16%; border-radius: 14px 14px 8px 8px;
  background: linear-gradient(180deg, #353535, #171717);
}
.category-art--printers .category-art__shape--three {
  left: 31%; right: 31%; bottom: 20%; height: 12%; border-radius: 0 0 12px 12px;
  background: linear-gradient(180deg, #ececec, #bdbdbd);
}
.category-art--monitors .category-art__shape--one {
  left: 13%; right: 13%;
}
.category-art--accessories .category-art__shape--one {
  width: 54%; height: 40%; left: 23%; top: 32%;
  border-radius: 999px 999px 42px 42px;
  transform: none;
}
.category-art--accessories .category-art__shape--two {
  width: 22%; height: 22%; left: 39%; top: 14%;
  border-radius: 50%; background: transparent;
  box-shadow: 0 0 0 12px #161616, 0 0 0 16px rgba(255,255,255,0.08);
  transform: none;
}
.category-art--accessories .category-art__shape--three {
  width: 34%; height: 3%; left: 33%; bottom: 18%;
  background: linear-gradient(90deg, transparent, #18d0ff, transparent);
  transform: none;
}
.category-art--tablets .category-art__shape--one,
.category-art--phones-tablets .category-art__shape--one {
  width: 52%; height: 70%; left: 24%; top: 14%; border-radius: 22px;
  background: linear-gradient(180deg, #121212, #2d2d2d);
  box-shadow: inset 0 0 0 2px rgba(255,255,255,0.08), 0 18px 32px rgba(0,0,0,0.28);
}
.category-art--tablets .category-art__shape--two,
.category-art--phones-tablets .category-art__shape--two {
  width: 40%; height: 56%; left: 30%; top: 21%; border-radius: 12px;
  background: radial-gradient(circle at 40% 35%, #51d7ff, #0f3661 60%, #04121f 100%);
}
.category-art--tablets .category-art__shape--three,
.category-art--phones-tablets .category-art__shape--three {
  width: 5%; height: 5%; left: 47.5%; bottom: 17%; border-radius: 50%; background: rgba(255,255,255,0.35);
}
.category-art--watches .category-art__shape--one,
.category-art--smart-watches .category-art__shape--one {
  width: 34%; height: 76%; left: 33%; top: 12%; border-radius: 24px;
  background: linear-gradient(180deg, #151515, #2e2e2e);
  box-shadow: 0 14px 30px rgba(0,0,0,0.28);
}
.category-art--watches .category-art__shape--two,
.category-art--smart-watches .category-art__shape--two {
  width: 24%; height: 28%; left: 38%; top: 35%; border-radius: 14px;
  background: conic-gradient(from 180deg, #18d0ff, #8cff75, #f5cf4e, #ff645c, #18d0ff);
}
.category-art--watches .category-art__shape--three,
.category-art--smart-watches .category-art__shape--three {
  width: 8%; height: 8%; left: 46%; top: 45%; border-radius: 50%; background: rgba(255,255,255,0.18);
}
.category-tile__overlay {
  background: linear-gradient(180deg, rgba(10,10,10,0.08) 0%, rgba(10,10,10,0.52) 56%, rgba(10,10,10,0.88) 100%);
}
.category-tile__content {
  inset: auto 0 0 0; padding: 18px; display: grid; gap: 8px; z-index: 1;
}
.category-tile__count,
.category-tile__cta {
  text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.68rem; font-weight: 700;
}
.category-tile__count {
  color: rgba(255,255,255,0.68);
}
.category-tile__content h2 {
  margin: 0; color: white; font-size: clamp(1.25rem, 4vw, 2rem); line-height: 1.05;
}
.category-tile__cta {
  color: var(--brand);
}
.hero-panel, .panel, .product-card {
  background: var(--panel); border: 1px solid rgba(217, 226, 240, 0.95); border-radius: 28px; box-shadow: var(--shadow);
}
.hero-panel, .panel { padding: 24px; }
.field-group { display: grid; gap: 8px; }
.disabled-field { background: #f5f7fb; color: var(--muted); }
.filters-panel { grid-template-columns: 1.6fr 220px; margin-bottom: 20px; }
.shop-hero {
  display: grid;
  justify-items: center;
  gap: 6px;
  margin-bottom: 18px;
  padding: 4px 0 8px;
  text-align: center;
  background: transparent;
}
.shop-hero h1 {
  margin: 0;
  font-size: clamp(1.7rem, 5vw, 2.2rem);
  line-height: 1.08;
  font-weight: 700;
}
.shop-hero__crumbs {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.shop-hero__crumbs a:hover {
  color: var(--text);
}
.shop-hero__intro {
  margin: 2px 0 0;
  max-width: 42rem;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.6;
}
.shop-layout {
  display: grid; gap: 14px;
}
.shop-sidebar,
.shop-toolbar {
  border-radius: 0;
}
.shop-sidebar {
  display: grid; gap: 18px; align-content: start; position: sticky; top: 110px; align-self: start; height: fit-content;
}
.shop-sidebar__section {
  display: grid; gap: 12px;
}
.shop-sidebar__section h3,
.shop-sidebar__heading h2 {
  margin: 0; font-size: 0.98rem; color: var(--text);
}
.shop-sidebar__heading {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.shop-clear-button {
  border: 0; background: transparent; color: var(--brand-strong); font-weight: 700; cursor: pointer;
}
.shop-filter-list {
  display: flex; flex-wrap: wrap; gap: 8px;
}
.shop-filter-stack {
  display: grid; gap: 6px;
}
.shop-filter-option {
  width: 100%; border: 0; background: transparent; color: #473f36;
  padding: 6px 0; display: grid; grid-template-columns: 16px minmax(0, 1fr) auto;
  gap: 10px; align-items: center; text-align: left; cursor: pointer;
}
.shop-filter-option__mark {
  width: 11px; height: 11px; border: 1px solid #9b927f; border-radius: 0; display: block;
}
.shop-filter-option.is-active .shop-filter-option__mark {
  background: #183d17; border-color: #183d17;
}
.shop-filter-option__label {
  font-size: 0.82rem; line-height: 1.35;
}
.shop-filter-option__count {
  font-size: 0.74rem; color: var(--muted);
}
.shop-filter-chip {
  border: 1px solid rgba(217, 164, 65, 0.18); background: #fff; color: #4d4338;
  padding: 10px 12px; border-radius: 999px; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px; font-size: 0.82rem; font-weight: 600;
}
.shop-filter-chip span {
  min-width: 20px; height: 20px; border-radius: 999px; background: rgba(217, 164, 65, 0.12);
  display: grid; place-items: center; font-size: 0.72rem;
}
.shop-filter-chip.is-active {
  background: linear-gradient(135deg, #1d1a16, #3d352c); color: #fff; border-color: #1d1a16;
}
.shop-filter-chip.is-active span {
  background: rgba(255,255,255,0.16);
}
.shop-content {
  display: grid; gap: 14px;
}
.shop-toolbar {
  display: grid; gap: 14px; padding: 16px;
}
.shop-toolbar__summary {
  display: grid; gap: 10px;
}
.shop-active-filters {
  display: flex; flex-wrap: wrap; gap: 8px;
}
.shop-active-filter {
  border: 0; border-radius: 999px; background: rgba(217, 164, 65, 0.14); color: #5e4517;
  padding: 8px 12px; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 700;
}
.shop-active-filter span {
  font-size: 1rem; line-height: 1;
}
.shop-mobile-bar,
.shop-drawer {
  display: none;
}
.shop-drawer {
  position: fixed; inset: 0; z-index: 2147483647; background: rgba(17, 16, 14, 0.42);
}
.shop-drawer__header {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 18px 16px; border-bottom: 1px solid #e6dfd3; background: #fff;
}
.shop-drawer__header h2 {
  margin: 0; font-size: 1.05rem;
}
.shop-drawer__close {
  border: 0; background: transparent; color: #1f1d1b; font-weight: 700; cursor: pointer;
}
.shop-drawer__body {
  background: #fff; height: calc(100dvh - 68px); overflow-y: auto; padding: 16px;
  display: grid; gap: 18px;
}
.products-results {
  margin: 0; color: var(--muted); font-size: 0.88rem; font-weight: 600;
}
.shop-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0 2px;
}
.shop-pagination__pages {
  display: flex;
  align-items: center;
  gap: 6px;
}
.shop-pagination__arrow,
.shop-pagination__page {
  border: 0;
  background: transparent;
  color: #2a251e;
  min-width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1;
}
.shop-pagination__arrow:disabled,
.shop-pagination__page:disabled {
  opacity: 0.4;
  cursor: default;
}
.shop-pagination__page.is-active {
  min-width: 24px;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #183d17;
  color: #ffffff;
}
.shop-pagination__ellipsis {
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0 2px;
}
.homepage-products {
  display: grid; gap: 20px;
}
.homepage-products__header {
  display: grid; gap: 14px; align-items: end;
}
.homepage-products__controls {
  display: grid; gap: 12px;
}
.homepage-products__title {
  display: grid; gap: 6px;
}
.homepage-products__title h2 {
  margin: 0; font-size: clamp(1.65rem, 3vw, 2.35rem); line-height: 1.04;
}
.homepage-products__tabs {
  display: flex; gap: 18px; flex-wrap: wrap; align-items: center;
  border-bottom: 1px solid #ece7de; padding-bottom: 8px;
}
.homepage-products__tab {
  border: 0; background: transparent; padding: 0 0 10px; cursor: pointer;
  text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.7rem; font-weight: 700;
  color: var(--muted); position: relative;
}
.homepage-products__tab::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: -9px; height: 2px;
  background: transparent;
}
.homepage-products__tab.is-active {
  color: var(--text);
}
.homepage-products__tab.is-active::after {
  background: var(--brand);
}
.homepage-products__view-all {
  display: inline-flex; align-items: center; justify-content: center;
  text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.72rem; font-weight: 700;
  color: var(--text);
}
.product-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0;
  border-top: 1px solid #ece7de; border-left: 1px solid #ece7de;
  background: #fff;
}
.product-grid--catalog {
  gap: 14px; border: 0; background: transparent;
}
.product-card {
  overflow: hidden; background: #fff; min-width: 0; border-radius: 0;
  border: 0; border-right: 1px solid #ece7de; border-bottom: 1px solid #ece7de; box-shadow: none;
}
.product-card--catalog {
  display: grid; grid-template-rows: auto 1fr auto;
  border: 1px solid #e6dfd3; border-radius: 0;
  box-shadow: none;
  transition: transform 180ms ease, box-shadow 180ms ease;
}
.product-card--catalog:hover {
  transform: translateY(-1px);
  box-shadow: none;
}
.product-card__link {
  display: grid; min-height: 100%; color: inherit; grid-template-rows: auto 1fr;
}
.product-card__link--media {
  min-height: 0;
}
.product-card__media-wrap {
  position: relative;
}
.product-card--home {
  position: relative;
  overflow: hidden;
}
.product-card__media {
  position: relative; aspect-ratio: 1 / 1.05; background: #fff;
  display: grid; place-items: center; padding: 8px;
}
.product-card--catalog .product-card__media {
  padding: 0;
  background: #f7f3ec;
  aspect-ratio: 1 / 1;
}
.product-card--related .product-card__media {
  padding: 0;
  background: #fbfaf7;
  aspect-ratio: 1 / 1;
}
.product-card__image-shell {
  width: 100%; height: 100%; display: grid; place-items: center; overflow: hidden;
}
.product-card--catalog .product-card__image-shell {
  border-radius: 0;
}
.product-card--related .product-card__image-shell {
  border-radius: 0;
}
.product-card__media img, .product-detail img {
  width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;
}
.product-card__placeholder {
  width: 100%; height: 100%; min-height: 180px; display: grid; place-items: center; color: var(--muted);
}
.product-card__body { padding: 10px 10px 14px; display: grid; gap: 6px; align-content: start; min-height: 88px; }
.product-card__body h3 { margin: 0; font-size: 0.82rem; line-height: 1.35; font-weight: 400; color: #737685; }
.product-card__title-link {
  color: inherit;
}
.product-card__body h3 {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.product-card--catalog .product-card__body {
  padding: 12px 12px 10px;
  gap: 8px;
  min-height: 0;
}
.product-card--catalog .product-card__body h3 {
  font-size: 0.82rem; line-height: 1.45; font-weight: 700; color: #22201d;
  text-transform: uppercase;
}
.product-card--related {
  border: 1px solid #f0ebe2;
  border-radius: 0;
  box-shadow: none;
}
.product-card--related .product-card__body {
  padding: 10px 8px 12px;
  gap: 6px;
  min-height: 0;
}
.product-card__meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.product-card__category {
  margin: 0;
  font-size: 0.62rem;
  line-height: 1.4;
  color: #a29a8b;
  text-transform: none;
}
.product-card--related .product-card__body h3 {
  font-size: 0.86rem;
  line-height: 1.45;
  font-weight: 600;
  color: #2b2823;
}
.product-card--related .product-card__description {
  font-size: 0.66rem;
  color: #a29a8b;
  -webkit-line-clamp: 1;
  text-transform: none;
}
.product-card--related .product-card__price {
  color: #1f1d1b;
  font-size: 0.92rem;
  font-weight: 800;
}
.product-card--related .product-card__rating {
  justify-content: flex-start;
  font-size: 0.62rem;
  margin-top: 0;
  flex: 0 0 auto;
}
.product-card--related .product-card__rating strong {
  display: none;
}
.product-card__rating {
  margin: 0; color: #dbd3bf; font-size: 0.68rem; letter-spacing: 0.08em;
  display: flex; gap: 2px; align-items: center;
}
.product-card__rating .is-filled {
  color: #f0bf3f;
}
.product-card__rating strong {
  margin-left: 6px; font-size: 0.76rem; color: #5c503f;
}
.product-card__description {
  margin: 0; font-size: 0.72rem; line-height: 1.45; color: #817567;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.product-card__price {
  margin: 0; color: #1f1d1b; font-size: 0.95rem; font-weight: 700;
}
.product-card--catalog .product-card__price {
  font-size: 0.98rem; font-weight: 800; color: #7c9b0f;
}
.product-card__icon-button {
  width: 36px; height: 36px; border: 0; border-radius: 0;
  background: transparent; color: var(--text);
  display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
  box-shadow: none;
  transition: transform 180ms ease, background 180ms ease, color 180ms ease, border-color 180ms ease;
}
.product-card__icon-button:hover {
  transform: none;
}
.product-card__icon-button.is-active {
  background: #f3efe7; color: #171513; border-color: transparent;
}
.product-card__icon-button svg,
.product-card__cart-button svg {
  width: 1rem; height: 1rem;
}
.product-card__icon-button--footer {
  background: transparent; box-shadow: none;
}
.product-card__icon-asset {
  width: 16px; height: 16px; object-fit: contain; display: block;
}
.product-card__footer {
  padding: 0; display: grid; gap: 0;
  border-top: 1px solid #e6dfd3;
}
.product-card__footer--reveal {
  display: none;
}
.product-card__footer-actions {
  display: grid; grid-template-columns: 36px minmax(0, 1fr) 36px; align-items: stretch; gap: 0;
}
.product-card__cart-button {
  width: 100%; min-height: 36px; border: 0; border-radius: 0;
  background: transparent;
  color: #4a443b; font-weight: 700; font-size: 0.68rem; text-transform: uppercase;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  cursor: pointer; box-shadow: none;
  border-left: 1px solid #e6dfd3; border-right: 1px solid #e6dfd3;
  transition: background 180ms ease, color 180ms ease, box-shadow 180ms ease;
}
.product-card__cart-button:hover {
  filter: none;
}
.product-card__cart-button.is-in-cart {
  background: #173d16;
  color: #ffffff;
}
.product-card__cart-button.is-just-added {
  box-shadow: inset 0 0 0 2px rgba(217, 164, 65, 0.9);
}
.product-card__cart-button:disabled {
  background: transparent; box-shadow: none; cursor: not-allowed; color: #a0978a;
}
@media (hover: hover) and (pointer: fine) and (min-width: 900px) {
  .product-card--home .product-card__footer--reveal {
    display: grid;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    border-top: 1px solid #e6dfd3;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    transform: translateY(100%);
    opacity: 0;
    pointer-events: none;
    transition: transform 200ms ease, opacity 200ms ease;
  }
  .product-card--home:hover .product-card__footer--reveal,
  .product-card--home:focus-within .product-card__footer--reveal {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
}
.product-detail__stats { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; align-items: center; }
.product-detail { grid-template-columns: 1.05fr 1fr; align-items: start; }
.product-breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  color: var(--muted);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.product-breadcrumbs a:hover {
  color: var(--text);
}
.product-detail-view {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: 28px;
  align-items: start;
}
.product-gallery,
.product-summary,
.product-tabs {
  border-radius: 0;
}
.product-gallery {
  display: grid;
  gap: 18px;
}
.product-gallery__stage {
  position: relative;
}
.product-gallery__main {
  aspect-ratio: 1 / 1;
  background: #f8f5f0;
  display: grid;
  place-items: center;
  overflow: hidden;
  padding: 0;
  border: 0;
  border-radius: 10px;
}
.product-gallery__preview-trigger {
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  padding: 0;
  cursor: zoom-in;
}
.product-gallery__main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.product-gallery__stage-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border: 0;
  border-radius: 12px;
  background: #184d22;
  color: #fff;
  font-size: 2rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
}
.product-gallery__stage-arrow--left {
  left: -28px;
}
.product-gallery__stage-arrow--right {
  right: -28px;
}
.product-gallery__selector {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) 36px;
  gap: 12px;
  align-items: center;
}
.product-gallery__arrow {
  border: 0;
  background: transparent;
  color: #40372d;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 72px;
}
.product-gallery__thumbs {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  min-width: 0;
}
.product-gallery__thumbs::-webkit-scrollbar {
  display: none;
}
.product-gallery__thumb {
  border: 1px solid #ddd2c1;
  background: #ffffff;
  padding: 0;
  cursor: pointer;
  flex: 0 0 118px;
  min-height: 84px;
  overflow: hidden;
  border-radius: 10px;
}
.product-gallery__thumb.is-active {
  border-color: #23201b;
  box-shadow: inset 0 0 0 1px #23201b;
}
.product-gallery__thumb img {
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
}
.product-summary {
  display: grid;
  gap: 14px;
  align-content: start;
}
.product-summary__eyebrow {
  margin: 0;
  color: var(--muted);
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.product-summary h1 {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 2.3rem);
  line-height: 1.08;
}
.product-summary__rating {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f0bf3f;
  font-size: 0.82rem;
}
.product-summary__rating strong {
  color: #2c271f;
}
.product-summary__rating small {
  color: var(--muted);
}
.product-summary__price {
  margin: 0;
  color: #1f1d1b;
  font-size: 1.5rem;
  font-weight: 800;
}
.product-summary__copy {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}
.product-summary__buy {
  display: grid;
  grid-template-columns: 128px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
}
.product-summary__qty-control {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 42px;
  gap: 0;
  align-items: stretch;
  min-width: 128px;
}
.product-summary__qty-button {
  border: 1px solid #d8d0c3;
  background: #fff;
  color: #1f1d1b;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
}
.product-summary__qty {
  width: 100%;
  text-align: center;
  min-height: 48px;
  border-radius: 0;
  border-left: 0;
  border-right: 0;
  padding: 0 6px;
  appearance: textfield;
  -moz-appearance: textfield;
}
.product-summary__qty::-webkit-outer-spin-button,
.product-summary__qty::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.product-summary__cart {
  min-height: 48px;
  border-radius: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.product-summary__inline-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  align-items: stretch;
}
.product-summary__icon-action {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
  color: #2a251e;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px 12px;
  text-align: center;
  transition: border-color 180ms ease, background 180ms ease, color 180ms ease, transform 180ms ease;
}
.product-summary__icon-action svg,
.product-summary__icon-action span[aria-hidden="true"] {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}
.product-summary__icon-action:hover {
  border-color: rgba(217, 164, 65, 0.35);
  background: rgba(217, 164, 65, 0.08);
  transform: translateY(-1px);
}
.product-summary__icon-action.is-active {
  border-color: rgba(217, 164, 65, 0.45);
  background: rgba(217, 164, 65, 0.12);
  color: #173d16;
}
.product-summary__meta {
  display: grid;
  gap: 6px;
  padding-top: 8px;
  border-top: 1px solid #ece7de;
  color: var(--muted);
}
.product-summary__meta p {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.product-summary__meta strong {
  color: var(--text);
}
.product-summary__stock-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 18px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 500;
}
.product-summary__stock-badge.is-in-stock {
  color: #2ca66a;
  border-color: rgba(44, 166, 106, 0.48);
  background: rgba(44, 166, 106, 0.08);
}
.product-summary__stock-badge.is-out-of-stock {
  color: #b42318;
  border-color: rgba(180, 35, 24, 0.35);
  background: rgba(180, 35, 24, 0.08);
}
.product-summary__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.product-summary__actions .ghost-button {
  border-radius: 0;
}
.product-summary__social {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  color: var(--muted);
}
.product-summary__social p {
  margin: 0;
  font-weight: 500;
}
.product-summary__social-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
}
.product-summary__social-links a {
  width: 24px;
  height: 24px;
  color: #2a251e;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: color 180ms ease, transform 180ms ease;
}
.product-summary__social-links a:hover {
  color: var(--brand-strong);
  transform: translateY(-1px);
}
.product-summary__social-links svg,
.product-summary__social-links span[aria-hidden="true"] {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.product-preview {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  background: rgba(255, 255, 255, 0.98);
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) 56px;
  grid-template-rows: 56px minmax(0, 1fr) auto;
  align-items: center;
  gap: 18px;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  overscroll-behavior: contain;
  padding: 16px 20px 18px;
}
.product-preview__close {
  grid-column: 3;
  grid-row: 1;
  justify-self: end;
  width: 44px;
  height: 44px;
  border: 0;
  background: transparent;
  color: #1f1d1b;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
}
.product-preview__stage {
  grid-column: 2;
  grid-row: 2;
  display: grid;
  place-items: center;
  min-height: 0;
  width: 100%;
  height: 100%;
}
.product-preview__stage img {
  width: min(100%, 1200px);
  max-width: 100%;
  max-height: calc(100dvh - 230px);
  object-fit: contain;
  display: block;
  border-radius: 0;
}
.product-preview__arrow {
  width: 56px;
  height: 56px;
  border: 0;
  border-radius: 0;
  background: #184d22;
  color: #ffffff;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.product-preview__arrow--left {
  grid-column: 1;
  grid-row: 2;
}
.product-preview__arrow--right {
  grid-column: 3;
  grid-row: 2;
}
.product-preview__thumbs {
  grid-column: 1 / -1;
  grid-row: 3;
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 40px;
  align-items: center;
  gap: 10px;
  width: min(100%, 540px);
  justify-self: center;
}
.product-preview__thumb-arrow {
  width: 40px;
  height: 40px;
  border: 0;
  background: transparent;
  color: #40372d;
  font-size: 1.8rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.product-preview__thumb-rail {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  min-width: 0;
  justify-content: center;
}
.product-preview__thumb-rail::-webkit-scrollbar {
  display: none;
}
.product-preview__thumb {
  width: 74px;
  height: 74px;
  flex: 0 0 74px;
  border: 1px solid #ddd2c1;
  background: #fff;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  border-radius: 0;
}
.product-preview__thumb.is-active {
  border-color: #184d22;
  box-shadow: inset 0 0 0 1px #184d22;
}
.product-preview__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.product-tabs {
  margin-top: 28px;
  display: grid;
  gap: 18px;
}
.product-tabs__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  justify-content: center;
  border-bottom: 1px solid #ece7de;
  padding-bottom: 12px;
}
.product-tabs__tab {
  border: 0;
  background: transparent;
  padding: 0 0 10px;
  cursor: pointer;
  color: var(--muted);
  font-weight: 700;
}
.product-tabs__tab.is-active {
  color: #c64b2b;
  box-shadow: inset 0 -2px 0 #c64b2b;
}
.product-tabs__body {
  display: grid;
}
.product-tabs__panel {
  color: var(--muted);
  line-height: 1.8;
}
.product-tabs__panel p {
  margin: 0;
}
.product-tabs__panel--specs {
  display: grid;
  gap: 10px;
}
.product-spec-row {
  display: grid;
  grid-template-columns: minmax(120px, 180px) minmax(0, 1fr);
  gap: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0ebe2;
}
.product-spec-row span {
  color: var(--muted);
  text-transform: capitalize;
}
.product-review {
  display: grid;
  gap: 6px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0ebe2;
}
.product-review-overview {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 26px;
  padding-bottom: 22px;
  border-bottom: 1px solid #f0ebe2;
}
.product-review-overview__score {
  display: grid;
  justify-items: start;
  gap: 8px;
}
.product-review-overview__score strong {
  font-size: 2.3rem;
  line-height: 1;
  color: var(--text);
}
.product-review-overview__score span,
.product-review-overview__score small {
  color: var(--muted);
}
.product-review-overview__bars {
  display: grid;
  gap: 10px;
}
.product-review-bar {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr) 36px;
  align-items: center;
  gap: 12px;
  color: var(--muted);
  font-size: 0.86rem;
}
.product-review-bar strong {
  color: var(--text);
  font-size: 0.82rem;
}
.product-review-bar__track {
  width: 100%;
  height: 6px;
  background: #efe9dd;
  overflow: hidden;
}
.product-review-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, #f0bf3f, #d9a441);
}
.product-review-actions {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 0 8px;
}
.product-review-actions__copy {
  display: grid;
  gap: 6px;
}
.product-review-actions__copy h3,
.product-review-form h3,
.product-review h4 {
  margin: 0;
}
.product-review-actions__copy p,
.product-review-form p {
  margin: 0;
  color: var(--muted);
}
.product-review-actions__sort {
  display: grid;
  gap: 6px;
  min-width: 180px;
}
.product-review-actions__sort span {
  color: var(--muted);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.product-review-shell {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}
.product-review-list {
  display: grid;
  gap: 0;
}
.product-review p {
  margin: 0;
  line-height: 1.7;
}
.product-review__header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;
}
.product-review__identity {
  display: flex;
  align-items: center;
  gap: 12px;
}
.product-review__header > div {
  display: grid;
  gap: 4px;
}
.product-review__header time,
.product-review__verified {
  color: var(--muted);
  font-size: 0.82rem;
}
.product-review__avatar {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: linear-gradient(135deg, #efe3cf, #d9a441);
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.06em;
}
.product-review__media {
  width: 110px;
  height: 110px;
  overflow: hidden;
  background: #fbfaf7;
}
.product-review__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product-review-form {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid #f0ebe2;
  background: #fff;
  align-content: start;
}
.product-review-form--full {
  margin-top: 28px;
}
.product-review-form label {
  display: grid;
  gap: 8px;
}
.product-review-form label span {
  color: var(--muted);
  font-size: 0.84rem;
}
.product-review-form textarea.field {
  min-height: 128px;
  resize: vertical;
}
.product-review-form__submit {
  width: fit-content;
  min-width: 0;
  padding: 12px 28px;
  border-radius: 999px;
  justify-self: start;
}
.related-products {
  margin-top: 44px;
  display: grid;
  gap: 18px;
}
.related-products__header {
  text-align: center;
  display: grid;
  justify-items: center;
  gap: 8px;
}
.related-products__header h2 {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2rem);
}
.related-products__header::after {
  content: "";
  width: 38px;
  height: 8px;
  background:
    radial-gradient(circle at 4px 4px, transparent 4px, transparent 0),
    linear-gradient(90deg, transparent 0 4px, #d9a0a6 4px 10px, transparent 10px 14px, #d9a0a6 14px 20px, transparent 20px 24px, #d9a0a6 24px 30px, transparent 30px 100%);
  opacity: 0.95;
}
.related-products__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.cart-hero {
  padding: 28px 0 32px;
  text-align: center;
  display: grid;
  gap: 10px;
}
.cart-hero h1 {
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 1.04;
}
.cart-hero__crumbs {
  margin: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #3d372f;
  font-size: 1rem;
}
.cart-layout {
  grid-template-columns: 1.8fr 320px;
  align-items: start;
}
.cart-shell {
  display: grid;
  gap: 0;
  background: #ffffff;
  padding: 28px;
}
.cart-layout--page {
  gap: 28px;
}
.cart-table,
.cart-summary {
  border-radius: 0;
  background: #ffffff;
  box-shadow: none;
}
.cart-table {
  display: grid;
  gap: 0;
  border: 0;
  padding: 0;
}
.cart-table__head {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) 120px 170px 120px;
  gap: 16px;
  align-items: center;
  padding: 18px 26px;
  background: #184d22;
  color: #fff;
  font-size: 0.92rem;
  font-weight: 600;
}
.cart-list {
  display: grid;
  gap: 0;
}
.cart-row {
  display: grid;
  grid-template-columns: 34px minmax(0, 1.6fr) 120px 170px 120px;
  gap: 16px;
  align-items: center;
  padding: 24px 8px 24px 0;
  border-bottom: 1px solid #eee6db;
}
.cart-row:last-child {
  border-bottom: 0;
}
.cart-row__remove {
  border: 0;
  background: transparent;
  color: #1f1d1b;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}
.cart-row__product {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
}
.cart-row__thumb {
  width: 92px;
  height: 92px;
  overflow: hidden;
  background: #f8f5f0;
}
.cart-row__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.cart-row__meta {
  display: grid;
  gap: 6px;
}
.cart-row__meta h3,
.cart-summary h2 {
  margin: 0;
}
.cart-row__meta h3 {
  font-size: 1.05rem;
  line-height: 1.25;
}
.cart-row__meta p {
  margin: 0;
  color: var(--muted);
  font-size: 0.96rem;
}
.cart-row__price,
.cart-row__subtotal {
  margin: 0;
  color: #1f1d1b;
  font-size: 1rem;
  font-weight: 500;
}
.cart-row__controls {
  display: contents;
}
.cart-row__qty {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 48px;
  width: 146px;
  border: 1px solid #e5ddd0;
  overflow: hidden;
}
.cart-row__qty button {
  border: 0;
  background: #fff;
  color: #1f1d1b;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}
.cart-row__qty-input {
  width: 100%;
  min-height: 48px;
  border: 0;
  border-left: 1px solid #e5ddd0;
  border-right: 1px solid #e5ddd0;
  text-align: center;
  font-size: 1rem;
  color: #1f1d1b;
  background: #fff;
  appearance: textfield;
  -moz-appearance: textfield;
}
.cart-row__qty-input::-webkit-outer-spin-button,
.cart-row__qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.cart-row__remove-mobile {
  display: none;
}
.cart-summary {
  display: grid;
  gap: 18px;
  padding: 22px 24px;
  border: 1px solid #ece5d9;
}
.cart-summary h2 {
  font-size: 1.05rem;
}
.cart-summary__lines {
  display: grid;
  gap: 14px;
  padding: 18px 0;
  border-top: 1px solid #ece5d9;
  border-bottom: 1px solid #ece5d9;
}
.cart-summary__line,
.cart-summary__total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.cart-summary__line span {
  color: var(--muted);
}
.cart-summary__line strong,
.cart-summary__total strong {
  color: #1f1d1b;
  font-size: 1rem;
}
.cart-summary__total {
  padding-top: 4px;
}
.cart-summary__checkout {
  min-height: 56px;
  border-radius: 999px;
  background: #184d22;
  color: #fff;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.cart-actions-bar {
  margin-top: 26px;
  padding-top: 24px;
  border-top: 1px solid #ece5d9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  background: #ffffff;
}
.cart-actions-bar__coupon {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.cart-actions-bar__input {
  width: min(270px, 100%);
  min-height: 48px;
  border-radius: 999px;
}
.cart-actions-bar__apply {
  min-height: 48px;
  padding: 0 28px;
  border: 0;
  border-radius: 999px;
  background: #184d22;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
.cart-actions-bar__clear {
  border: 0;
  background: transparent;
  color: #184d22;
  text-decoration: underline;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
}
.wishlist-shell {
  display: grid;
  gap: 26px;
  background: #ffffff;
  padding: 28px 30px 30px;
}
.wishlist-table {
  padding: 0;
  background: #ffffff;
  border: 0;
  box-shadow: none;
}
.wishlist-table__head {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) 120px 160px 130px 160px;
  gap: 18px;
  align-items: center;
  padding: 18px 22px;
  background: #184d22;
  color: #ffffff;
  border-radius: 16px;
  font-weight: 500;
}
.wishlist-list {
  display: grid;
}
.wishlist-row {
  display: grid;
  grid-template-columns: 28px minmax(0, 1.8fr) 120px 160px 130px 160px;
  gap: 18px;
  align-items: center;
  padding: 22px 0;
  border-bottom: 1px solid #ece5d9;
}
.wishlist-row__remove {
  border: 0;
  background: transparent;
  color: #1b1916;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
}
.wishlist-row__product {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  min-width: 0;
}
.wishlist-row__thumb {
  width: 88px;
  height: 88px;
  overflow: hidden;
  background: #f6f1e7;
  border-radius: 16px;
}
.wishlist-row__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.wishlist-row__meta {
  display: grid;
  gap: 5px;
  min-width: 0;
}
.wishlist-row__meta h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}
.wishlist-row__meta p {
  margin: 0;
  color: var(--muted);
}
.wishlist-row__price,
.wishlist-row__date,
.wishlist-row__stock {
  margin: 0;
  font-size: 1rem;
}
.wishlist-row__stock.is-in-stock {
  color: #17a05d;
}
.wishlist-row__stock.is-out-of-stock {
  color: #c0392b;
}
.wishlist-row__cart {
  min-height: 54px;
  padding: 0 22px;
  border: 0;
  border-radius: 999px;
  background: #184d22;
  color: #ffffff;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
}
.wishlist-row__cart:disabled {
  background: #d6d1c8;
  color: #7f7668;
  cursor: not-allowed;
}
.wishlist-row__mobile-actions,
.wishlist-row__remove-mobile {
  display: none;
}
.wishlist-actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 18px;
  align-items: center;
}
.wishlist-actions__link {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
}
.wishlist-actions__link label {
  color: #1b1916;
  font-weight: 500;
}
.wishlist-actions__copy,
.wishlist-actions__add-all {
  min-height: 54px;
  padding: 0 28px;
  border: 0;
  border-radius: 999px;
  background: #184d22;
  color: #ffffff;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
}
.wishlist-actions__clear {
  border: 0;
  background: transparent;
  color: #b98014;
  text-decoration: underline;
  text-underline-offset: 5px;
  cursor: pointer;
  white-space: nowrap;
}
.wishlist-empty {
  display: grid;
  gap: 14px;
  justify-items: start;
}
.cart-empty {
  display: grid;
  gap: 14px;
  justify-items: start;
}
.checkout-hero {
  padding: 28px 0 32px;
  text-align: center;
  display: grid;
  gap: 10px;
}
.checkout-hero h1 {
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 1.04;
}
.checkout-hero__crumbs {
  margin: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #3d372f;
  font-size: 1rem;
  flex-wrap: wrap;
}
.checkout-shell {
  background: #ffffff;
  padding: 30px 28px;
}
.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) 360px;
  gap: 28px;
  align-items: start;
}
.checkout-form,
.checkout-summary {
  border-radius: 0;
  background: #ffffff;
  box-shadow: none;
}
.checkout-form {
  padding: 0;
  border: 0;
  display: grid;
  gap: 24px;
}
.checkout-form__header {
  display: grid;
  gap: 8px;
}
.checkout-form__header h2,
.checkout-summary h2,
.checkout-summary__item-copy h3 {
  margin: 0;
}
.checkout-form__header p {
  margin: 0;
  color: var(--muted);
}
.checkout-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 24px;
}
.checkout-field {
  display: grid;
  gap: 10px;
}
.checkout-field--full {
  grid-column: 1 / -1;
}
.checkout-field span {
  color: #1f1d1b;
  font-weight: 500;
}
.checkout-field .field {
  min-height: 54px;
  border-radius: 999px;
  border-color: #e8e0d4;
  padding-left: 20px;
  padding-right: 20px;
}
.checkout-field .field.field--invalid {
  border-color: rgba(180, 35, 24, 0.45);
  box-shadow: 0 0 0 4px rgba(180, 35, 24, 0.08);
}
.checkout-field .field.field--valid {
  border-color: rgba(24, 77, 34, 0.38);
  box-shadow: 0 0 0 4px rgba(24, 77, 34, 0.08);
}
.checkout-affiliate__status {
  font-size: 0.84rem;
}
.checkout-affiliate__status.is-valid {
  color: #184d22;
}
.checkout-affiliate__status.is-invalid {
  color: #b42318;
}
.checkout-affiliate__status.is-validating {
  color: var(--muted);
}
.checkout-delivery {
  gap: 14px;
}
.checkout-delivery__options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.checkout-delivery__choice {
  min-height: 52px;
  border: 1px solid #e8e0d4;
  background: #fff;
  color: #1f1d1b;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 0 18px;
  cursor: pointer;
  text-align: left;
}
.checkout-delivery__choice.is-active {
  border-color: #184d22;
  box-shadow: inset 0 0 0 1px #184d22;
}
.checkout-delivery__radio {
  width: 18px;
  height: 18px;
  border: 1px solid #d8d0c3;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}
.checkout-delivery__choice.is-active .checkout-delivery__radio {
  border-color: #184d22;
}
.checkout-delivery__choice.is-active .checkout-delivery__radio::after {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #184d22;
}
.checkout-phase-action {
  display: grid;
  gap: 12px;
  justify-items: start;
}
.checkout-phase-action__message {
  margin: 0;
  color: #184d22;
  font-weight: 500;
}
.checkout-payment {
  display: grid;
  gap: 24px;
  padding-top: 10px;
  border-top: 1px solid #ece5d9;
}
.checkout-payment__methods {
  display: grid;
  gap: 14px;
}
.checkout-payment__option {
  width: 100%;
  min-height: 82px;
  border: 1px solid #ece5d9;
  background: #ffffff;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  cursor: pointer;
}
.checkout-payment__option.is-active {
  border-color: #184d22;
  box-shadow: inset 0 0 0 1px #184d22;
}
.checkout-payment__radio {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1px solid #d8d0c3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}
.checkout-payment__option.is-active .checkout-payment__radio {
  border-color: #184d22;
}
.checkout-payment__option.is-active .checkout-payment__radio::after {
  content: "";
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: #184d22;
}
.checkout-payment__logo {
  width: 120px;
  height: 40px;
  object-fit: contain;
  flex: 0 0 auto;
}
.checkout-payment__logo--large {
  width: 132px;
  height: 48px;
}
.checkout-payment__copy {
  display: grid;
  gap: 4px;
}
.checkout-payment__copy strong,
.checkout-payment__instruction-head h3 {
  color: #1f1d1b;
}
.checkout-payment__copy small,
.checkout-payment__instruction-head p,
.checkout-payment__upload-head p,
.checkout-summary__note,
.checkout-payment__proof-meta small,
.checkout-payment__helper {
  color: var(--muted);
}
.checkout-payment__details {
  display: grid;
  gap: 18px;
}
.checkout-payment__instruction-card,
.checkout-payment__upload-card {
  border: 1px solid #ece5d9;
  padding: 22px;
  display: grid;
  gap: 16px;
  background: #fff;
}
.checkout-payment__instruction-head {
  display: flex;
  align-items: center;
  gap: 16px;
}
.checkout-payment__instruction-head h3,
.checkout-payment__upload-head h3 {
  margin: 0 0 4px;
}
.checkout-payment__instruction-head p,
.checkout-payment__upload-head p {
  margin: 0;
}
.checkout-payment__instruction-grid {
  display: grid;
  gap: 12px;
}
.checkout-customer-card {
  display: grid;
  gap: 16px;
  padding: 22px;
  border: 1px solid #ece5d9;
  background: #fff;
}
.checkout-customer-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;
}
.checkout-customer-grid div {
  display: grid;
  gap: 4px;
  min-width: 0;
}
.checkout-customer-grid span {
  font-size: 0.88rem;
  color: var(--muted);
}
.checkout-customer-grid strong {
  color: #1f1d1b;
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.checkout-customer-grid__full {
  grid-column: 1 / -1;
}
.checkout-payment__instruction-block {
  padding: 14px 16px;
  background: #faf7f1;
  border: 1px solid #efe7db;
  color: #302a24;
}
.checkout-payment__proof-preview {
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  padding: 14px;
  background: #faf7f1;
  border: 1px solid #efe7db;
}
.checkout-payment__proof-thumb {
  width: 82px;
  height: 82px;
  overflow: hidden;
  background: #f2ece2;
}
.checkout-payment__proof-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.checkout-payment__proof-meta {
  display: grid;
  gap: 4px;
}
.checkout-payment__upload {
  display: grid;
  gap: 10px;
}
.checkout-payment__upload input[type="file"] {
  display: none;
}
.checkout-payment__upload-button,
.checkout-payment__secondary {
  min-height: 50px;
  padding: 0 20px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 600;
}
.checkout-payment__upload-button {
  border: 0;
  background: #184d22;
  color: #ffffff;
}
.checkout-payment__secondary {
  border: 1px solid #e0d6c8;
  background: #ffffff;
  color: #1f1d1b;
}
.checkout-payment__secondary--inline {
  width: fit-content;
  text-decoration: none;
}
.checkout-summary {
  display: grid;
  gap: 18px;
  padding: 22px 24px;
  border: 1px solid #ece5d9;
  align-self: start;
}
.checkout-summary__lines {
  display: grid;
  gap: 14px;
  padding: 18px 0;
  border-top: 1px solid #ece5d9;
  border-bottom: 1px solid #ece5d9;
}
.checkout-summary__line,
.checkout-summary__total,
.checkout-summary__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.checkout-summary__line span {
  color: var(--muted);
}
.checkout-summary__line strong,
.checkout-summary__total strong,
.checkout-summary__item strong {
  color: #1f1d1b;
}
.checkout-summary__line strong {
  min-width: 0;
  max-width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}
.checkout-summary__actions {
  display: grid;
  gap: 10px;
}
.checkout-summary__button {
  min-height: 56px;
  padding: 0 32px;
  border: 0;
  border-radius: 999px;
  background: #184d22;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
.checkout-summary__button:disabled {
  opacity: 0.6;
  cursor: wait;
}
.checkout-success-transition {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at top, rgba(201, 150, 47, 0.18), transparent 38%),
    rgba(251, 248, 242, 0.86);
  backdrop-filter: blur(10px);
  animation: checkoutSuccessFade 1.2s ease forwards;
}
.checkout-success-transition--success {
  animation-duration: 1.45s;
}
.checkout-success-transition__halo {
  position: absolute;
  width: min(58vw, 560px);
  aspect-ratio: 1;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(201, 150, 47, 0.28), rgba(201, 150, 47, 0.06) 45%, transparent 72%);
  animation: checkoutSuccessPulse 1.6s ease infinite;
}
.checkout-success-transition__card {
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 12px;
  min-width: min(92vw, 420px);
  padding: 34px 28px;
  border: 1px solid rgba(193, 169, 132, 0.34);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 26px 80px rgba(45, 32, 10, 0.14);
}
.checkout-success-transition__badge {
  width: 86px;
  height: 86px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: linear-gradient(135deg, #f4ead4, #efe0bc);
  box-shadow: 0 14px 34px rgba(145, 114, 61, 0.14);
}
.checkout-success-transition__badge--success {
  background:
    radial-gradient(circle at 24% 22%, rgba(255,255,255,0.4), transparent 26%),
    linear-gradient(135deg, #f5e8c6, #ddb76b);
  box-shadow: 0 14px 34px rgba(186, 130, 36, 0.24);
}
.checkout-success-transition__check {
  color: #fff;
  font-size: 2.35rem;
  font-weight: 700;
}
.checkout-success-transition__celebration {
  position: relative;
  width: 56px;
  height: 56px;
  display: inline-block;
}
.checkout-success-transition__cone {
  position: absolute;
  left: 50%;
  bottom: 4px;
  width: 0;
  height: 0;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-top: 28px solid #b9821f;
  transform: translateX(-50%) rotate(16deg);
  filter: drop-shadow(0 7px 14px rgba(120, 78, 17, 0.16));
}
.checkout-success-transition__cone::before {
  content: "";
  position: absolute;
  left: -9px;
  top: -28px;
  width: 18px;
  height: 24px;
  background:
    repeating-linear-gradient(
      -32deg,
      rgba(255,255,255,0.9) 0 4px,
      rgba(255,255,255,0.05) 4px 8px
    );
  clip-path: polygon(0 0, 100% 8%, 76% 100%, 18% 100%);
}
.checkout-success-transition__burst {
  position: absolute;
  inset: 0;
  animation: checkoutBurstFloat 1.05s ease-in-out infinite;
}
.checkout-success-transition__burst::before,
.checkout-success-transition__burst::after {
  content: "";
  position: absolute;
  border-radius: 999px;
}
.checkout-success-transition__burst::before {
  left: 11px;
  top: 4px;
  width: 34px;
  height: 22px;
  background:
    radial-gradient(circle at 18% 64%, #f59e0b 0 2px, transparent 3px),
    radial-gradient(circle at 46% 24%, #0a9b8a 0 2px, transparent 3px),
    radial-gradient(circle at 70% 56%, #e25d2f 0 2px, transparent 3px),
    radial-gradient(circle at 92% 26%, #1f1d1b 0 2px, transparent 3px);
}
.checkout-success-transition__burst::after {
  left: 16px;
  top: 16px;
  width: 26px;
  height: 2px;
  background: linear-gradient(90deg, #d99a26, #0a9b8a 48%, #db6d39);
  box-shadow:
    -8px -9px 0 #d99a26,
    5px -11px 0 #0a9b8a,
    14px -3px 0 #db6d39;
  transform: rotate(-14deg);
}
.checkout-success-transition__spinner {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 3px solid rgba(124, 95, 44, 0.16);
  border-top-color: #a77a2a;
  animation: checkoutSuccessSpin 0.85s linear infinite;
}
.checkout-success-transition__title {
  font-size: clamp(1.35rem, 3vw, 1.8rem);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.checkout-success-transition__message {
  margin: 0;
  max-width: 31ch;
  color: var(--muted);
  text-align: center;
  line-height: 1.6;
}
.checkout-summary__items {
  display: grid;
  gap: 14px;
}
.checkout-summary__item {
  align-items: flex-start;
}
.checkout-summary__thumb {
  width: 64px;
  height: 64px;
  overflow: hidden;
  background: #f8f5f0;
  flex: 0 0 auto;
}
.checkout-summary__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.checkout-summary__item-copy {
  flex: 1 1 auto;
  display: grid;
  gap: 4px;
}
.checkout-summary__item-copy p,
.checkout-summary__item-copy small {
  margin: 0;
  color: var(--muted);
}
.narrow-shell { width: min(680px, calc(100vw - 32px)); }
.auth-form { display: grid; gap: 14px; margin-top: 18px; }
.site-footer { border-top: 1px solid var(--line); background: rgba(255,255,255,0.7); margin-top: 42px; }
.footer-grid { grid-template-columns: 1.3fr 1fr 1fr; padding: 32px 0; }
.footer-grid ul, .admin-nav { padding: 0; margin: 0; list-style: none; display: grid; gap: 10px; color: var(--muted); }
.toast-stack { position: fixed; right: 16px; bottom: 16px; z-index: 40; display: grid; gap: 10px; }
.toast { min-width: 220px; max-width: 360px; padding: 12px 14px; border-radius: 16px; color: white; box-shadow: var(--shadow); }
.toast--success { background: #0a9b8a; }
.toast--info { background: #0f62fe; }
.toast--warning { background: #b7791f; }
.toast--error { background: var(--danger); }
.admin-layout { grid-template-columns: 240px 1fr; align-items: start; }
.admin-nav {
  background: white; border: 1px solid var(--line); border-radius: 24px; padding: 18px; box-shadow: var(--shadow);
}
.admin-nav a { padding: 10px 12px; border-radius: 14px; }
.admin-nav a:hover, .admin-nav a.active { background: rgba(15,98,254,0.08); color: var(--text); }
.account-nav {
  display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px;
}
.account-nav a {
  padding: 10px 12px; border-radius: 14px; border: 1px solid var(--line); background: white; color: var(--muted);
}
.account-nav a:hover, .account-nav a.active { background: rgba(15,98,254,0.08); color: var(--text); }
.resource-grid { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.resource-card { padding: 18px; border-radius: 20px; border: 1px solid var(--line); background: #fff; }
.resource-card h3 { margin-top: 0; }
.data-list { display: grid; gap: 12px; }
.data-item { padding: 16px; border: 1px solid var(--line); border-radius: 18px; background: white; }
.content-page { display: grid; gap: 20px; }
.content-hero, .content-section, .content-cta { display: grid; gap: 18px; }
.content-meta { color: var(--muted); margin: 0; }
.content-highlight-grid, .content-grid, .faq-actions-grid, .thankyou-meta-grid {
  display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
.content-highlight, .content-block {
  border: 1px solid var(--line); border-radius: 22px; padding: 18px; background: rgba(255,255,255,0.8);
}
.content-highlight span { color: var(--muted); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.1em; }
.content-highlight h2, .content-section h2, .content-cta h2, .faq-action-card h2, .thankyou-items-panel h2 { margin: 0; font-size: 1.2rem; }
.content-block h3, .content-block h4 { margin: 0; }
.content-block p, .content-block ul { margin: 0; color: var(--muted); }
.content-block ul { padding-left: 18px; display: grid; gap: 8px; }
.content-note { color: var(--brand-strong); font-weight: 600; }
.content-points { display: grid; gap: 12px; }
.content-points > div {
  padding: 14px 16px; border-left: 4px solid var(--brand); background: rgba(15, 98, 254, 0.06); border-radius: 16px;
}
.faq-showcase {
  display: grid;
  gap: 28px;
}
.faq-showcase__intro {
  display: grid;
  justify-items: center;
  gap: 8px;
  text-align: center;
  padding: 12px 0 2px;
}
.faq-showcase__intro h1 {
  margin: 0;
  font-size: clamp(2.3rem, 5vw, 4rem);
  line-height: 1.05;
}
.faq-showcase__intro h1 span {
  color: #b8892d;
}
.faq-showcase__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(280px, 0.82fr);
  gap: 28px;
  align-items: start;
}
.faq-showcase__list {
  display: grid;
  gap: 16px;
}
.faq-card {
  border: 1px solid #e3ddd3;
  background: #fff;
  overflow: hidden;
}
.faq-card.is-open {
  background: #184f27;
  border-color: #184f27;
  box-shadow: 0 18px 40px rgba(24, 79, 39, 0.14);
}
.faq-card__question {
  width: 100%;
  background: transparent;
  border: 0;
  text-align: left;
  padding: 24px 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  color: #1f1d1b;
  font-size: clamp(1.08rem, 1.8vw, 1.28rem);
  font-weight: 700;
}
.faq-card.is-open .faq-card__question {
  color: #fff;
}
.faq-card__toggle {
  flex: 0 0 auto;
  font-size: 2.1rem;
  line-height: 1;
  font-weight: 300;
}
.faq-card__answer {
  padding: 0 26px 24px;
  display: grid;
  gap: 14px;
  color: rgba(255, 255, 255, 0.84);
  line-height: 1.7;
}
.faq-card__answer p {
  margin: 0;
}
.faq-card__answer .ghost-link {
  color: #fff;
}
.faq-support-card {
  display: grid;
  justify-items: center;
  gap: 16px;
  padding: 34px 26px;
  background: #184f27;
  color: #fff;
  text-align: center;
  box-shadow: 0 22px 44px rgba(24, 79, 39, 0.16);
}
.faq-support-card__icon {
  width: 78px;
  height: 78px;
  display: grid;
  place-items: center;
}
.faq-support-card__icon svg {
  width: 100%;
  height: 100%;
  display: block;
}
.faq-support-card h2 {
  margin: 0;
  font-size: clamp(1.35rem, 2.2vw, 1.8rem);
  color: #fff;
}
.faq-support-card p {
  margin: 0;
  color: rgba(255,255,255,0.82);
  line-height: 1.75;
}
.faq-support-card__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  padding: 0 28px;
  background: #fff;
  color: #1f1d1b;
  font-weight: 700;
  text-decoration: none;
}
.thankyou-panel, .thankyou-summary { display: grid; gap: 18px; }
.thankyou-items-panel { display: grid; gap: 12px; }
.thankyou-item-row, .thankyou-line { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.order-complete {
  display: grid;
  gap: 28px;
  background: #ffffff;
  padding: 28px 30px 40px;
}
.order-complete--arriving {
  animation: orderCompleteRise 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.order-complete__intro {
  display: grid;
  justify-items: center;
  gap: 10px;
  text-align: center;
  padding: 32px 0 8px;
}
.order-complete--arriving .order-complete__intro {
  animation: orderCompleteIntro 0.95s ease 0.08s both;
}
.order-complete__check {
  width: 72px;
  height: 72px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #c9962f;
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
}
.order-complete--arriving .order-complete__check {
  animation: orderCompleteCheck 0.8s cubic-bezier(0.18, 0.9, 0.25, 1.2) 0.14s both;
}
.order-complete__intro h2 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
}
.order-complete__intro p {
  margin: 0;
  color: var(--muted);
  font-size: 1.05rem;
}
.order-complete__meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr)) auto;
  gap: 0;
  background: #184d22;
  color: #fff;
  padding: 18px 28px;
  border-radius: 16px;
  align-items: center;
}
.order-complete--arriving .order-complete__meta,
.order-complete--arriving .order-complete__details,
.order-complete--arriving .hero-actions {
  animation: orderCompleteSection 0.75s ease both;
}
.order-complete--arriving .order-complete__meta { animation-delay: 0.22s; }
.order-complete--arriving .order-complete__details { animation-delay: 0.32s; }
.order-complete--arriving .hero-actions { animation-delay: 0.42s; }
.order-complete__meta > div {
  display: grid;
  gap: 6px;
  min-width: 0;
  padding-right: 20px;
  border-right: 1px solid rgba(255,255,255,0.18);
}
.order-complete__meta > div:last-of-type {
  border-right: 0;
}
.order-complete__meta span {
  color: rgba(255,255,255,0.82);
}
.order-complete__meta strong {
  color: #fff;
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.order-complete__invoice {
  justify-self: end;
  min-height: 56px;
  padding: 0 28px;
  border-radius: 999px;
  border: 0;
  background: #fff;
  color: #1f1d1b;
  font-weight: 600;
  cursor: pointer;
}
.order-complete__details {
  display: grid;
  gap: 20px;
  padding: 28px 30px;
}
.order-complete__details-head {
  padding-bottom: 18px;
  border-bottom: 1px solid #ece5d9;
}
.order-complete__details-head h2 {
  margin: 0;
}
.order-complete__table-head,
.order-complete__item,
.order-complete__totals-line,
.order-complete__total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}
.order-complete__table-head {
  font-weight: 600;
}
.order-complete__items {
  display: grid;
  gap: 18px;
}
.order-complete__item {
  padding-bottom: 16px;
}
.order-complete__product {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}
.order-complete__thumb {
  width: 74px;
  height: 74px;
  overflow: hidden;
  background: #f6f1e7;
  flex: 0 0 auto;
}
.order-complete__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.order-complete__product-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}
.order-complete__product-copy strong,
.order-complete__price {
  color: #1f1d1b;
}
.order-complete__product-copy strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.order-complete__product-copy small {
  color: var(--muted);
}
.order-complete__totals {
  display: grid;
  gap: 18px;
  padding: 18px 0;
  border-top: 1px solid #ece5d9;
  border-bottom: 1px solid #ece5d9;
}
.order-complete__total {
  font-size: 1.1rem;
}
.order-complete__total strong {
  font-size: 1.2rem;
}
.order-complete-pending {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at top, rgba(201, 150, 47, 0.14), transparent 32%),
    #fbf8f2;
}
.order-complete-pending__card {
  display: grid;
  justify-items: center;
  gap: 14px;
  width: min(92vw, 420px);
  padding: 34px 26px;
  background: rgba(255,255,255,0.94);
  border: 1px solid rgba(193, 169, 132, 0.26);
  box-shadow: 0 24px 70px rgba(45, 32, 10, 0.12);
  text-align: center;
}
.order-complete-pending__card h2 {
  margin: 0;
  font-size: clamp(1.4rem, 3vw, 2rem);
}
.order-complete-pending__card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}
.order-complete-pending__spinner {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 3px solid rgba(124, 95, 44, 0.16);
  border-top-color: #a77a2a;
  animation: checkoutSuccessSpin 0.85s linear infinite;
}
.orders-shell {
  display: grid;
  gap: 22px;
}
.orders-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.orders-summary > div {
  display: grid;
  gap: 6px;
}
.orders-summary span,
.order-list__meta span,
.track-order-top__meta span,
.track-order-product__meta span {
  color: var(--muted);
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.orders-summary strong {
  font-size: clamp(1.3rem, 3vw, 2rem);
}
.orders-list {
  display: grid;
  gap: 18px;
}
.order-list__card {
  display: grid;
  gap: 18px;
}
.order-list__head,
.order-list__meta,
.order-list__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.order-list__head strong {
  font-size: 1.05rem;
}
.order-list__head p,
.order-list__more {
  margin: 4px 0 0;
  color: var(--muted);
}
.order-list__status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(19, 87, 44, 0.08);
  color: #13572c;
  font-weight: 700;
}
.order-list__status--pending {
  background: rgba(167, 122, 42, 0.12);
  color: #8b5e12;
}
.order-list__status--processing {
  background: rgba(18, 86, 109, 0.1);
  color: #12566d;
}
.order-list__status--shipped {
  background: rgba(19, 87, 44, 0.1);
  color: #13572c;
}
.order-list__status--delivered {
  background: rgba(11, 102, 67, 0.14);
  color: #0b6643;
}
.order-list__status--cancelled {
  background: rgba(159, 45, 45, 0.12);
  color: #9f2d2d;
}
.order-list__products {
  display: grid;
  gap: 14px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}
.order-list__products h3,
.track-order-top__header h2,
.track-order-products__head h2 {
  margin: 0;
}
.order-list__product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.order-list__product-chip,
.track-order-product {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
}
.order-list__product-thumb,
.track-order-product__thumb {
  width: 72px;
  height: 72px;
  overflow: hidden;
  background: #f6efe3;
}
.order-list__product-thumb img,
.track-order-product__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.order-list__product-copy,
.track-order-product__copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}
.order-list__product-copy strong,
.track-order-product__copy strong {
  color: #1f1d1b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.order-list__product-copy span,
.track-order-product__copy span {
  color: var(--muted);
}
.order-list__meta {
  padding-top: 18px;
  border-top: 1px solid var(--line);
}
.order-list__meta > div {
  display: grid;
  gap: 4px;
}
.track-order-shell {
  display: grid;
  gap: 24px;
}
.track-order-top {
  display: grid;
  gap: 26px;
}
.track-order-top__header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;
}
.track-order-top__header p {
  margin: 8px 0 0;
  color: #3a352d;
  font-size: 1.15rem;
}
.track-order-top__meta {
  display: grid;
  justify-items: end;
  gap: 6px;
  text-align: right;
}
.track-order-top__meta strong {
  font-size: 1.12rem;
}
.track-order-progress {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 18px;
}
.track-order-progress__line {
  position: absolute;
  left: calc(10% + 22px);
  right: calc(10% + 22px);
  top: 57px;
  height: 6px;
  background: #ece8df;
  z-index: 0;
}
.track-order-progress__fill {
  display: block;
  height: 100%;
  background: #184f27;
}
.track-order-step {
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 10px;
  text-align: center;
}
.track-order-step__icon {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  background: #fff;
  color: #c9c5bb;
}
.track-order-step__icon svg {
  width: 28px;
  height: 28px;
  display: block;
}
.track-order-step strong {
  font-size: 0.98rem;
  color: #2a241d;
}
.track-order-step span {
  color: #5b544b;
  line-height: 1.5;
}
.track-order-step.is-done .track-order-step__icon,
.track-order-step.is-active .track-order-step__icon {
  color: #184f27;
}
.track-order-step.is-done strong,
.track-order-step.is-active strong {
  color: #184f27;
}
.track-order-products {
  display: grid;
  gap: 22px;
}
.track-order-products__head {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}
.track-order-products__list {
  display: grid;
}
.track-order-product {
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}
.track-order-product:last-child {
  border-bottom: 0;
}
.track-order-product__meta {
  display: grid;
  justify-items: end;
  gap: 8px;
  text-align: right;
}
.track-order-product__meta strong {
  font-size: 1rem;
  color: #1f1d1b;
}
@keyframes checkoutSuccessFade {
  0% {
    opacity: 0;
  }
  12%,
  88% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes checkoutSuccessPulse {
  0%,
  100% {
    transform: scale(0.9);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.04);
    opacity: 1;
  }
}
@keyframes checkoutBurstFloat {
  0%,
  100% {
    transform: translateY(0) scale(0.98);
  }
  50% {
    transform: translateY(-3px) scale(1.02);
  }
}
@keyframes checkoutSuccessSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes orderCompleteRise {
  0% {
    opacity: 0;
    transform: translateY(24px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes orderCompleteIntro {
  0% {
    opacity: 0;
    transform: translateY(16px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes orderCompleteCheck {
  0% {
    opacity: 0;
    transform: scale(0.56);
  }
  60% {
    opacity: 1;
    transform: scale(1.08);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes orderCompleteSection {
  0% {
    opacity: 0;
    transform: translateY(18px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (min-width: 1100px) {
  .header-inner {
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 28px;
  }
  .header-mobile-top,
  .mobile-header-search {
    display: none;
  }
  .brand-mark--desktop-shell {
    display: inline-flex;
  }
  .main-nav {
    display: flex; justify-content: center; gap: 28px; flex-wrap: nowrap;
  }
  .icon-button--mobile { display: none; }
  .icon-button--desktop { display: inline-flex; }
  .mobile-menu { display: none; }
  .hero-banner {
    min-height: 460px;
  }
  .hero-banner__inner {
    min-height: 460px; padding: 34px 82px 34px 84px; grid-template-columns: minmax(280px, 430px) 1fr;
    align-items: center;
  }
  .hero-banner__content {
    order: 1;
  }
  .hero-banner__visual {
    order: 2; min-height: 360px; justify-content: flex-start; padding-left: 10px;
  }
  .hero-banner__arrow--left { left: 22px; }
  .hero-banner__arrow--right { right: 22px; }
  .hero-speaker--rear {
    width: 132px; height: 236px; margin-right: -20px; margin-bottom: 20px;
  }
  .hero-speaker--main {
    width: 228px; height: 280px;
  }
  .hero-speaker__logo {
    top: 112px; font-size: 3.2rem;
  }
  .service-banner__grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .category-showcase__grid {
    display: grid;
    grid-template-columns: minmax(250px, 1.2fr) repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(2, minmax(210px, 1fr));
    gap: 14px;
  }
  .category-showcase__rail {
    display: contents;
  }
  .category-tile--featured {
    grid-column: 1;
    grid-row: 1 / span 2;
    min-height: auto;
  }
  .category-tile--compact {
    min-height: auto;
  }
  .category-showcase__rail .category-tile--compact:nth-child(1) {
    grid-column: 2;
    grid-row: 1;
  }
  .category-showcase__rail .category-tile--compact:nth-child(2) {
    grid-column: 3;
    grid-row: 1;
  }
  .category-showcase__rail .category-tile--compact:nth-child(3) {
    grid-column: 4;
    grid-row: 1;
  }
  .category-showcase__rail .category-tile--compact:nth-child(4) {
    grid-column: 2;
    grid-row: 2;
  }
  .category-showcase__rail .category-tile--compact:nth-child(5) {
    grid-column: 3;
    grid-row: 2;
  }
  .category-showcase__rail .category-tile--compact:nth-child(n + 6) {
    grid-column: 4;
    grid-row: 2;
  }
  .homepage-products__header {
    grid-template-columns: minmax(0, 1fr) auto;
  }
  .homepage-products__controls {
    justify-items: end;
  }
  .product-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .product-grid--catalog {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .related-products__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .shop-layout {
    grid-template-columns: 260px minmax(0, 1fr);
    align-items: start;
  }
  .shop-toolbar {
    grid-template-columns: 1fr;
    align-items: center;
  }
  .shop-mobile-bar,
  .shop-drawer {
    display: none !important;
  }
  .checkout-summary {
    position: sticky;
    top: 108px;
  }
  .order-complete__details {
    padding: 28px 32px;
  }
}
@media (min-width: 641px) and (max-width: 899px) {
  .shop-page {
    padding-bottom: 104px;
  }
  .homepage-products__controls {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
  }
  .product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .product-grid--catalog {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .shop-toolbar {
    grid-template-columns: 1fr;
    align-items: end;
  }
  .shop-sidebar {
    display: none;
  }
  .shop-mobile-bar {
    display: grid; grid-template-columns: 1fr; gap: 12px;
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 70;
    padding: 12px 16px calc(env(safe-area-inset-bottom) + 12px);
    margin-top: 0;
    background: linear-gradient(180deg, rgba(252, 250, 246, 0), rgba(252, 250, 246, 0.92) 36%, #fcfaf6 100%);
  }
  .shop-mobile-bar__button {
    min-height: 48px; border: 0; border-radius: 0;
    background: #171513; color: #fff; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
    box-shadow: 0 18px 38px rgba(27, 25, 22, 0.18);
  }
  .service-banner__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .category-showcase__grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-auto-rows: minmax(150px, 1fr);
    gap: 12px;
  }
  .category-showcase__rail {
    display: contents;
  }
  .category-tile--featured {
    grid-column: span 3;
    grid-row: span 2;
    min-height: auto;
  }
  .category-tile--compact {
    grid-column: span 3;
    min-height: auto;
  }
}
@media (max-width: 1099px) {
  .checkout-layout {
    grid-template-columns: 1fr;
    gap: 22px;
  }
  .checkout-summary {
    position: static;
  }
}
@media (max-width: 980px) {
  .hero-grid, .product-detail, .cart-layout, .footer-grid, .admin-layout, .product-detail-view { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .shell, .narrow-shell { width: min(100vw - 20px, 100%); }
  .cart-hero {
    padding: 12px 0 20px;
    gap: 8px;
  }
  .checkout-hero {
    padding: 12px 0 20px;
    gap: 8px;
  }
  .cart-hero__crumbs {
    font-size: 0.92rem;
    gap: 8px;
  }
  .checkout-hero__crumbs {
    font-size: 0.92rem;
    gap: 8px;
  }
  .cart-shell {
    gap: 18px;
    padding: 16px 14px 20px;
  }
  .checkout-shell {
    padding: 16px 14px 20px;
  }
  .checkout-layout {
    grid-template-columns: 1fr;
    gap: 22px;
  }
  .checkout-fields {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .checkout-delivery__options {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .checkout-summary {
    padding: 18px 16px;
    position: static;
  }
  .checkout-payment__option {
    min-height: 76px;
    padding: 14px;
    gap: 12px;
  }
  .checkout-payment__logo {
    width: 88px;
    height: 32px;
  }
  .checkout-payment__logo--large {
    width: 108px;
    height: 38px;
  }
  .checkout-payment__instruction-head {
    align-items: flex-start;
    flex-direction: column;
  }
  .checkout-payment__instruction-card,
  .checkout-payment__upload-card {
    padding: 18px 16px;
  }
  .checkout-customer-card {
    padding: 18px 16px;
  }
  .checkout-customer-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .checkout-customer-grid strong {
    max-width: 100%;
  }
  .checkout-payment__proof-preview {
    grid-template-columns: 1fr;
  }
  .checkout-payment__proof-thumb {
    width: 100%;
    height: 180px;
  }
  .checkout-payment__secondary,
  .checkout-payment__upload-button {
    width: 100%;
  }
  .checkout-summary__item {
    align-items: center;
  }
  .checkout-summary__item strong {
    font-size: 0.9rem;
  }
  .checkout-success-transition__card {
    min-width: calc(100vw - 28px);
    padding: 28px 20px;
  }
  .checkout-success-transition__check {
    width: auto;
    height: auto;
    font-size: 2rem;
  }
  .checkout-success-transition__badge {
    width: 78px;
    height: 78px;
  }
  .checkout-success-transition__celebration {
    width: 50px;
    height: 50px;
  }
  .checkout-success-transition__spinner {
    width: 30px;
    height: 30px;
  }
  .checkout-summary__line strong {
    max-width: 150px;
  }
  .order-complete__meta {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 18px 16px;
  }
  .order-complete {
    padding: 18px 16px 24px;
  }
  .order-complete__meta > div {
    padding-right: 0;
    padding-bottom: 12px;
    border-right: 0;
    border-bottom: 1px solid rgba(255,255,255,0.14);
  }
  .order-complete__meta > div:last-of-type {
    border-bottom: 1px solid rgba(255,255,255,0.14);
  }
  .order-complete__invoice {
    justify-self: stretch;
  }
  .order-complete__details {
    padding: 18px 16px;
  }
  .order-complete__table-head {
    display: none;
  }
  .order-complete__item,
  .order-complete__totals-line,
  .order-complete__total {
    align-items: flex-start;
  }
  .order-complete__item {
    flex-direction: column;
  }
  .order-complete__price {
    align-self: flex-end;
  }
  .cart-table {
    padding: 0;
  }
  .cart-table__head {
    display: none;
  }
  .cart-row {
    grid-template-columns: 26px minmax(0, 1fr);
    gap: 12px;
    padding: 18px 0 16px;
  }
  .cart-row__product {
    grid-column: 2;
    grid-template-columns: 82px minmax(0, 1fr);
    gap: 12px;
  }
  .cart-row__thumb {
    width: 82px;
    height: 82px;
  }
  .cart-row__meta h3 {
    font-size: 0.94rem;
  }
  .cart-row__meta p {
    font-size: 0.84rem;
  }
  .cart-row__price,
  .cart-row__controls,
  .cart-row__subtotal {
    grid-column: 2;
  }
  .cart-row__price::before,
  .cart-row__subtotal::before {
    display: inline-block;
    margin-right: 8px;
    color: var(--muted);
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .cart-row__price::before {
    content: "Price";
  }
  .cart-row__subtotal::before {
    content: "Subtotal";
  }
  .cart-row__price,
  .cart-row__subtotal {
    font-size: 0.94rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .cart-row__controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .cart-row__qty {
    width: 100%;
    max-width: 154px;
  }
  .cart-row__remove {
    display: none;
  }
  .cart-row__remove-mobile {
    min-height: 44px;
    padding: 0 14px;
    border: 1px solid #e5ddd0;
    background: #fff;
    color: #1f1d1b;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    white-space: nowrap;
  }
  .cart-row__remove-mobile svg {
    width: 16px;
    height: 16px;
  }
  .cart-summary {
    padding: 18px 16px;
  }
  .cart-actions-bar {
    align-items: stretch;
    margin-top: 6px;
    padding-top: 18px;
    gap: 14px;
  }
  .cart-actions-bar__coupon {
    width: 100%;
    display: grid;
    gap: 10px;
  }
  .cart-actions-bar__input,
  .cart-actions-bar__apply {
    width: 100%;
  }
  .cart-actions-bar__clear {
    width: 100%;
    text-align: center;
    padding: 10px 0 0;
  }
  .wishlist-shell {
    gap: 18px;
    padding: 18px 14px 24px;
  }
  .wishlist-table__head {
    display: none;
  }
  .wishlist-row {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 18px 0;
  }
  .wishlist-row__remove {
    display: none;
  }
  .wishlist-row__product {
    grid-template-columns: 82px minmax(0, 1fr);
    gap: 12px;
  }
  .wishlist-row__thumb {
    width: 82px;
    height: 82px;
    border-radius: 14px;
  }
  .wishlist-row__meta h3 {
    font-size: 0.98rem;
  }
  .wishlist-row__price,
  .wishlist-row__date,
  .wishlist-row__stock {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 0.94rem;
  }
  .wishlist-row__price::before,
  .wishlist-row__date::before,
  .wishlist-row__stock::before {
    color: var(--muted);
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .wishlist-row__price::before {
    content: "Price";
  }
  .wishlist-row__date::before {
    content: "Date Added";
  }
  .wishlist-row__stock::before {
    content: "Stock Status";
  }
  .wishlist-row__action {
    display: none;
  }
  .wishlist-row__mobile-actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 10px;
  }
  .wishlist-row__remove-mobile {
    min-height: 48px;
    border: 1px solid #e5ddd0;
    background: #ffffff;
    color: #1f1d1b;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
  }
  .wishlist-row__remove-mobile svg {
    width: 16px;
    height: 16px;
  }
  .wishlist-row__cart {
    width: 100%;
    min-height: 48px;
  }
  .wishlist-actions {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .wishlist-actions__link {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .wishlist-actions__copy,
  .wishlist-actions__add-all {
    width: 100%;
  }
  .wishlist-actions__clear {
    width: 100%;
    text-align: center;
  }
  .faq-showcase__layout {
    grid-template-columns: 1fr;
  }
  .faq-card__question {
    padding: 20px 18px;
    font-size: 1.02rem;
  }
  .faq-card__answer {
    padding: 0 18px 20px;
  }
  .faq-support-card {
    padding: 28px 20px;
  }
  .orders-summary,
  .order-list__product-grid,
  .track-order-progress {
    grid-template-columns: 1fr;
  }
  .order-list__head,
  .order-list__meta,
  .track-order-top__header {
    flex-direction: column;
    align-items: start;
  }
  .track-order-top__meta,
  .track-order-product__meta {
    justify-items: start;
    text-align: left;
  }
  .track-order-progress__line {
    display: none;
  }
  .track-order-step {
    grid-template-columns: 58px minmax(0, 1fr);
    justify-items: start;
    align-items: center;
    text-align: left;
  }
  .track-order-step strong,
  .track-order-step span {
    grid-column: 2;
  }
  .track-order-step__icon {
    grid-row: span 2;
  }
  .track-order-product,
  .order-list__product-chip {
    grid-template-columns: 64px minmax(0, 1fr);
  }
  .track-order-product__meta {
    grid-column: 2;
  }
  .order-list__actions .primary-link {
    width: 100%;
    text-align: center;
  }
  .product-grid {
    border-top-color: #d9d0c2;
    border-left-color: #d9d0c2;
  }
  .product-card--home {
    border-right-color: #d9d0c2;
    border-bottom-color: #d9d0c2;
  }
  .shop-page {
    padding-bottom: 96px;
  }
  .shop-hero {
    padding: 2px 0 6px;
  }
  .shop-layout {
    gap: 12px;
  }
  .product-summary__buy {
    grid-template-columns: 1fr;
  }
  .product-summary__social {
    gap: 10px;
  }
  .product-summary__social-links a {
    width: 23px;
    height: 23px;
  }
  .product-summary__social-links svg,
  .product-summary__social-links span[aria-hidden="true"] {
    width: 17px;
    height: 17px;
  }
  .product-summary__inline-actions {
    gap: 8px;
  }
  .product-summary__icon-action {
    padding: 10px 8px;
    gap: 6px;
    font-size: 0.82rem;
  }
  .product-gallery__main {
    padding: 0;
  }
  .product-gallery__selector {
    grid-template-columns: 28px minmax(0, 1fr) 28px;
    gap: 8px;
  }
  .product-gallery__arrow {
    min-height: 56px;
    font-size: 1.5rem;
  }
  .product-gallery__stage-arrow {
    width: 44px;
    height: 44px;
    font-size: 1.7rem;
  }
  .product-gallery__stage-arrow--left {
    left: -12px;
  }
  .product-gallery__stage-arrow--right {
    right: -12px;
  }
  .product-gallery__thumbs {
    gap: 8px;
  }
  .product-gallery__thumb {
    flex-basis: 72px;
    min-height: 64px;
  }
  .product-tabs__nav {
    justify-content: flex-start;
    gap: 16px;
    overflow-x: auto;
  }
  .product-preview {
    grid-template-columns: 40px minmax(0, 1fr) 40px;
    grid-template-rows: 48px minmax(0, 1fr) auto;
    gap: 10px;
    padding: 10px 8px 18px;
  }
  .product-preview__close {
    width: 40px;
    height: 40px;
    font-size: 1.7rem;
  }
  .product-preview__arrow {
    width: 40px;
    height: 40px;
    font-size: 1.6rem;
  }
  .product-preview__stage img {
    width: 100%;
    max-height: calc(100dvh - 220px);
  }
  .product-preview__thumbs {
    grid-template-columns: 28px minmax(0, 1fr) 28px;
    gap: 8px;
    width: min(100%, 340px);
  }
  .product-preview__thumb-arrow {
    width: 28px;
    height: 28px;
    font-size: 1.4rem;
  }
  .product-preview__thumb {
    width: 56px;
    height: 56px;
    flex-basis: 56px;
  }
  .product-spec-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
  .product-review-overview,
  .product-review-shell {
    grid-template-columns: 1fr;
  }
  .product-review-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .product-review-actions__sort {
    min-width: 0;
    width: 100%;
  }
  .product-review__header {
    flex-direction: column;
    align-items: start;
  }
  .related-products__grid {
    gap: 12px;
  }
  .shop-sidebar,
  .shop-toolbar {
    padding: 16px;
  }
  .shop-sidebar {
    display: none;
  }
  .shop-filter-list {
    gap: 7px;
  }
  .shop-filter-chip {
    padding: 9px 11px; font-size: 0.78rem;
  }
  .shop-toolbar {
    grid-template-columns: 1fr;
  }
  .shop-mobile-bar {
    display: grid; grid-template-columns: 1fr; gap: 10px;
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 70;
    width: auto; margin: 0;
    padding: 10px 10px calc(env(safe-area-inset-bottom) + 10px);
    background: linear-gradient(180deg, rgba(252, 250, 246, 0), rgba(252, 250, 246, 0.92) 36%, #fcfaf6 100%);
  }
  .shop-mobile-bar__button {
    min-height: 46px; border: 0; border-radius: 0;
    background: #171513; color: #fff; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
    box-shadow: 0 18px 38px rgba(27, 25, 22, 0.18);
  }
  .shop-drawer {
    display: block;
  }
  .service-banner,
  .category-showcase,
  .page-section,
  .hero-section {
    overflow-x: clip;
  }
  .header-topbar__inner { justify-content: center; text-align: center; }
  .header-topbar__inner span:last-child { display: none; }
  .header-inner {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    row-gap: 12px;
  }
  .brand-mark--mobile .brand-mark__image { height: 38px; }
  .brand-mark--desktop-shell {
    display: none;
  }
  .header-icon-actions {
    grid-column: 1 / -1;
    width: 100%;
    margin-left: 0;
    gap: 0;
  }
  .mobile-header-search {
    width: 100%;
  }
  .hero-section { padding-top: 20px; }
  .hero-banner {
    min-height: 540px;
  }
  .hero-banner__inner {
    min-height: 540px; padding-left: 18px; padding-right: 18px;
  }
  .hero-banner__content {
    max-width: none;
  }
  .hero-banner .hero-actions {
    display: grid; grid-template-columns: 1fr; width: 100%;
  }
  .hero-banner .primary-link,
  .hero-banner__ghost {
    width: 100%;
  }
  .hero-banner__arrow {
    width: 36px; height: 36px;
  }
  .homepage-products__tabs {
    gap: 14px;
  }
  .homepage-products__tab {
    font-size: 0.64rem;
  }
  .product-card {
    border-radius: 0;
  }
  .product-card--catalog {
    border-radius: 0;
  }
  .product-card__body h3 {
    font-size: 0.76rem;
  }
  .product-card__price {
    font-size: 0.86rem;
  }
  .product-card__body {
    padding: 10px 9px 13px;
    min-height: 82px;
  }
  .product-card__media {
    padding: 6px;
  }
  .product-card__rating {
    font-size: 0.62rem;
  }
  .product-grid .product-card:nth-child(n + 5) {
    display: none;
  }
  .product-grid--catalog .product-card:nth-child(n + 5) {
    display: grid;
  }
  .products-results {
    font-size: 0.82rem;
  }
  .product-card--catalog .product-card__media {
    padding: 0;
  }
  .product-card--catalog .product-card__body {
    padding: 11px 11px 8px;
  }
  .product-card--catalog .product-card__body h3 {
    font-size: 0.76rem;
  }
  .product-card__description {
    font-size: 0.68rem;
  }
  .product-card--catalog .product-card__price {
    font-size: 0.88rem;
  }
  .product-card__icon-button {
    width: 34px; height: 34px;
  }
  .product-card__icon-asset {
    width: 15px; height: 15px;
  }
  .product-card__footer {
    padding: 0;
  }
  .product-card__footer-actions {
    grid-template-columns: 34px minmax(0, 1fr) 34px;
  }
  .product-card__cart-button {
    min-height: 34px; border-radius: 0; font-size: 0.62rem;
  }
  .hero-speaker--rear {
    width: 88px; height: 168px;
  }
  .hero-speaker--main {
    width: 156px; height: 192px;
  }
  .hero-speaker__logo {
    top: 77px; font-size: 2.15rem;
  }
  .category-showcase {
    padding-top: 20px;
  }
  .service-banner__grid {
    grid-template-columns: 1fr;
  }
  .category-showcase__grid {
    display: flex;
    align-items: stretch;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: none;
  }
  .category-showcase__grid::-webkit-scrollbar {
    display: none;
  }
  .category-showcase__rail {
    display: flex;
    gap: 10px;
  }
  .category-tile {
    min-height: 150px; border-radius: 0;
    scroll-snap-align: start;
    flex: 0 0 min(46vw, 180px);
  }
  .category-tile--featured,
  .category-tile--compact {
    min-height: 150px;
  }
  .category-tile--featured {
    flex-basis: min(52vw, 210px);
  }
  .category-tile__content {
    padding: 14px;
  }
  .category-tile__content h2 {
    font-size: clamp(1.05rem, 5vw, 1.5rem);
  }
  .category-tile__count,
  .category-tile__cta {
    font-size: 0.62rem;
  }
  .cart-row, .filters-panel, .content-highlight-grid, .content-grid, .faq-actions-grid, .thankyou-meta-grid { grid-template-columns: 1fr; }
}
`;

export default function GlobalStyles() {
  return <style jsx global>{styles}</style>;
}
