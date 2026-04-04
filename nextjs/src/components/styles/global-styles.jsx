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
.mobile-support-link {
  width: 42px; height: 42px; display: none; align-items: center; justify-content: center;
  border-radius: 999px; border: 1px solid var(--line); background: rgba(255, 255, 255, 0.96);
  color: var(--accent); box-shadow: 0 12px 28px rgba(27, 25, 22, 0.08);
}
.mobile-support-link__icon {
  width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center;
}
.mobile-support-link__icon svg {
  width: 18px; height: 18px;
}
.brand-mark { display: inline-flex; align-items: center; gap: 12px; }
.brand-mark--mobile {
  display: none;
}
.brand-mark__image {
  width: auto;
  height: 44px;
}
.brand-mark__name {
  font-size: 1rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
}
.main-nav {
  display: flex; align-items: center; gap: 6px;
}
.nav-link {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  padding: 12px 18px; border-radius: 999px; color: var(--muted); font-size: 0.95rem; font-weight: 500;
  transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}
.nav-link:hover { color: var(--text); background: rgba(217, 164, 65, 0.12); }
.nav-link.is-active {
  color: var(--text); background: rgba(217, 164, 65, 0.18);
}
.header-icon-actions {
  margin-left: auto; display: flex; align-items: center; gap: 10px;
}
.icon-button {
  width: 46px; height: 46px; display: inline-flex; align-items: center; justify-content: center;
  border-radius: 999px; border: 1px solid var(--line); background: rgba(255, 255, 255, 0.95);
  color: var(--accent); cursor: pointer; transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
  box-shadow: 0 12px 28px rgba(27, 25, 22, 0.06);
}
.icon-button:hover {
  transform: translateY(-1px);
  border-color: rgba(217, 164, 65, 0.5);
  box-shadow: 0 18px 32px rgba(27, 25, 22, 0.1);
}
.icon-button svg { width: 20px; height: 20px; }
.icon-button--mobile { display: none; position: relative; flex: 0 0 auto; }
.icon-button--mobile span {
  display: block; width: 18px; height: 2px; border-radius: 999px; background: currentColor;
}
.icon-button--mobile span + span { margin-top: 4px; }
.cart-button { gap: 8px; width: auto; padding: 0 16px; font-weight: 600; }
.search-input {
  width: 100%; border-radius: 999px; border: 1px solid rgba(232, 224, 212, 0.95);
  background: rgba(255, 255, 255, 0.96); padding: 0 18px; min-height: 48px; color: var(--text);
  outline: none; box-shadow: inset 0 1px 1px rgba(27, 25, 22, 0.04);
}
.search-input:focus {
  border-color: rgba(217, 164, 65, 0.85); box-shadow: 0 0 0 4px rgba(217, 164, 65, 0.12);
}
.mobile-header-search {
  display: none;
}
.mobile-menu {
  position: fixed; inset: 0; display: none; padding: 24px;
  background: rgba(17, 15, 13, 0.44); backdrop-filter: blur(8px);
}
.mobile-menu.is-open { display: block; }
.mobile-menu::before {
  content: ""; position: absolute; inset: 0; backdrop-filter: blur(12px);
}
.mobile-menu > * {
  position: relative;
}
.mobile-menu__header,
.mobile-menu__nav,
.mobile-menu__actions,
.mobile-menu__search {
  width: min(360px, calc(100vw - 32px)); margin: 0 auto;
}
.mobile-menu__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px 24px 16px; border-radius: 28px 28px 0 0; background: #fffaf3;
}
.mobile-menu__close {
  width: 42px; height: 42px; border: 0; border-radius: 999px; background: rgba(23, 21, 19, 0.07);
  position: relative; cursor: pointer;
}
.mobile-menu__close span {
  position: absolute; top: 20px; left: 11px; width: 20px; height: 2px; border-radius: 999px; background: var(--accent);
}
.mobile-menu__close span:first-child { transform: rotate(45deg); }
.mobile-menu__close span:last-child { transform: rotate(-45deg); }
.mobile-menu__search {
  background: #fffaf3; padding: 0 24px 20px;
}
.mobile-menu__nav {
  display: grid; gap: 10px; background: #fffaf3; padding: 0 24px 18px;
}
.mobile-menu__link {
  display: flex; align-items: center; justify-content: space-between; min-height: 52px;
  padding: 0 18px; border-radius: 18px; background: rgba(217, 164, 65, 0.08); color: var(--accent); font-weight: 600;
}
.mobile-menu__link.is-active { background: rgba(217, 164, 65, 0.18); }
.mobile-menu__actions {
  display: grid; gap: 10px; background: #fffaf3; padding: 0 24px 28px; border-radius: 0 0 28px 28px;
}
.page-section { padding: 88px 0; }
.panel {
  padding: 28px; background: var(--panel); border-radius: 28px; border: 1px solid rgba(232, 224, 212, 0.9);
  box-shadow: var(--shadow);
}
.hero-section {
  padding: 32px 0 0;
}
.hero-banner {
  position: relative;
  overflow: hidden;
  min-height: 600px;
  border-radius: 0;
  background:
    radial-gradient(circle at 14% 20%, rgba(255, 255, 255, 0.16), transparent 25%),
    radial-gradient(circle at 80% 18%, rgba(255, 255, 255, 0.1), transparent 18%),
    linear-gradient(140deg, #15110e 5%, #1f1a15 32%, #c59233 86%, #f0c96a 100%);
  color: #fff;
  box-shadow: none;
}
.hero-banner::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(120deg, rgba(255, 255, 255, 0.18), transparent 38%),
    radial-gradient(circle at 68% 52%, rgba(0, 0, 0, 0.24), transparent 36%);
  pointer-events: none;
}
.hero-banner__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(320px, 0.78fr);
  align-items: center;
  gap: 48px;
  min-height: 600px;
  padding-block: 64px;
}
.hero-banner__content {
  max-width: 540px;
}
.hero-banner__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 22px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.hero-banner__eyebrow::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #f7cb6e;
  box-shadow: 0 0 18px rgba(247, 203, 110, 0.9);
}
.hero-banner__content h1 {
  margin: 0;
  font-size: clamp(3.1rem, 6vw, 5.6rem);
  line-height: 0.94;
  letter-spacing: -0.06em;
  text-transform: uppercase;
}
.hero-banner__content p {
  margin: 24px 0 0;
  max-width: 460px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 1.05rem;
  line-height: 1.7;
}
.hero-banner__copy {
  margin-top: 24px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 1rem;
  line-height: 1.75;
}
.hero-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 30px;
}
.hero-banner__ghost {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.hero-banner__ghost:hover {
  border-color: rgba(255, 255, 255, 0.36);
  background: rgba(255, 255, 255, 0.14);
}
.hero-banner__visual {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 430px;
}
.hero-speaker {
  position: relative;
  width: clamp(220px, 28vw, 360px);
  aspect-ratio: 0.74;
  border-radius: 44px;
  background:
    linear-gradient(180deg, rgba(54, 48, 40, 0.96) 0%, rgba(17, 14, 11, 0.98) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 34px 70px rgba(0, 0, 0, 0.34),
    inset 0 2px 10px rgba(255, 255, 255, 0.08),
    inset 0 -24px 34px rgba(0, 0, 0, 0.32);
}
.hero-speaker--rear {
  position: absolute;
  right: clamp(160px, 22vw, 250px);
  top: 36px;
  width: clamp(180px, 21vw, 260px);
  opacity: 0.42;
  transform: rotate(-12deg);
  filter: blur(0.4px);
}
.hero-speaker__top {
  position: absolute;
  top: 20px;
  left: 50%;
  width: 68%;
  height: 22px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(5, 5, 5, 0.66));
}
.hero-speaker__control {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 58%;
  border-radius: 999px;
}
.hero-speaker__control--one {
  top: 64px;
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
}
.hero-speaker__control--two {
  top: 84px;
  height: 7px;
  background: rgba(255, 255, 255, 0.05);
}
.hero-speaker__control--three {
  top: 100px;
  height: 5px;
  background: rgba(255, 255, 255, 0.04);
}
.hero-speaker--main {
  z-index: 1;
  display: grid;
  place-items: center;
}
.hero-speaker__halo {
  position: relative;
  width: 78%;
  aspect-ratio: 1;
  border-radius: 999px;
  background:
    radial-gradient(circle at 48% 44%, #0a0a0a 0 26%, #1f1f1f 27% 45%, #111 46% 52%, #4d4d4d 53% 55%, #171717 56% 66%, #060606 67% 100%);
  box-shadow:
    inset 0 0 30px rgba(255, 255, 255, 0.08),
    0 22px 44px rgba(0, 0, 0, 0.38);
}
.hero-speaker__halo::before,
.hero-speaker__halo::after {
  content: "";
  position: absolute;
  border-radius: inherit;
}
.hero-speaker__halo::before {
  inset: 18%;
  background:
    radial-gradient(circle at 46% 44%, #171717 0 30%, #040404 31% 60%, #202020 61% 67%, #070707 68% 100%);
  box-shadow: inset 0 0 24px rgba(255, 255, 255, 0.06);
}
.hero-speaker__halo::after {
  inset: 36%;
  background:
    radial-gradient(circle at 48% 40%, #585858 0 18%, #202020 19% 45%, #050505 46% 100%);
}
.hero-speaker__logo {
  position: absolute;
  top: 18%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
}
.hero-banner__arrow {
  position: absolute;
  top: 50%;
  z-index: 2;
  width: 52px;
  height: 52px;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  cursor: pointer;
  transform: translateY(-50%);
  transition: background 0.2s ease, transform 0.2s ease;
}
.hero-banner__arrow:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: translateY(-50%) scale(1.04);
}
.hero-banner__arrow span {
  width: 12px;
  height: 12px;
  display: block;
  border-top: 2px solid currentColor;
  border-right: 2px solid currentColor;
}
.hero-banner__arrow--left {
  left: clamp(16px, 4vw, 34px);
}
.hero-banner__arrow--left span {
  transform: rotate(-135deg);
}
.hero-banner__arrow--right {
  right: clamp(16px, 4vw, 34px);
}
.hero-banner__arrow--right span {
  transform: rotate(45deg);
}
.hero-banner__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 40px;
}
.hero-banner__metric {
  padding: 18px 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
.hero-banner__metric strong {
  display: block;
  font-size: 1.25rem;
  letter-spacing: -0.04em;
}
.hero-banner__metric span {
  display: block;
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
}
.section-kicker {
  margin: 0 0 10px;
  color: var(--brand-strong);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.homepage-products__header {
  display: grid;
  gap: 22px;
  margin-bottom: 26px;
}
.homepage-products__header h2,
.category-showcase__intro h2 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.8rem);
  line-height: 1.02;
  letter-spacing: -0.05em;
}
.hero-copy,
.homepage-products__title p {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}
.homepage-products__controls {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-end;
  flex-wrap: wrap;
}
.homepage-products__tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.homepage-products__tab {
  border: 0;
  border-radius: 999px;
  padding: 12px 18px;
  background: rgba(217, 164, 65, 0.12);
  color: var(--muted);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
.homepage-products__tab:hover {
  transform: translateY(-1px);
  color: var(--text);
}
.homepage-products__tab.is-active {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 20px 28px rgba(29, 26, 22, 0.18);
}
.homepage-products__view-all {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid rgba(27, 25, 22, 0.12);
  background: rgba(255, 255, 255, 0.88);
  font-weight: 600;
}
.category-showcase {
  display: grid;
  gap: 30px;
  padding-block: 82px 30px;
}
.category-showcase__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  gap: 18px;
}
.category-showcase__rail {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.category-tile {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 32px;
  min-height: 240px;
  background: linear-gradient(180deg, rgba(19, 16, 12, 0.88) 0%, rgba(19, 16, 12, 0.56) 100%);
  box-shadow: 0 28px 60px rgba(19, 16, 12, 0.14);
}
.category-tile--featured {
  min-height: 520px;
}
.category-tile__media,
.category-tile__overlay {
  position: absolute;
  inset: 0;
}
.category-tile__overlay {
  background:
    linear-gradient(180deg, rgba(9, 7, 5, 0.02), rgba(9, 7, 5, 0.68) 84%),
    radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.12), transparent 18%);
}
.category-tile__content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10px;
  padding: 28px;
  color: #fff;
}
.category-tile__count {
  display: inline-flex;
  width: fit-content;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.category-tile__content h2 {
  margin: 0;
  font-size: clamp(1.7rem, 3vw, 3rem);
  letter-spacing: -0.05em;
}
.category-tile--compact .category-tile__content h2 {
  font-size: 1.5rem;
}
.category-tile__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
.category-tile__cta::after {
  content: "";
  width: 8px;
  height: 8px;
  border-top: 2px solid currentColor;
  border-right: 2px solid currentColor;
  transform: rotate(45deg);
}
.category-art {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.category-art__shape {
  position: absolute;
  border-radius: 999px;
  filter: blur(0.2px);
}
.category-art__shape--one {
  width: 68%;
  height: 68%;
  left: 10%;
  top: 12%;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.02));
}
.category-art__shape--two {
  width: 44%;
  height: 44%;
  right: 6%;
  top: 14%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0.02));
}
.category-art__shape--three {
  width: 52%;
  height: 52%;
  right: 18%;
  bottom: -10%;
  background: rgba(0, 0, 0, 0.32);
}
.category-art__glow {
  position: absolute;
  inset: auto auto 10% 10%;
  width: 44%;
  height: 44%;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  filter: blur(28px);
}
.category-tile--laptops {
  background: linear-gradient(145deg, #16130f 0%, #6c4a1d 40%, #daaa4f 100%);
}
.category-tile--phones {
  background: linear-gradient(145deg, #121212 0%, #23343e 44%, #4f87a6 100%);
}
.category-tile--accessories {
  background: linear-gradient(145deg, #1c1310 0%, #6d2f18 48%, #d36a2d 100%);
}
.category-tile--monitors {
  background: linear-gradient(145deg, #13161f 0%, #223860 48%, #4d6bd8 100%);
}
.category-tile--printers {
  background: linear-gradient(145deg, #1f1712 0%, #4f3d2d 44%, #9f7952 100%);
}
.category-tile--storage {
  background: linear-gradient(145deg, #151515 0%, #323232 44%, #7b7b7b 100%);
}
.category-tile--audio {
  background: linear-gradient(145deg, #101019 0%, #372764 44%, #7e61dd 100%);
}
.service-banner {
  margin-top: -48px;
  position: relative;
  z-index: 2;
}
.service-banner__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.service-banner__card {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 22px 24px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(232, 224, 212, 0.92);
  box-shadow: 0 18px 34px rgba(20, 17, 12, 0.08);
}
.service-banner__icon {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  flex-shrink: 0;
  background: rgba(217, 164, 65, 0.14);
  color: var(--accent);
}
.service-banner__icon svg {
  width: 24px;
  height: 24px;
}
.service-banner__copy {
  display: grid;
  gap: 6px;
}
.service-banner__copy strong {
  font-size: 0.95rem;
  letter-spacing: -0.02em;
}
.service-banner__copy span {
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.6;
}
.homepage-products {
  display: grid;
  gap: 26px;
  padding-block: 36px 90px;
}
.homepage-grid {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px;
}
.product-card {
  display: flex; flex-direction: column; gap: 16px;
}
.product-card__media {
  aspect-ratio: 1 / 1; border-radius: 24px; background: linear-gradient(180deg, #f6efe3, #f1e7d8);
  display: grid; place-items: center; overflow: hidden;
}
.product-card__media img { width: 100%; height: 100%; object-fit: cover; }
.product-card__body {
  display: grid; gap: 12px;
}
.product-card__meta {
  display: flex; justify-content: space-between; gap: 12px; font-size: 0.85rem; color: var(--muted);
}
.product-card__title {
  margin: 0; font-size: 1.05rem;
}
.product-card__price {
  display: flex; align-items: center; gap: 10px; font-weight: 700;
}
.product-card__price span:last-child {
  color: var(--muted); font-weight: 500; text-decoration: line-through;
}
.product-card__actions {
  display: flex; gap: 10px;
}
.primary-link,
.ghost-link {
  display: inline-flex; align-items: center; justify-content: center; min-height: 48px;
  border-radius: 999px; padding: 0 22px; font-weight: 600; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.primary-link {
  border: 0; color: #fff; background: linear-gradient(135deg, var(--brand-strong), var(--brand));
  box-shadow: 0 18px 28px rgba(185, 128, 20, 0.24);
}
.primary-link:hover { transform: translateY(-1px); box-shadow: 0 22px 32px rgba(185, 128, 20, 0.28); }
.ghost-link {
  border: 1px solid rgba(27, 25, 22, 0.12); color: var(--text); background: rgba(255, 255, 255, 0.82);
}
.field-grid {
  display: grid; gap: 16px;
}
.field {
  display: grid; gap: 8px;
}
.field label {
  font-size: 0.88rem; color: var(--muted); font-weight: 500;
}
.field input,
.field select,
.field textarea {
  width: 100%; border-radius: 18px; border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.94); padding: 14px 16px; outline: none;
}
.field textarea {
  min-height: 160px; resize: vertical;
}
.site-footer {
  padding: 72px 0 88px; margin-top: 48px;
  border-top: 1px solid rgba(232, 224, 212, 0.9);
  background: rgba(255, 255, 255, 0.56);
}
.footer-grid {
  display: grid; grid-template-columns: 1.5fr repeat(3, minmax(0, 1fr)); gap: 24px;
}
.footer-grid h3 {
  margin: 0 0 12px; font-size: 1rem;
}
.footer-grid p,
.footer-grid li,
.footer-grid a {
  color: var(--muted);
}
.footer-grid ul {
  list-style: none; padding: 0; margin: 0; display: grid; gap: 10px;
}
.admin-grid {
  display: grid; grid-template-columns: minmax(0, 220px) minmax(0, 1fr); gap: 24px;
}
.admin-sidebar {
  display: grid; gap: 10px;
}
.admin-sidebar a {
  padding: 12px 16px; border-radius: 16px; background: rgba(217, 164, 65, 0.08); color: var(--text);
}
.toast-stack {
  position: fixed; right: 20px; bottom: 20px; display: grid; gap: 12px; z-index: 40;
}
.toast {
  padding: 14px 16px; border-radius: 18px; background: rgba(23, 21, 19, 0.9); color: #fff;
  min-width: 240px; box-shadow: 0 16px 36px rgba(0, 0, 0, 0.18);
}
.icon-mark {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon-mark svg {
  width: 100%;
  height: 100%;
  display: block;
}
.auth-shell {
  display: grid;
  gap: 28px;
}
.auth-shell__hero {
  position: relative;
  overflow: hidden;
  border-radius: 32px;
  padding: 40px;
  background:
    radial-gradient(circle at 12% 18%, rgba(255, 255, 255, 0.18), transparent 20%),
    linear-gradient(135deg, #18130f 0%, #3c2a14 46%, #d5a347 100%);
  color: #fff;
}
.auth-shell__hero::after {
  content: "";
  position: absolute;
  inset: auto -14% -42% auto;
  width: 440px;
  height: 440px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.16) 0%, transparent 72%);
}
.auth-shell__hero-content {
  position: relative;
  z-index: 1;
  max-width: 520px;
}
.auth-shell__eyebrow {
  margin: 0 0 12px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.auth-shell__hero h1 {
  margin: 0;
  font-size: clamp(2.3rem, 4.4vw, 3.8rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
}
.auth-shell__hero p {
  margin: 16px 0 0;
  max-width: 460px;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.7;
}
.auth-shell__card {
  max-width: 680px;
  margin: 0 auto;
}
.auth-shell__footer {
  margin: 18px 0 0;
  text-align: center;
  color: var(--muted);
}
.auth-shell__footer a {
  font-weight: 600;
  color: var(--brand-strong);
}
@media (max-width: 1080px) {
  .header-inner { grid-template-columns: auto 1fr auto; }
  .main-nav { display: none; }
  .icon-button--mobile { display: inline-flex; }
  .brand-mark--desktop-shell {
    display: none;
  }
  .brand-mark--mobile {
    display: inline-flex;
  }
  .header-topbar__inner { justify-content: center; }
  .header-topbar__inner span:last-child { display: none; }
  .mobile-support-link {
    display: inline-flex;
  }
  .header-mobile-top {
    display: grid;
    grid-column: 1 / -1;
  }
  .header-icon-actions {
    grid-column: 1 / -1;
    width: 100%;
    justify-content: flex-start;
    gap: 12px;
  }
  .mobile-header-search {
    display: block;
    flex: 1 1 auto;
    min-width: 0;
  }
  .icon-button--desktop { display: none; }
  .search-input { min-height: 46px; }
  .homepage-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hero-banner__inner {
    grid-template-columns: 1fr;
    min-height: 0;
    padding-block: 104px 88px;
    gap: 42px;
  }
  .hero-banner {
    min-height: 0;
  }
  .hero-banner__visual {
    justify-content: center;
    min-height: 360px;
  }
  .hero-speaker--rear {
    right: auto;
    left: calc(50% - min(210px, 21vw));
  }
  .hero-banner__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .category-showcase__grid,
  .footer-grid,
  .admin-grid {
    grid-template-columns: 1fr;
  }
  .service-banner__grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 720px) {
  .shell { width: min(100vw - 24px, 560px); }
  .page-section { padding: 64px 0; }
  .panel { padding: 22px; border-radius: 24px; }
  .header-inner {
    min-height: 0;
    padding: 14px 0 16px;
    gap: 14px;
  }
  .brand-mark__image {
    height: 50px;
  }
  .brand-mark--desktop-shell .brand-mark__image {
    height: 46px;
  }
  .header-icon-actions {
    gap: 10px;
  }
  .icon-button,
  .cart-button {
    min-height: 44px; height: 44px;
  }
  .icon-button--mobile {
    display: inline-flex;
    order: 1;
  }
  .mobile-header-search {
    display: block;
    order: 2;
    flex: 1 1 auto;
    min-width: 0;
  }
  .cart-button {
    order: 3;
  }
  .search-input { min-height: 44px; padding-inline: 16px; }
  .mobile-menu {
    padding: 16px;
  }
  .mobile-menu__header,
  .mobile-menu__nav,
  .mobile-menu__actions,
  .mobile-menu__search {
    width: min(100%, 420px);
  }
  .mobile-menu__header,
  .mobile-menu__search,
  .mobile-menu__nav,
  .mobile-menu__actions {
    padding-left: 18px;
    padding-right: 18px;
  }
  .hero-banner {
    border-radius: 0;
  }
  .hero-banner__inner {
    padding-block: 84px 56px;
    gap: 32px;
  }
  .hero-banner__content h1 {
    font-size: clamp(2.5rem, 16vw, 4rem);
    line-height: 0.92;
  }
  .hero-banner__content p,
  .hero-copy {
    font-size: 0.98rem;
  }
  .hero-banner__visual {
    min-height: 280px;
  }
  .hero-speaker {
    width: clamp(190px, 62vw, 280px);
    border-radius: 34px;
  }
  .hero-speaker--rear {
    width: clamp(150px, 44vw, 210px);
    left: calc(50% - min(130px, 22vw));
    top: 24px;
  }
  .hero-banner__metrics {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .hero-banner__metric {
    padding: 16px 18px;
  }
  .hero-banner__arrow {
    display: none;
  }
  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .hero-actions .primary-link,
  .hero-actions .ghost-link {
    width: 100%;
  }
  .service-banner {
    margin-top: -22px;
  }
  .category-showcase {
    padding-block: 56px 24px;
    gap: 20px;
  }
  .category-showcase__grid,
  .category-showcase__rail {
    grid-template-columns: 1fr;
  }
  .category-tile--featured {
    min-height: 380px;
  }
  .category-tile {
    min-height: 220px;
    border-radius: 26px;
  }
  .category-tile__content {
    padding: 22px;
  }
  .category-tile__content h2 {
    font-size: clamp(1.55rem, 6vw, 2.2rem);
  }
  .homepage-products {
    padding-block: 24px 72px;
    gap: 20px;
  }
  .homepage-products__header {
    gap: 18px;
    margin-bottom: 18px;
  }
  .homepage-products__controls {
    align-items: stretch;
  }
  .homepage-products__tabs {
    overflow-x: auto;
    padding-bottom: 4px;
    margin-inline: -2px;
  }
  .homepage-products__tab {
    flex: 0 0 auto;
  }
  .homepage-grid { grid-template-columns: 1fr; }
  .footer-grid { gap: 18px; }
  .auth-shell {
    gap: 20px;
  }
  .auth-shell__hero {
    padding: 28px 22px;
    border-radius: 24px;
  }
}
`;

export default function GlobalStyles() {
  return <style>{styles}</style>;
}
