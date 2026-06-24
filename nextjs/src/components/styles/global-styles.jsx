const styles = `
/* Vercel redeploy trigger: no visual behavior change. */
:root {
  color-scheme: light;
  --panel: #ffffff;
  --panel-soft: #f8f2e6;
  --text: #1b1916;
  --muted: #665d52;
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
  -webkit-text-size-adjust: 100%;
}
body {
  background: #f5f6f7;
  color: var(--text);
  font-family: inherit;
}
img, svg, video, canvas {
  max-width: 100%;
  display: block;
}
.stable-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  backface-visibility: visible;
  -webkit-backface-visibility: visible;
  transform: none;
  -webkit-transform: none;
}
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
.app-shell { min-height: 100vh; display: flex; flex-direction: column; max-width: 100%; overflow-x: clip; }
.app-content { flex: 1; }
.shell { width: min(1180px, calc(100vw - 32px)); margin: 0 auto; }
.site-header .shell { width: calc(100vw - 24px); max-width: none; }
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
  display: flex; align-items: center; gap: 2px; min-width: 0;
}
.header-mobile-quick-actions {
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
  min-height: 30px;
}
.header-search-mode {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: minmax(120px, 1fr) minmax(0, 2fr) minmax(70px, 1fr);
  align-items: center;
  gap: 14px;
}
.header-search-mode__brand {
  justify-self: start;
  display: inline-flex;
}
.header-search-mode__brand .brand-mark__image {
  height: 44px;
  width: auto;
}
.header-search-mode__brand .brand-mark__fallback {
  min-width: 128px;
  height: 44px;
}
.header-search-mode__form {
  position: relative;
  width: 100%;
  max-width: 980px;
  justify-self: center;
}
.header-search-mode__form .search-input {
  height: 56px;
  border-radius: 0;
  border: 1px solid #cfd7e3;
  background: #fff;
  font-size: 1rem;
  font-style: italic;
  padding: 10px 98px 10px 16px;
}
.header-search-mode__clear,
.header-search-mode__submit {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #1d2531;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.header-search-mode__clear {
  right: 54px;
  width: 28px;
  height: 28px;
  border: 1px solid #374252;
}
.header-search-mode__clear span {
  position: absolute;
  width: 12px;
  height: 2px;
  background: currentColor;
}
.header-search-mode__clear span:first-child { transform: rotate(45deg); }
.header-search-mode__clear span:last-child { transform: rotate(-45deg); }
.header-search-mode__submit {
  right: 12px;
  width: 28px;
  height: 28px;
}
.header-search-mode__cancel {
  justify-self: end;
  width: 42px;
  height: 42px;
  border: 1px solid #242b36;
  border-radius: 0;
  background: #fff;
  color: #242b36;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.header-search-mode__cancel span {
  position: absolute;
  width: 14px;
  height: 2px;
  background: currentColor;
}
.header-search-mode__cancel span:first-child { transform: rotate(45deg); }
.header-search-mode__cancel span:last-child { transform: rotate(-45deg); }
.header-search-mode__results {
  grid-column: 1 / -1;
  position: relative;
  z-index: 2;
}
.header-search-mode__assist {
  display: none;
}
.brand-mark { display: inline-flex; align-items: center; gap: 12px; min-width: 0; }
.brand-mark__image { width: auto; height: 40px; object-fit: contain; display: block; }
.brand-mark__fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 122px;
  height: 40px;
  padding: 0 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, #0f4f2c, #1f7a45);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.brand-mark--mobile .brand-mark__image { height: 42px; }
.brand-mark--mobile .brand-mark__fallback { height: 42px; min-width: 136px; }
.brand-mark--mobile {
  margin-left: -10px;
}
.brand-mark--desktop-shell .brand-mark__image { height: 58px; }
.brand-mark--desktop-shell .brand-mark__fallback { height: 58px; min-width: 168px; }
.brand-mark--desktop-shell {
  display: none;
}
.main-nav, .header-actions, .hero-actions, .stack-actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.main-nav {
  display: none;
}
.nav-dropdown {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.nav-link {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  padding: 12px 0; color: #262016; text-transform: none; font-size: 0.95rem; font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
}
.nav-link--toggle {
  border: 0;
  background: transparent;
  cursor: pointer;
}
.nav-link::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: -10px; height: 2px;
  border-radius: 999px; background: transparent; transition: background 180ms ease, transform 180ms ease;
  transform: scaleX(0.5);
}
.nav-link.is-active, .nav-link:hover { color: var(--text); }
.nav-link.is-active::after, .nav-link:hover::after, .nav-link.is-open::after { background: #1693cf; transform: scaleX(1); }
.nav-dropdown__panel {
  position: absolute;
  top: calc(100% + 1px);
  left: 0;
  transform: translateY(8px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 180ms ease, transform 180ms ease;
  z-index: 35;
}
.nav-dropdown.is-open .nav-dropdown__panel {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
.nav-dropdown__section {
  position: relative;
  padding: 0;
  border-radius: 0;
  border: 1px solid #dbe3ee;
  background: #f7f9fc;
  box-shadow: 0 16px 34px rgba(16, 40, 74, 0.14);
}
.nav-dropdown__section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #1693cf;
}
.nav-dropdown__content {
  display: grid;
  gap: 0;
  padding: 0;
}
.nav-dropdown__content--cols-1 {
  grid-template-columns: minmax(0, 1fr);
}
.nav-dropdown__content--cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.nav-dropdown__content--cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.nav-dropdown__columns {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}
.nav-dropdown__column {
  display: grid;
  align-content: start;
  gap: 12px;
  min-width: 0;
  padding: 28px 30px;
  background: #ffffff;
  border-right: 1px solid #e5ecf5;
}
.nav-dropdown__column:last-child {
  border-right: 0;
}
.nav-dropdown__column--muted {
  background: #f1f3f7;
}
.nav-dropdown__heading {
  display: inline-flex;
  margin: 0;
  color: #111826;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
}
.nav-dropdown__heading--muted {
  color: #6b6255;
}
.nav-dropdown__links {
  display: grid;
  gap: 4px;
}
.nav-dropdown__link {
  display: block;
  padding: 5px 0;
  border-radius: 0;
  color: #1b2432;
  font-weight: 500;
  background: transparent;
  transition: color 180ms ease, transform 180ms ease;
}
.nav-dropdown__link:hover {
  color: #0f4f84;
  transform: none;
}
.header-icon-actions {
  margin-left: auto; display: flex; align-items: center; justify-content: flex-end; gap: 10px;
}
.cart-dropdown {
  position: relative;
  display: inline-flex;
}
.cart-dropdown__panel {
  position: absolute;
  top: calc(100% + 1px);
  right: 0;
  width: min(440px, calc(100vw - 28px));
  border: 1px solid #d6deea;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(11, 35, 67, 0.16);
  border-radius: 16px;
  z-index: 50;
  overflow: hidden;
}
.cart-dropdown__empty {
  min-height: 300px;
  display: grid;
  place-items: center;
  padding: 24px;
}
.cart-dropdown__empty p {
  margin: 0;
  color: #1d2531;
  font-size: 0.98rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.32;
}
.cart-dropdown__content {
  display: grid;
}
.cart-dropdown__items {
  max-height: 420px;
  overflow: auto;
}
.cart-dropdown__item {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr);
  gap: 16px;
  padding: 16px 22px;
  border-bottom: 1px solid #e3e9f3;
}
.cart-dropdown__thumb {
  width: 110px;
  height: 90px;
  background: #f6f8fb;
  border-radius: 6px;
  overflow: hidden;
}
.cart-dropdown__thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.cart-dropdown__name {
  color: inherit;
}
.cart-dropdown__meta {
  min-width: 0;
  display: grid;
  align-content: start;
  gap: 10px;
}
.cart-dropdown__meta strong {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 500;
  line-height: 1.28;
  color: #151b27;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.cart-dropdown__line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}
.cart-dropdown__line span {
  color: #232a36;
  font-size: 0.88rem;
  font-weight: 500;
}
.cart-dropdown__line b {
  color: #161d28;
  font-size: 0.92rem;
  font-weight: 700;
}
.cart-dropdown__remove {
  justify-self: start;
  border: 0;
  background: transparent;
  color: #0d56da;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0;
  cursor: pointer;
}
.cart-dropdown__remove:hover {
  text-decoration: underline;
}
.cart-dropdown__summary {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 22px 10px;
}
.cart-dropdown__summary p {
  margin: 0;
  color: #1e2431;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.88rem;
}
.cart-dropdown__summary strong {
  margin: 0;
  color: #161d28;
  font-size: 1.06rem;
  font-weight: 800;
}
.cart-dropdown__cta {
  margin: 0 22px 16px;
  min-height: 50px;
  border-radius: 10px;
  background: #0d56da;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-size: 0.86rem;
  font-weight: 800;
}
.cart-feedback {
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: flex;
  justify-content: flex-end;
  min-height: 100svh;
  height: 100dvh;
  overflow: hidden;
}
.cart-feedback__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(10, 18, 34, 0.48);
}
.cart-feedback__panel {
  position: relative;
  width: min(460px, 100vw);
  min-height: 100svh;
  height: 100dvh;
  background: #ffffff;
  border-left: 1px solid #dbe4f0;
  box-shadow: -20px 0 52px rgba(9, 23, 42, 0.22);
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
  overscroll-behavior: contain;
}
.cart-feedback__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: max(20px, calc(env(safe-area-inset-top) + 14px)) 24px 16px;
  border-bottom: 1px solid #e5ebf4;
}
.cart-feedback__head h2 {
  margin: 0;
  color: #0b4ea8;
  font-size: 1.55rem;
  font-weight: 800;
}
.cart-feedback__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #121a27;
  transition: transform 0.18s ease, background 0.22s ease, color 0.22s ease;
}
.cart-feedback__close:hover,
.cart-feedback__close:focus-visible {
  transform: translateY(-1px);
  background: rgba(13, 86, 218, 0.08);
  color: #0d56da;
}
.cart-feedback__close:active {
  transform: translateY(0);
}
.cart-feedback__close span {
  position: absolute;
  width: 16px;
  height: 2px;
  background: currentColor;
  border-radius: 999px;
}
.cart-feedback__close span:first-child {
  transform: rotate(45deg);
}
.cart-feedback__close span:last-child {
  transform: rotate(-45deg);
}
.cart-feedback__body {
  overflow: auto;
  min-height: 0;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: 8px 0 0;
}
.cart-feedback__items {
  display: grid;
}
.cart-feedback__item {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid #ebf0f7;
}
.cart-feedback__delete {
  border: 1px solid #e6dfd2;
  background: #fff;
  color: #1b1916;
  cursor: pointer;
  width: auto;
  min-height: 38px;
  min-width: 96px;
  padding: 0 14px;
  border-radius: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.1;
  white-space: nowrap;
  transition: transform 0.18s ease, box-shadow 0.22s ease, background 0.22s ease, border-color 0.22s ease, color 0.22s ease;
}
.cart-feedback__delete svg {
  width: 17px;
  height: 17px;
  flex: 0 0 17px;
}
.cart-feedback__delete:hover {
  transform: translateY(-1px);
  border-color: #0d56da;
  color: #0a43ad;
  background: rgba(13, 86, 218, 0.05);
  box-shadow: 0 12px 24px rgba(13, 86, 218, 0.1);
}
.cart-feedback__delete:focus-visible {
  outline: 3px solid rgba(13, 86, 218, 0.16);
  outline-offset: 3px;
}
.cart-feedback__delete:active {
  transform: translateY(0);
  box-shadow: 0 7px 16px rgba(13, 86, 218, 0.08);
}
.cart-feedback__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.cart-feedback__bottom {
  display: flex;
  align-items: center;
  gap: 12px;
}
.cart-feedback__meta {
  min-width: 0;
  display: grid;
  gap: 8px;
  align-content: start;
}
.cart-feedback__name {
  color: #111a28;
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1.2;
}
.cart-feedback__sku {
  margin: 0;
  color: #111a28;
  font-size: 0.8rem;
  font-weight: 600;
}
.cart-feedback__price {
  margin: 0;
  color: #111a28;
  font-size: 0.96rem;
  font-weight: 800;
  white-space: nowrap;
}
.cart-feedback__price-stack {
  display: grid;
  justify-items: end;
  gap: 2px;
}
.cart-feedback__price-stack small {
  color: #8f8a80;
  text-decoration: line-through;
  white-space: nowrap;
}
.cart-feedback__qty {
  margin-top: 0;
  display: inline-flex;
  align-items: center;
  gap: 0;
  border: 1px solid #d2dae8;
  border-radius: 10px;
  overflow: hidden;
  width: fit-content;
}
.cart-feedback__qty button {
  width: 36px;
  height: 32px;
  border: 0;
  background: #fff;
  color: #222b38;
  font-size: 1.3rem;
  line-height: 1;
  cursor: pointer;
  transition: transform 0.18s ease, background 0.22s ease, color 0.22s ease;
}
.cart-feedback__qty button:hover,
.cart-feedback__qty button:focus-visible {
  transform: translateY(-1px);
  background: rgba(24, 77, 34, 0.08);
  color: #184d22;
}
.cart-feedback__qty button:active {
  transform: translateY(0);
}
.cart-feedback__qty span {
  min-width: 34px;
  text-align: center;
  color: #111a28;
  font-weight: 700;
  font-size: 0.9rem;
}
.cart-feedback__thumb {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
  background: #f7f9fc;
}
.cart-feedback__thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.cart-feedback__empty {
  min-height: 320px;
  display: grid;
  place-items: center;
  padding: 24px;
}
.cart-feedback__empty p {
  margin: 0;
  color: #1b2433;
  font-size: 1rem;
  font-weight: 700;
}
.cart-feedback__foot {
  border-top: 1px solid #e5ebf4;
  padding: 16px 24px max(20px, calc(env(safe-area-inset-bottom) + 20px));
  display: grid;
  gap: 14px;
}
.cart-feedback__subtotal {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.cart-feedback__subtotal span {
  color: #121b29;
  font-size: 1.1rem;
  font-weight: 700;
}
.cart-feedback__subtotal strong {
  color: #111a28;
  font-size: 1.25rem;
  font-weight: 800;
}
.cart-feedback__actions {
  display: grid;
  gap: 10px;
}
.cart-feedback__view,
.cart-feedback__checkout {
  min-height: 56px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  transition: transform 0.18s ease, box-shadow 0.22s ease, background 0.22s ease, color 0.22s ease;
}
.cart-feedback__view {
  background: #184d22;
  color: #fff;
  box-shadow: 0 12px 26px rgba(24, 77, 34, 0.16);
}
.cart-feedback__checkout {
  background:
    radial-gradient(circle at 76% 18%, rgba(255, 255, 255, 0.14), transparent 34%),
    linear-gradient(135deg, #0b4dac 0%, #0a4fcf 45%, #0a4aa8 100%);
  color: #fff;
  box-shadow: 0 12px 26px rgba(10, 79, 207, 0.18);
}
.cart-feedback__view:hover,
.cart-feedback__view:focus-visible {
  transform: translateY(-2px);
  background: #123f1f;
  box-shadow: 0 16px 32px rgba(24, 77, 34, 0.22);
}
.cart-feedback__checkout:hover,
.cart-feedback__checkout:focus-visible {
  transform: translateY(-2px);
  background:
    radial-gradient(circle at 76% 18%, rgba(255, 255, 255, 0.2), transparent 34%),
    linear-gradient(135deg, #08429b 0%, #004aad 45%, #083f92 100%);
  box-shadow: 0 16px 32px rgba(10, 79, 207, 0.24);
}
.cart-feedback__view:active,
.cart-feedback__checkout:active {
  transform: translateY(0);
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.14);
}
@media (prefers-reduced-motion: reduce) {
  .cart-feedback__close,
  .cart-feedback__delete,
  .cart-feedback__qty button,
  .cart-feedback__view,
  .cart-feedback__checkout {
    transition: none;
  }
  .cart-feedback__close:hover,
  .cart-feedback__close:focus-visible,
  .cart-feedback__close:active,
  .cart-feedback__delete:hover,
  .cart-feedback__delete:active,
  .cart-feedback__qty button:hover,
  .cart-feedback__qty button:focus-visible,
  .cart-feedback__qty button:active,
  .cart-feedback__view:hover,
  .cart-feedback__view:focus-visible,
  .cart-feedback__view:active,
  .cart-feedback__checkout:hover,
  .cart-feedback__checkout:focus-visible,
  .cart-feedback__checkout:active {
    transform: none;
  }
}
@media (max-width: 900px) {
  .cart-feedback__panel {
    width: min(420px, 100vw);
  }
  .cart-feedback__head {
    padding: 14px 16px 12px;
  }
  .cart-feedback__head h2 {
    font-size: 1.45rem;
  }
  .cart-feedback__item {
    grid-template-columns: 64px minmax(0, 1fr);
    padding: 12px 14px;
  }
  .cart-feedback__delete {
    min-width: 96px;
    min-height: 38px;
    height: 38px;
    padding: 0 12px;
    font-size: 0.86rem;
    gap: 7px;
  }
  .cart-feedback__delete svg {
    width: 16px;
    height: 16px;
  }
  .cart-feedback__top,
  .cart-feedback__bottom {
    gap: 8px;
  }
  .cart-feedback__name {
    font-size: 0.82rem;
  }
  .cart-feedback__sku {
    font-size: 0.74rem;
  }
  .cart-feedback__price {
    font-size: 0.96rem;
  }
  .cart-feedback__qty button {
    width: 32px;
    height: 30px;
  }
  .cart-feedback__qty span {
    min-width: 30px;
    font-size: 0.84rem;
  }
  .cart-feedback__thumb {
    width: 64px;
    height: 64px;
  }
  .cart-feedback__foot {
    padding: 14px 16px 16px;
  }
  .cart-feedback__subtotal span {
    font-size: 0.95rem;
  }
  .cart-feedback__subtotal strong {
    font-size: 1.05rem;
  }
  .cart-feedback__view,
  .cart-feedback__checkout {
    min-height: 48px;
    font-size: 1rem;
  }
}
.wishlist-dropdown {
  position: relative;
  display: inline-flex;
}
.wishlist-dropdown__panel {
  position: absolute;
  top: calc(100% + 1px);
  right: 0;
  width: min(420px, calc(100vw - 28px));
  border: 1px solid #d6deea;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(11, 35, 67, 0.16);
  border-radius: 16px;
  z-index: 50;
  overflow: hidden;
}
.wishlist-dropdown__empty {
  min-height: 210px;
  padding: 20px;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 14px;
  text-align: center;
}
.wishlist-dropdown__empty p {
  margin: 0;
  color: #1d2531;
  font-size: 0.95rem;
  font-weight: 700;
}
.wishlist-dropdown__content {
  display: grid;
}
.wishlist-dropdown__items {
  max-height: 360px;
  overflow: auto;
}
.wishlist-dropdown__item {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid #e3e9f3;
}
.wishlist-dropdown__thumb {
  width: 92px;
  height: 76px;
  background: #f6f8fb;
  border-radius: 6px;
  overflow: hidden;
}
.wishlist-dropdown__thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.wishlist-dropdown__name {
  color: inherit;
}
.wishlist-dropdown__meta {
  min-width: 0;
  display: grid;
  align-content: center;
  gap: 8px;
}
.wishlist-dropdown__meta strong {
  margin: 0;
  color: #151b27;
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1.32;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.wishlist-dropdown__meta b {
  margin: 0;
  color: #111827;
  font-size: 0.92rem;
  font-weight: 800;
}
.wishlist-dropdown__remove {
  justify-self: start;
  border: 0;
  background: transparent;
  color: #0d56da;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0;
  cursor: pointer;
}
.wishlist-dropdown__remove:hover {
  text-decoration: underline;
}
.wishlist-dropdown__cta {
  margin: 12px 18px 16px;
  min-height: 46px;
  border-radius: 10px;
  background: #0d56da;
  color: #fff;
  width: calc(100% - 36px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-transform: none;
  letter-spacing: 0.01em;
  font-size: 0.9rem;
  line-height: 1;
  font-weight: 800;
  padding: 0 14px;
  transition: background 0.2s ease, transform 0.2s ease;
}
.wishlist-dropdown__cta:hover {
  background: #0b4cc2;
}
.wishlist-dropdown__cta:active {
  transform: translateY(1px);
}
.notification-dropdown {
  position: relative;
  display: inline-flex;
}
.notification-dropdown__panel {
  position: fixed;
  top: 0;
  right: 0;
  width: min(400px, 100vw);
  height: 100dvh;
  border-left: 1px solid #d7dde8;
  background: #ffffff;
  box-shadow: -18px 0 42px rgba(11, 35, 67, 0.18);
  border-radius: 0;
  z-index: 2147483646;
  overflow: hidden;
  animation: notificationSlideIn 220ms cubic-bezier(0.22, 1, 0.36, 1);
}
.notification-dropdown__panel--mobile {
  right: 0;
  width: min(372px, 100vw);
}
@keyframes notificationSlideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
.notification-dropdown__empty {
  min-height: 100%;
  padding: 20px;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 14px;
  text-align: center;
}
.notification-dropdown__empty p {
  margin: 0;
  color: #1d2531;
  font-size: 0.95rem;
  font-weight: 700;
}
.notification-dropdown__content {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  height: 100%;
  min-height: 0;
}
.notification-dropdown__head {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 22px 18px 18px;
  border-bottom: 0;
}
.notification-dropdown__title {
  margin-right: auto;
  display: grid;
  gap: 3px;
  min-width: 0;
}
.notification-dropdown__title strong {
  color: #202124;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1.15;
}
.notification-dropdown__status {
  min-height: 54px;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  padding: 0 18px;
  border-bottom: 1px solid #e3e9f3;
  color: #6f737a;
  font-size: 0.84rem;
  text-align: right;
}
.notification-dropdown__status span:last-child {
  justify-self: end;
}
.notification-dropdown__items {
  min-height: 0;
  max-height: none;
  overflow: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  background: #fff;
}
.notification-dropdown__close {
  position: relative;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 0;
  background: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  flex: 0 0 auto;
}
.notification-dropdown__close span {
  position: absolute;
  width: 18px;
  height: 2px;
  background: #6f737a;
  border-radius: 999px;
}
.notification-dropdown__close span:first-child {
  transform: rotate(45deg);
}
.notification-dropdown__close span:last-child {
  transform: rotate(-45deg);
}
.notification-dropdown__close:hover {
  background: #f5f9ff;
}
.notification-dropdown__close:focus-visible {
  outline: 2px solid #0d56da;
  outline-offset: 2px;
}
.notification-dropdown__item {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid #e5e7eb;
  color: inherit;
  transition: background 180ms ease;
}
.notification-dropdown__item.is-unread {
  background: #f3f4f6;
}
.notification-dropdown__item:hover {
  background: #f7f8fa;
}
.notification-dropdown__empty--compact {
  min-height: 0;
  padding: 18px;
}
.notification-dropdown__meta {
  min-width: 0;
  display: grid;
  gap: 3px;
}
.notification-dropdown__meta strong {
  margin: 0;
  color: #202124;
  font-size: 0.88rem;
  font-weight: 500;
  line-height: 1.28;
}
.notification-dropdown__meta p {
  margin: 0;
  color: #4f5359;
  font-size: 0.8rem;
  line-height: 1.35;
}
.notification-dropdown__meta span {
  color: #747980;
  font-size: 0.74rem;
  line-height: 1.25;
}
.notification-dropdown__check {
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border: 2px solid #7d8288;
  border-radius: 2px;
  align-self: start;
  margin-top: 2px;
}
.notification-dropdown__check.is-read {
  border-color: #b3b6bb;
  background: #b3b6bb;
}
.notification-dropdown__check.is-read::after {
  content: "";
  width: 8px;
  height: 5px;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(-45deg) translateY(-1px);
}
.notification-dropdown__cta {
  margin: 0;
  min-height: 48px;
  border-radius: 0;
  background: #fff;
  color: #1a73e8;
  width: 100%;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-transform: none;
  letter-spacing: 0.01em;
  font-size: 0.9rem;
  line-height: 1;
  font-weight: 800;
  padding: 0 14px;
  transition: background 0.2s ease, transform 0.2s ease;
}
.notification-dropdown__cta:hover {
  background: #f7f8fa;
}
.notification-dropdown__cta:active {
  transform: translateY(1px);
}
.account-dropdown {
  position: relative;
  display: inline-flex;
}
.account-dropdown__panel {
  position: absolute;
  top: calc(100% + 1px);
  right: 0;
  width: min(340px, calc(100vw - 24px));
  border: 1px solid #d6deea;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(11, 35, 67, 0.16);
  border-radius: 0;
  padding: 14px;
  display: grid;
  gap: 12px;
  z-index: 50;
}
.account-dropdown__head {
  display: grid;
  gap: 4px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e6edf7;
}
.account-dropdown__head p {
  margin: 0;
  color: #617086;
  font-size: 0.86rem;
  line-height: 1.45;
}
.account-dropdown__head strong {
  margin: 0;
  color: #121c2d;
  font-size: 1rem;
  font-weight: 700;
}
.account-dropdown__links {
  display: grid;
  gap: 4px;
}
.account-dropdown__link {
  display: block;
  padding: 9px 10px;
  color: #1b2433;
  font-size: 0.94rem;
  font-weight: 500;
  border: 1px solid transparent;
  border-radius: 8px;
}
.account-dropdown__link:hover {
  background: #f4f8ff;
  border-color: #d9e8ff;
  color: #0f4f84;
}
.account-dropdown__logout {
  min-height: 42px;
  border: 1px solid #e3e9f4;
  background: #fff;
  color: #1b2433;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
}
.account-dropdown__logout:hover {
  border-color: #c8d9f4;
  background: #f8fbff;
}
.account-dropdown__guest-actions {
  display: grid;
  gap: 8px;
}
.account-dropdown__login,
.account-dropdown__register {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.92rem;
}
.account-dropdown__login {
  border: 1px solid #cad8ec;
  color: #1a2434;
  background: #fff;
}
.account-dropdown__register {
  border: 1px solid #0d56da;
  background: #0d56da;
  color: #fff;
}
.account-dropdown__help {
  color: #0d56da;
  font-size: 0.88rem;
  font-weight: 600;
}
.mobile-account-dropdown {
  display: none;
}
.mobile-header-search {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.mobile-header-search .search-input {
  min-width: 0; height: 42px; border-radius: 12px; padding: 11px 42px 11px 40px;
  border-color: #dfd5c8;
  background: #fff;
  font-size: 16px;
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
.mobile-header-search__clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 999px;
  background: rgba(33, 82, 59, 0.08);
  color: #21523b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.mobile-header-search__clear span {
  position: absolute;
  width: 10px;
  height: 2px;
  background: currentColor;
}
.mobile-header-search__clear span:first-child {
  transform: rotate(45deg);
}
.mobile-header-search__clear span:last-child {
  transform: rotate(-45deg);
}
.desktop-search-tray {
  display: none;
}
.desktop-search-tray__form {
  position: relative;
  max-width: 660px;
  margin: 12px auto 0;
}
.desktop-search-tray__form .search-input {
  width: 100%;
  min-width: 0;
  height: 58px;
  padding: 14px 108px 14px 62px;
  border: 2px solid #21523b;
  border-radius: 999px;
  background: #fff;
  font-size: 1.05rem;
  color: #1b1916;
}
.desktop-search-tray__clear,
.desktop-search-tray__submit,
.desktop-search-tray__close {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.desktop-search-tray__clear {
  left: 10px;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(33, 82, 59, 0.16);
  border-radius: 999px;
  background: rgba(33, 82, 59, 0.06);
  color: #21523b;
  cursor: pointer;
}
.desktop-search-tray__clear span {
  position: absolute;
  width: 12px;
  height: 2px;
  background: currentColor;
}
.desktop-search-tray__clear span:first-child {
  transform: rotate(45deg);
}
.desktop-search-tray__clear span:last-child {
  transform: rotate(-45deg);
}
.desktop-search-tray__submit svg {
  width: 1.05rem;
  height: 1.05rem;
}
.desktop-search-tray__submit {
  right: 48px;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #21523b;
  cursor: pointer;
}
.desktop-search-tray__close {
  right: 8px;
  width: 36px;
  height: 36px;
  border: 0;
  background: transparent;
  color: #21523b;
  cursor: pointer;
}
.desktop-search-tray__close span {
  position: absolute;
  width: 15px;
  height: 2px;
  background: currentColor;
}
.desktop-search-tray__close span:first-child {
  transform: rotate(45deg);
}
.desktop-search-tray__close span:last-child {
  transform: rotate(-45deg);
}
.desktop-search-tray__results {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 0;
  border: 1px solid #d7dce5;
  background: #fff;
  margin-top: 8px;
}
.desktop-search-tray__suggestions,
.desktop-search-tray__products {
  display: grid;
  gap: 10px;
}
.desktop-search-tray__sidebar {
  padding: 18px 16px;
  border-right: 1px solid #d7dce5;
  display: grid;
  align-content: start;
  gap: 10px;
}
.desktop-search-tray__sidebar-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: #1d2531;
}
.desktop-search-tray__suggestion {
  color: #151922;
  font-size: 1.06rem;
  font-weight: 600;
  text-transform: lowercase;
}
.desktop-search-tray__all-results {
  margin-top: 12px;
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  background: #0d56da;
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.72rem;
}
.desktop-search-tray__main {
  padding: 16px 18px;
}
.desktop-search-tray__section-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 10px;
}
.desktop-search-tray__section-head--secondary {
  margin-top: 16px;
}
.desktop-search-tray__section-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 500;
  color: #141924;
}
.desktop-search-tray__section-title span {
  color: #6a7381;
  font-size: 1.6rem;
}
.desktop-search-tray__see-all {
  color: #0d56da;
  font-size: 1rem;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 500;
}
.desktop-search-tray__product {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
  border: 1px solid #aeb6c4;
  padding: 10px;
}
.desktop-search-tray__product-thumb {
  width: 110px;
  height: 84px;
  border-radius: 0;
  overflow: hidden;
  background: #f5f7fb;
}
.desktop-search-tray__product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
.desktop-search-tray__product-copy {
  min-width: 0;
  display: grid;
  gap: 7px;
}
.desktop-search-tray__product-copy p {
  margin: 0;
  color: #3d4654;
  font-size: 0.9rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.desktop-search-tray__product-copy strong {
  color: #141924;
  font-size: 0.98rem;
  font-weight: 500;
  line-height: 1.28;
}
.desktop-search-tray__product-copy b {
  color: #121212;
  font-size: 1.15rem;
  font-weight: 700;
}
.desktop-search-tray__empty {
  margin: 4px 0;
  color: #6f7785;
}
.desktop-search-tray__products {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.mobile-search-results {
  margin-top: 10px;
  width: 100%;
  min-width: 0;
}
.mobile-search-results .desktop-search-tray__results {
  margin-top: 0;
  padding: 0 2px;
  max-width: none;
  width: 100%;
  contain: layout paint;
}
.mobile-search-results .desktop-search-tray__label {
  font-size: 0.82rem;
}
.mobile-search-results .desktop-search-tray__results {
  grid-template-columns: 1fr;
}
.mobile-search-results .desktop-search-tray__sidebar {
  border-right: 0;
  border-bottom: 1px solid #d7dce5;
}
.mobile-search-results .desktop-search-tray__products {
  grid-template-columns: 1fr;
}
.mobile-search-results .desktop-search-tray__section-title {
  font-size: 1.3rem;
}
.mobile-search-results .desktop-search-tray__section-title span {
  font-size: 1.1rem;
}

.icon-button {
  width: 48px; height: 48px; border: 1px solid transparent; border-radius: 999px; background: transparent;
  display: inline-flex; align-items: center; justify-content: center; color: var(--text); cursor: pointer;
  position: relative;
  line-height: 0;
  transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
}
.icon-button:hover { background: rgba(22, 147, 207, 0.08); border-color: rgba(22, 147, 207, 0.24); }
.icon-button svg,
.icon-button img { width: 1.6rem; height: 1.6rem; display: block; flex: 0 0 auto; }
.icon-button--mobile {
  width: 30px; height: 30px; border: 0; border-radius: 0; background: transparent; flex-direction: column; gap: 4px;
  box-shadow: none; padding: 0;
}
.icon-button--mobile span {
  width: 18px; height: 2px; border-radius: 0; background: var(--text); display: block;
}
.icon-button--mobile-action {
  width: 36px; height: 36px; border: 0; border-radius: 0; background: transparent; padding: 0;
}
.icon-button--mobile-action.is-active {
  background: rgba(22, 147, 207, 0.1);
}
.icon-button--mobile-action svg {
  width: 1.42rem; height: 1.42rem;
}
.icon-button--desktop { display: none; }
.cart-button { position: relative; }
.icon-button__badge {
  position: absolute; top: -5px; right: -6px; min-width: 18px; height: 18px; padding: 0 4px;
  border-radius: 999px; background: var(--brand); color: #171513; font-size: 0.7rem; font-weight: 700;
  display: grid; place-items: center;
  font-variant-numeric: tabular-nums;
  z-index: 2;
}
.icon-button__badge.is-pending {
  background: #d8d3ca;
  color: #5a6575;
}
.mobile-menu {
  position: fixed; top: 0; left: 0; z-index: 2147483647;
  background: #2b313e;
  color: #e9edf4;
  padding: max(14px, env(safe-area-inset-top)) 0 max(16px, env(safe-area-inset-bottom));
  display: grid; grid-template-rows: auto 1fr auto; gap: 14px;
  min-height: 100dvh; height: 100dvh; width: min(390px, 100vw);
  overflow-y: auto; overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch; isolation: isolate; touch-action: pan-y;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 24px 0 40px rgba(13, 17, 24, 0.36);
  opacity: 0; visibility: hidden; pointer-events: none; transform: translate3d(-18px, 0, 0);
  transition: opacity 220ms ease, transform 220ms ease, visibility 220ms ease;
}
.mobile-menu.is-open { opacity: 1; visibility: visible; pointer-events: auto; transform: translate3d(0, 0, 0); }
.mobile-menu__header {
  display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 10px;
  padding: 0 12px;
}
.mobile-menu__close {
  width: 40px; height: 40px; border: 0; border-radius: 10px; background: transparent;
  display: inline-flex; align-items: center; justify-content: center; position: relative; cursor: pointer;
}
.mobile-menu__close span {
  position: absolute; width: 19px; height: 2px; border-radius: 999px; background: #f2f5fb;
}
.mobile-menu__close span:first-child { transform: rotate(45deg); }
.mobile-menu__close span:last-child { transform: rotate(-45deg); }
.mobile-menu__title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #f2f5fb;
}
.mobile-menu__shop-toggle {
  min-height: 42px;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: #f3f7ff;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}
.mobile-menu__shop-symbol {
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 1;
}
.mobile-menu__shop-toggle--root {
  border: 0;
  border-radius: 0;
  background: transparent;
  color: #eef3ff;
  min-height: 48px;
  padding: 0 6px;
  font-size: 1.95rem;
  box-shadow: none;
}
.mobile-menu__shop-toggle--root:hover {
  background: rgba(255, 255, 255, 0.06);
}
.mobile-menu__search { display: none; }
.mobile-menu__nav {
  display: grid; align-content: start; gap: 0;
  padding-top: 4px;
}
.mobile-menu__nav--catalog {
  gap: 0;
}
.mobile-menu__top-links {
  display: grid;
  gap: 18px;
  padding: 16px 14px;
  min-height: calc(100dvh - 130px);
  align-content: center;
}
.mobile-menu__top-link {
  min-height: 56px;
  padding: 0 10px;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: #9ea9bd;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.95rem;
  font-weight: 600;
}
.mobile-menu__top-link-icon {
  width: 0.85rem;
  height: 0.85rem;
  color: #0f62fe;
}
.mobile-menu__label-with-count {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}
.mobile-menu__count {
  display: inline-grid;
  place-items: center;
  min-width: 24px;
  height: 24px;
  padding: 0 7px;
  border-radius: 999px;
  background: #d39a21;
  color: #111827;
  font-size: 0.76rem;
  font-weight: 800;
  line-height: 1;
}
.mobile-menu__top-link:hover {
  color: #cbd6ea;
}
.mobile-menu__top-links .mobile-menu__shop-toggle {
  min-height: 58px;
  font-size: 2.7rem;
  border-color: rgba(86, 151, 255, 0.95);
}
.mobile-menu__shop-body {
  display: grid;
  gap: 0;
}
.mobile-menu__link {
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  border-bottom: 1px solid rgba(12, 16, 23, 0.3);
  background: #2b313e;
  color: #f2f5fb;
  min-height: 64px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.5rem;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
}
.mobile-menu__link--button {
  width: 100%;
  border-left: 0;
  border-right: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  border-bottom: 1px solid rgba(12, 16, 23, 0.3);
  cursor: pointer;
}
.mobile-menu__link.is-active {
  background: #252b38;
}
.mobile-menu__section {
  background: #2b313e;
  color: #e9edf4;
  overflow: hidden;
  box-shadow: none;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  border-bottom: 1px solid rgba(12, 16, 23, 0.3);
}
.mobile-menu__section-header {
  display: block;
}
.mobile-menu__section-trigger {
  width: 100%;
  min-height: 64px;
  border: 0;
  background: transparent;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
  cursor: pointer;
}
.mobile-menu__section-trigger span:first-child {
  font-size: 1.5rem;
  font-weight: 500;
  color: #dfe5ef;
}
.mobile-menu__section-chevron {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg) translateY(-1px);
  transition: transform 180ms ease;
  color: #dfe5ef;
}
.mobile-menu__section.is-open .mobile-menu__section-chevron {
  transform: rotate(-135deg) translateX(1px);
}
.mobile-menu__section-body {
  display: grid;
  gap: 0;
  padding: 0 0 10px;
  background: rgba(16, 21, 30, 0.22);
}
.mobile-menu__sublink {
  display: block;
  padding: 12px 24px 12px 30px;
  color: rgba(232, 238, 247, 0.95);
  font-size: 1.18rem;
  font-weight: 500;
  background: transparent;
  text-align: left;
}
.mobile-menu__sublink:hover {
  background: rgba(132, 160, 207, 0.1);
}
.mobile-menu__sublink--all {
  color: #9ec8ff;
}
.mobile-menu__actions {
  display: grid; gap: 10px; padding: 0 14px;
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
  color: #fff; box-shadow: var(--shadow); font-weight: 700;
}
.ghost-link, .ghost-button { background: white; color: var(--text); border: 1px solid var(--line); }
.cart-pill { background: var(--text); color: white; }
.cart-pill span {
  min-width: 26px; height: 26px; border-radius: 999px; display: grid; place-items: center;
  background: rgba(255,255,255,0.18);
}
.page-section { padding: 32px 0 48px; }
.hero-grid,
  .filters-panel,
  .cart-layout,
  .footer-grid,
  .resource-grid {
  display: grid; gap: 18px;
}
.hero-grid { grid-template-columns: 1.4fr 1fr; }
.hero-grid h1, .section-header h1, .panel h1 { margin: 0; font-size: clamp(2rem, 5vw, 4rem); line-height: 1.02; }
.hero-copy,
  .section-kicker,
  .auth-copy,
  .form-error,
  .muted { color: var(--muted); }
.section-kicker { text-transform: uppercase; letter-spacing: 0.16em; font-size: 0.78rem; font-weight: 700; }
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.not-found-page {
  min-height: calc(100vh - 120px);
  display: grid;
  place-items: center;
  padding: 48px 0 72px;
}
.not-found-shell {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 20px;
  text-align: center;
  padding: 32px 0;
}
.not-found-code {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(8px, 1.5vw, 18px);
  line-height: 0.84;
}
.not-found-code__digit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: clamp(90px, 18vw, 210px);
  height: clamp(120px, 24vw, 260px);
  font-size: clamp(7rem, 21vw, 15rem);
  font-weight: 700;
  color: transparent;
  background:
    linear-gradient(180deg, rgba(238, 245, 232, 0.95) 0%, rgba(206, 223, 194, 0.94) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  position: relative;
}
.not-found-code__digit::before {
  content: "";
  position: absolute;
  inset: 10% 2%;
  z-index: -1;
  background:
    radial-gradient(circle at 50% 50%, rgba(217, 164, 65, 0.62), rgba(217, 164, 65, 0.06) 46%, transparent 72%),
    linear-gradient(135deg, rgba(24, 70, 37, 0.16) 0%, rgba(217, 164, 65, 0.28) 52%, rgba(248, 250, 246, 0.1) 100%);
  border-radius: 26px;
  mix-blend-mode: multiply;
  filter: saturate(1.08);
}
.not-found-copy {
  display: grid;
  justify-items: center;
  gap: 12px;
  max-width: 720px;
}
.not-found-copy h1 {
  margin: 0;
  font-size: clamp(2.1rem, 5vw, 4rem);
  line-height: 1.04;
}
.not-found-copy h1 span {
  color: var(--brand-strong);
}
.not-found-copy p {
  margin: 0;
  max-width: 580px;
  color: #3f382e;
  font-size: clamp(1rem, 2vw, 1.3rem);
  line-height: 1.7;
}
.not-found-copy__cta {
  margin-top: 10px;
  min-width: 220px;
}
.not-found-ornament {
  position: absolute;
  display: grid;
  gap: 10px;
}
.not-found-ornament span {
  display: block;
  width: 16px;
  height: 16px;
  background: #184625;
  transform: rotate(45deg);
  border-radius: 4px;
  box-shadow: 0 10px 24px rgba(24, 70, 37, 0.18);
}
.not-found-ornament span:nth-child(2) {
  width: 28px;
  height: 28px;
}
.not-found-ornament span:nth-child(3) {
  width: 12px;
  height: 12px;
}
.not-found-ornament--left {
  left: 18%;
  top: 8%;
}
.not-found-ornament--right {
  right: 17%;
  top: 42%;
}
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
@keyframes homeLogoMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-50% - 7px)); }
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
.home-social-strip {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) auto;
  gap: 18px;
  align-items: center;
  padding-bottom: 24px;
}
.home-social-strip__copy {
  display: grid;
  gap: 6px;
}
.home-social-strip__copy h2 {
  margin: 0;
  font-size: clamp(1.45rem, 3vw, 2rem);
  line-height: 1.06;
}
.home-social-strip__copy .hero-copy {
  margin: 0;
}
.home-social-strip__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}
.home-social-strip__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border: 1px solid rgba(24, 77, 34, 0.18);
  background: #fff;
  color: var(--text);
  text-decoration: none;
  font-weight: 600;
  transition: transform 180ms ease, box-shadow 180ms ease, color 180ms ease, border-color 180ms ease;
}
.home-social-strip__link:hover {
  color: var(--brand-strong);
  border-color: rgba(24, 77, 34, 0.34);
  box-shadow: 0 14px 28px rgba(17, 24, 39, 0.08);
  transform: translateY(-1px);
}
.hero-panel,
  .panel {
  background: var(--panel); border: 1px solid rgba(217, 226, 240, 0.95); border-radius: 28px; box-shadow: var(--shadow);
}
.hero-panel, .panel { padding: 24px; }
.field-group { display: grid; gap: 8px; }
.disabled-field { background: #f5f7fb; color: var(--muted); }
.filters-panel { grid-template-columns: 1.6fr 220px; margin-bottom: 20px; }
@keyframes shopCatalogSettle {
  from {
    opacity: 0.96;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.products-results {
  margin: 0;
  color: #4b5563;
  font-size: 0.96rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}
.cart-layout,
  .wishlist-shell,
  .orders-shell,
  .contact-cards,
  .contact-map-section,
  .contact-highlights,
  .faq-showcase,
  .about-story,
  .about-showcase,
  .about-services,
  .about-reasons,
  .about-core-values,
  .static-content-page {
  content-visibility: visible;
  contain: none;
}
@keyframes skeleton-shimmer {
  0% { background-position: 120% 0; }
  100% { background-position: -120% 0; }
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
  grid-template-columns: minmax(0, 1.6fr) 120px 170px 120px;
  gap: 16px;
  align-items: center;
  padding: 24px 26px;
  border-bottom: 1px solid #eee6db;
}
.cart-row:last-child {
  border-bottom: 0;
}
.cart-row__remove {
  border: 1px solid #e6dfd2;
  background: #fff;
  color: #1b1916;
  cursor: pointer;
  width: 100%;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.1;
  white-space: nowrap;
  transition: transform 0.18s ease, box-shadow 0.22s ease, background 0.22s ease, border-color 0.22s ease, color 0.22s ease;
}
.cart-row__remove svg {
  width: 17px;
  height: 17px;
  flex: 0 0 17px;
  display: block;
}
.cart-row__remove:hover {
  transform: translateY(-1px);
  border-color: #0d56da;
  color: #0a43ad;
  background: rgba(13, 86, 218, 0.05);
  box-shadow: 0 12px 24px rgba(13, 86, 218, 0.1);
}
.cart-row__remove:focus-visible {
  outline: 3px solid rgba(13, 86, 218, 0.16);
  outline-offset: 3px;
}
.cart-row__remove:active {
  transform: translateY(0);
  box-shadow: 0 7px 16px rgba(13, 86, 218, 0.08);
}
.cart-row__subtotal-block {
  display: grid;
  gap: 8px;
  align-content: start;
}
.cart-row__product {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
  color: inherit;
  text-decoration: none;
}
.cart-row__product:hover h3,
.cart-row__product:focus-visible h3 {
  color: #184f27;
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
.cart-row__price-block,
.cart-row__subtotal-stack {
  display: grid;
  gap: 3px;
}
.cart-row__price-old,
.cart-row__subtotal-old {
  margin: 0;
  color: #8f8a80;
  font-size: 0.84rem;
  font-weight: 600;
  text-decoration: line-through;
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
  transition: transform 0.18s ease, background 0.22s ease, color 0.22s ease;
}
.cart-row__qty button:hover,
.cart-row__qty button:focus-visible {
  transform: translateY(-1px);
  background: rgba(24, 77, 34, 0.08);
  color: #184d22;
}
.cart-row__qty button:active {
  transform: translateY(0);
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
  box-shadow: 0 12px 26px rgba(24, 77, 34, 0.16);
  transition: transform 0.18s ease, box-shadow 0.22s ease, background 0.22s ease;
}
.cart-summary__checkout:hover,
.cart-summary__checkout:focus-visible {
  transform: translateY(-2px);
  background: #123f1f;
  box-shadow: 0 16px 32px rgba(24, 77, 34, 0.22);
}
.cart-summary__checkout:active {
  transform: translateY(0);
  box-shadow: 0 8px 18px rgba(24, 77, 34, 0.16);
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
  box-shadow: 0 12px 26px rgba(24, 77, 34, 0.14);
  transition: transform 0.18s ease, box-shadow 0.22s ease, background 0.22s ease;
}
.cart-actions-bar__apply:hover,
.cart-actions-bar__apply:focus-visible {
  transform: translateY(-2px);
  background: #123f1f;
  box-shadow: 0 16px 32px rgba(24, 77, 34, 0.2);
}
.cart-actions-bar__apply:active {
  transform: translateY(0);
  box-shadow: 0 8px 18px rgba(24, 77, 34, 0.14);
}
.cart-actions-bar__clear {
  border: 0;
  background: transparent;
  color: #184d22;
  text-decoration: underline;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: transform 0.18s ease, color 0.22s ease;
}
.cart-actions-bar__clear:hover,
.cart-actions-bar__clear:focus-visible {
  transform: translateY(-1px);
  color: #123f1f;
}
@media (prefers-reduced-motion: reduce) {
  .cart-row__remove,
  .cart-row__qty button,
  .cart-row__remove-mobile,
  .cart-summary__checkout,
  .cart-actions-bar__apply,
  .cart-actions-bar__clear {
    transition: none;
  }
  .cart-row__remove:hover,
  .cart-row__remove:focus-visible,
  .cart-row__remove:active,
  .cart-row__qty button:hover,
  .cart-row__qty button:focus-visible,
  .cart-row__qty button:active,
  .cart-row__remove-mobile:hover,
  .cart-row__remove-mobile:focus-visible,
  .cart-row__remove-mobile:active,
  .cart-summary__checkout:hover,
  .cart-summary__checkout:focus-visible,
  .cart-summary__checkout:active,
  .cart-actions-bar__apply:hover,
  .cart-actions-bar__apply:focus-visible,
  .cart-actions-bar__apply:active,
  .cart-actions-bar__clear:hover,
  .cart-actions-bar__clear:focus-visible {
    transform: none;
  }
}
.wishlist-shell {
  display: grid;
  gap: 26px;
  background: #ffffff;
  padding: 28px 30px 30px;
}
.wishlist-page {
  min-height: 980px;
}
.wishlist-skeleton {
  min-height: 520px;
}
.wishlist-skeleton__head {
  display: grid;
  grid-template-columns: 112px minmax(0, 1.8fr) 120px 160px 130px 160px;
  gap: 18px;
  align-items: center;
  padding: 18px 22px;
  background: #184d22;
  border-radius: 16px;
}
.wishlist-skeleton__head span {
  height: 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.26);
}
.wishlist-skeleton__list {
  display: grid;
}
.wishlist-skeleton__row {
  display: grid;
  grid-template-columns: 112px minmax(0, 1.8fr) 120px 160px 130px 160px;
  gap: 18px;
  align-items: center;
  padding: 22px 0;
  border-bottom: 1px solid #ece5d9;
}
.wishlist-skeleton__row > span,
.wishlist-skeleton__meta span,
.wishlist-skeleton__thumb,
.wishlist-skeleton__actions span {
  display: block;
  border-radius: 0;
  background:
    linear-gradient(90deg, rgba(239, 244, 250, 0.78), rgba(255, 255, 255, 0.96), rgba(239, 244, 250, 0.78));
  background-size: 220% 100%;
  animation: skeleton-shimmer 1.4s ease-in-out infinite;
}
.wishlist-skeleton__row > span {
  height: 18px;
}
.wishlist-skeleton__button {
  min-height: 44px;
}
.wishlist-skeleton__product {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
}
.wishlist-skeleton__thumb {
  width: 88px;
  height: 88px;
  border-radius: 16px;
}
.wishlist-skeleton__meta {
  display: grid;
  gap: 10px;
}
.wishlist-skeleton__meta span:first-child {
  width: min(100%, 260px);
  height: 18px;
}
.wishlist-skeleton__meta span:last-child {
  width: 120px;
  height: 14px;
}
.wishlist-skeleton__actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 18px;
  align-items: center;
}
.wishlist-skeleton__actions span {
  height: 54px;
}
.wishlist-skeleton__actions span:first-child {
  min-width: 0;
}
.wishlist-skeleton__actions span:not(:first-child) {
  width: 150px;
}
.wishlist-table {
  padding: 0;
  background: #ffffff;
  border: 0;
  box-shadow: none;
}
.wishlist-table__head {
  display: grid;
  grid-template-columns: 112px minmax(0, 1.8fr) 120px 160px 130px 160px;
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
  grid-template-columns: 112px minmax(0, 1.8fr) 120px 160px 130px 160px;
  gap: 18px;
  align-items: center;
  padding: 22px 0;
  border-bottom: 1px solid #ece5d9;
}
.wishlist-row__remove {
  border: 1px solid #e6dfd2;
  background: #fff;
  color: #1b1916;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.1;
  cursor: pointer;
  min-height: 44px;
  width: 100%;
  padding: 0 18px;
  border-radius: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  transition: transform 0.18s ease, box-shadow 0.22s ease, background 0.22s ease, border-color 0.22s ease, color 0.22s ease;
}
.wishlist-row__remove svg {
  width: 17px;
  height: 17px;
  flex: 0 0 17px;
  display: block;
}
.wishlist-row__remove:hover {
  transform: translateY(-1px);
  border-color: #0d56da;
  color: #0d56da;
  background: rgba(13, 86, 218, 0.05);
  box-shadow: 0 12px 24px rgba(13, 86, 218, 0.1);
}
.wishlist-row__remove:active {
  transform: translateY(0);
  box-shadow: 0 7px 16px rgba(13, 86, 218, 0.08);
}
.wishlist-row__product {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}
.wishlist-row__product:focus-visible {
  outline: 3px solid rgba(24, 77, 34, 0.16);
  outline-offset: 4px;
  border-radius: 18px;
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
.wishlist-row__product:hover .wishlist-row__meta h3,
.wishlist-row__product:focus-visible .wishlist-row__meta h3 {
  color: var(--brand-strong);
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
  box-shadow: 0 12px 26px rgba(24, 77, 34, 0.16);
  transition: transform 0.18s ease, box-shadow 0.22s ease, background 0.22s ease, color 0.22s ease;
}
.wishlist-row__cart:hover,
.wishlist-row__cart:focus-visible {
  transform: translateY(-2px);
  background: #123f1f;
  box-shadow: 0 16px 32px rgba(24, 77, 34, 0.22);
}
.wishlist-row__cart:active {
  transform: translateY(0);
  box-shadow: 0 8px 18px rgba(24, 77, 34, 0.16);
}
.wishlist-row__cart:disabled {
  background: #d6d1c8;
  color: #7f7668;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.wishlist-row__mobile-actions,
.wishlist-row__remove-mobile {
  display: none;
}
.wishlist-row__remove-mobile {
  transition: transform 0.18s ease, box-shadow 0.22s ease, background 0.22s ease, border-color 0.22s ease, color 0.22s ease;
}
.wishlist-row__remove-mobile:hover,
.wishlist-row__remove-mobile:focus-visible {
  transform: translateY(-1px);
  border-color: #0d56da;
  color: #0d56da;
  background: rgba(13, 86, 218, 0.05);
  box-shadow: 0 12px 24px rgba(13, 86, 218, 0.1);
}
.wishlist-row__remove-mobile:active {
  transform: translateY(0);
  box-shadow: 0 7px 16px rgba(13, 86, 218, 0.08);
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
  box-shadow: 0 12px 26px rgba(24, 77, 34, 0.16);
  transition: transform 0.18s ease, box-shadow 0.22s ease, background 0.22s ease;
}
.wishlist-actions__copy:hover,
.wishlist-actions__copy:focus-visible,
.wishlist-actions__add-all:hover,
.wishlist-actions__add-all:focus-visible {
  transform: translateY(-2px);
  background: #123f1f;
  box-shadow: 0 16px 32px rgba(24, 77, 34, 0.22);
}
.wishlist-actions__copy:active,
.wishlist-actions__add-all:active {
  transform: translateY(0);
  box-shadow: 0 8px 18px rgba(24, 77, 34, 0.16);
}
.wishlist-actions__clear {
  border: 0;
  background: transparent;
  color: #b98014;
  text-decoration: underline;
  text-underline-offset: 5px;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.18s ease, color 0.22s ease;
}
.wishlist-actions__clear:hover,
.wishlist-actions__clear:focus-visible {
  transform: translateY(-1px);
  color: #8d5c09;
}
.wishlist-empty {
  display: grid;
  gap: 18px;
  justify-items: start;
}
.wishlist-empty .stack-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.wishlist-empty .primary-link,
.wishlist-empty .ghost-link {
  min-width: 166px;
  min-height: 50px;
  padding: 0 24px;
  text-align: center;
  transition: transform 0.18s ease, box-shadow 0.22s ease, background 0.22s ease, border-color 0.22s ease, color 0.22s ease;
}
.wishlist-empty .primary-link:hover,
.wishlist-empty .primary-link:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px rgba(10, 79, 207, 0.24);
}
.wishlist-empty .ghost-link:hover,
.wishlist-empty .ghost-link:focus-visible {
  transform: translateY(-2px);
  border-color: rgba(13, 86, 218, 0.3);
  color: #0a43ad;
  box-shadow: 0 14px 28px rgba(17, 24, 39, 0.08);
}
.wishlist-empty .primary-link:active,
.wishlist-empty .ghost-link:active {
  transform: translateY(0);
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.12);
}
@keyframes deetechEmptyFloat {
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, -8px, 0);
  }
}
@keyframes deetechEmptyBadgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}
@keyframes deetechEmptyIconNudge {
  0%, 100% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  50% {
    transform: translate3d(0, -3px, 0) rotate(-2deg);
  }
}
.wishlist-empty-state {
  display: grid;
  gap: 22px;
  max-width: 1060px;
  margin: 0 auto 54px;
}
.wishlist-empty-state__card {
  min-height: 430px;
  padding: clamp(34px, 5vw, 64px);
  border: 1px solid rgba(24, 87, 42, 0.18);
  border-radius: 18px;
  background:
    radial-gradient(circle at 50% 18%, rgba(156, 243, 168, 0.18), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.92));
  box-shadow: 0 26px 70px rgba(27, 25, 22, 0.08);
  display: grid;
  align-content: center;
  justify-items: center;
  text-align: center;
  gap: 20px;
}
.wishlist-empty-state__mark {
  position: relative;
  width: 148px;
  height: 148px;
  border-radius: 28px;
  background: #dce7fb;
  color: #00401b;
  display: grid;
  place-items: center;
  box-shadow: inset 0 0 0 1px rgba(24, 87, 42, 0.08);
  animation: deetechEmptyFloat 4.8s ease-in-out infinite;
}
.wishlist-empty-state__heart {
  width: 112px;
  height: 112px;
  display: block;
}
.wishlist-empty-state__mark span {
  position: absolute;
  right: -10px;
  bottom: -10px;
  width: 54px;
  height: 54px;
  border: 6px solid #ffffff;
  border-radius: 18px;
  background: #9cf3a8;
  color: #18572a;
  display: grid;
  place-items: center;
  box-shadow: 0 14px 30px rgba(24, 87, 42, 0.18);
  animation: deetechEmptyBadgePulse 3.2s ease-in-out infinite;
}
.wishlist-empty-state__mark span svg {
  width: 25px;
  height: 25px;
}
.wishlist-empty-state__copy {
  display: grid;
  gap: 10px;
  justify-items: center;
}
.wishlist-empty-state__eyebrow {
  margin: 0;
  color: #18572a;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.wishlist-empty-state__copy h2 {
  margin: 0;
  color: #0b1320;
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1.02;
  letter-spacing: 0;
}
.wishlist-empty-state__copy p:last-child {
  margin: 0;
  max-width: 560px;
  color: #4b5550;
  font-size: 1.04rem;
  line-height: 1.65;
}
.wishlist-empty-state__primary {
  min-height: 52px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 24px;
  background: #00401b;
  color: #ffffff;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 16px 32px rgba(0, 64, 27, 0.18);
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
}
.wishlist-empty-state__primary svg {
  width: 20px;
  height: 20px;
}
.wishlist-empty-state__primary:hover,
.wishlist-empty-state__primary:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(0, 64, 27, 0.16);
}
.wishlist-empty-state__primary:active {
  transform: translateY(0);
  box-shadow: 0 10px 22px rgba(0, 64, 27, 0.12);
}
.wishlist-empty-state__quick-links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.wishlist-empty-state__quick-links a {
  min-height: 94px;
  padding: 18px;
  border: 1px solid rgba(24, 87, 42, 0.18);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.82);
  color: #0b1320;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  text-decoration: none;
  box-shadow: 0 12px 34px rgba(27, 25, 22, 0.04);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}
.wishlist-empty-state__quick-links a:hover,
.wishlist-empty-state__quick-links a:focus-visible {
  transform: translateY(-2px);
  border-color: rgba(24, 87, 42, 0.44);
  box-shadow: 0 18px 36px rgba(27, 25, 22, 0.08);
}
.wishlist-empty-state__quick-links svg {
  width: 42px;
  height: 42px;
  padding: 9px;
  border-radius: 12px;
  background: #eaf1ff;
  color: #18572a;
  animation: deetechEmptyIconNudge 5.2s ease-in-out infinite;
}
.wishlist-empty-state__quick-links span {
  min-width: 0;
  display: grid;
  gap: 4px;
}
.wishlist-empty-state__quick-links strong {
  color: #00401b;
  font-size: 0.96rem;
  line-height: 1.2;
}
  .wishlist-empty-state__quick-links small {
    color: #626b66;
    font-size: 0.84rem;
    line-height: 1.35;
  }
@media (max-width: 760px) {
  .wishlist-empty-state {
    width: min(100%, 390px);
    margin: 0 auto 34px;
    gap: 16px;
  }
  .wishlist-empty-state__card {
    min-height: auto;
    padding: 44px 20px 22px;
    border-radius: 0;
    border: 0;
    background:
      radial-gradient(circle at 50% 20%, rgba(156, 243, 168, 0.18), transparent 36%),
      #f5f6f7;
    box-shadow: none;
    gap: 18px;
  }
  .wishlist-empty-state__mark {
    width: 118px;
    height: 118px;
    border-radius: 22px;
  }
  .wishlist-empty-state__heart {
    width: 92px;
    height: 92px;
  }
  .wishlist-empty-state__mark span {
    width: 46px;
    height: 46px;
    right: -8px;
    bottom: -8px;
    border-width: 5px;
    border-radius: 15px;
  }
  .wishlist-empty-state__mark span svg {
    width: 22px;
    height: 22px;
  }
  .wishlist-empty-state__eyebrow {
    font-size: 0.7rem;
    letter-spacing: 0.13em;
  }
  .wishlist-empty-state__copy h2 {
    font-size: 2rem;
    line-height: 1.08;
  }
  .wishlist-empty-state__copy p:last-child {
    max-width: 330px;
    font-size: 0.98rem;
    line-height: 1.55;
  }
  .wishlist-empty-state__primary {
    width: 100%;
    min-height: 56px;
    border-radius: 8px;
    font-size: 0.96rem;
  }
  .wishlist-empty-state__quick-links {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .wishlist-empty-state__quick-links a {
    min-height: 76px;
    padding: 14px 16px;
    border-radius: 8px;
    grid-template-columns: 38px minmax(0, 1fr);
  }
  .wishlist-empty-state__quick-links svg {
    width: 38px;
    height: 38px;
    padding: 8px;
    border-radius: 11px;
  }
  .wishlist-empty-state__quick-links strong {
    font-size: 0.94rem;
  }
  .wishlist-empty-state__quick-links small {
    font-size: 0.8rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .wishlist-row__remove,
  .wishlist-row__remove-mobile,
  .wishlist-row__cart,
  .wishlist-actions__copy,
  .wishlist-actions__add-all,
  .wishlist-actions__clear,
  .wishlist-empty .primary-link,
  .wishlist-empty .ghost-link,
  .wishlist-empty-state__primary,
  .wishlist-empty-state__quick-links a,
  .wishlist-empty-state__mark,
  .wishlist-empty-state__mark span,
  .wishlist-empty-state__quick-links svg {
    transition: none;
    animation: none;
  }
  .wishlist-row__remove:hover,
  .wishlist-row__remove:focus-visible,
  .wishlist-row__remove:active,
  .wishlist-row__remove-mobile:hover,
  .wishlist-row__remove-mobile:focus-visible,
  .wishlist-row__remove-mobile:active,
  .wishlist-row__cart:hover,
  .wishlist-row__cart:focus-visible,
  .wishlist-row__cart:active,
  .wishlist-actions__copy:hover,
  .wishlist-actions__copy:focus-visible,
  .wishlist-actions__copy:active,
  .wishlist-actions__add-all:hover,
  .wishlist-actions__add-all:focus-visible,
  .wishlist-actions__add-all:active,
  .wishlist-actions__clear:hover,
  .wishlist-actions__clear:focus-visible,
  .wishlist-empty .primary-link:hover,
  .wishlist-empty .primary-link:focus-visible,
  .wishlist-empty .primary-link:active,
  .wishlist-empty .ghost-link:hover,
  .wishlist-empty .ghost-link:focus-visible,
  .wishlist-empty .ghost-link:active,
  .wishlist-empty-state__primary:hover,
  .wishlist-empty-state__primary:focus-visible,
  .wishlist-empty-state__primary:active,
  .wishlist-empty-state__quick-links a:hover,
  .wishlist-empty-state__quick-links a:focus-visible {
    transform: none;
  }
}
.cart-empty {
  display: grid;
  gap: 14px;
  justify-items: start;
}
.cart-empty-state {
  display: grid;
  gap: 22px;
  max-width: 1060px;
  margin: 0 auto 54px;
}
.cart-empty-state__card {
  min-height: 430px;
  padding: clamp(34px, 5vw, 64px);
  border: 1px solid rgba(24, 87, 42, 0.18);
  border-radius: 18px;
  background:
    radial-gradient(circle at 50% 18%, rgba(156, 243, 168, 0.22), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.92));
  box-shadow: 0 26px 70px rgba(27, 25, 22, 0.08);
  display: grid;
  align-content: center;
  justify-items: center;
  text-align: center;
  gap: 20px;
}
.cart-empty-state__mark {
  position: relative;
  width: 148px;
  height: 148px;
  border-radius: 28px;
  background: #dce7fb;
  color: #00401b;
  display: grid;
  place-items: center;
  box-shadow: inset 0 0 0 1px rgba(24, 87, 42, 0.08);
  animation: deetechEmptyFloat 4.8s ease-in-out infinite;
}
.cart-empty-state__bag {
  width: 112px;
  height: 112px;
  display: block;
}
.cart-empty-state__mark span {
  position: absolute;
  right: -10px;
  bottom: -10px;
  width: 54px;
  height: 54px;
  border: 6px solid #ffffff;
  border-radius: 18px;
  background: #9cf3a8;
  color: #18572a;
  display: grid;
  place-items: center;
  box-shadow: 0 14px 30px rgba(24, 87, 42, 0.18);
  animation: deetechEmptyBadgePulse 3.2s ease-in-out infinite;
}
.cart-empty-state__mark span svg {
  width: 25px;
  height: 25px;
}
.cart-empty-state__copy {
  display: grid;
  gap: 10px;
  justify-items: center;
}
.cart-empty-state__eyebrow {
  margin: 0;
  color: #18572a;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.cart-empty-state__copy h2 {
  margin: 0;
  color: #0b1320;
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1.02;
  letter-spacing: 0;
}
.cart-empty-state__copy p:last-child {
  margin: 0;
  max-width: 560px;
  color: #4b5550;
  font-size: 1.04rem;
  line-height: 1.65;
}
.cart-empty-state__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
.cart-empty-state__primary,
.cart-empty-state__secondary {
  min-height: 52px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 24px;
  font-weight: 800;
  text-decoration: none;
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease, border-color 180ms ease;
}
.cart-empty-state__primary {
  background: #00401b;
  color: #ffffff;
  box-shadow: 0 16px 32px rgba(0, 64, 27, 0.18);
}
.cart-empty-state__primary svg {
  width: 20px;
  height: 20px;
}
.cart-empty-state__secondary {
  border: 1px solid rgba(24, 87, 42, 0.34);
  background: #ffffff;
  color: #00401b;
}
.cart-empty-state__primary:hover,
.cart-empty-state__primary:focus-visible,
.cart-empty-state__secondary:hover,
.cart-empty-state__secondary:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(0, 64, 27, 0.16);
}
.cart-empty-state__primary:active,
.cart-empty-state__secondary:active {
  transform: translateY(0);
  box-shadow: 0 10px 22px rgba(0, 64, 27, 0.12);
}
.cart-empty-state__quick-links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.cart-empty-state__quick-links a {
  min-height: 94px;
  padding: 18px;
  border: 1px solid rgba(24, 87, 42, 0.18);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.82);
  color: #0b1320;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  text-decoration: none;
  box-shadow: 0 12px 34px rgba(27, 25, 22, 0.04);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}
.cart-empty-state__quick-links a:hover,
.cart-empty-state__quick-links a:focus-visible {
  transform: translateY(-2px);
  border-color: rgba(24, 87, 42, 0.44);
  box-shadow: 0 18px 36px rgba(27, 25, 22, 0.08);
}
.cart-empty-state__quick-links svg {
  width: 42px;
  height: 42px;
  padding: 9px;
  border-radius: 12px;
  background: #eaf1ff;
  color: #18572a;
  animation: deetechEmptyIconNudge 5.2s ease-in-out infinite;
}
.cart-empty-state__quick-links span {
  min-width: 0;
  display: grid;
  gap: 4px;
}
.cart-empty-state__quick-links strong {
  color: #00401b;
  font-size: 0.96rem;
  line-height: 1.2;
}
.cart-empty-state__quick-links small {
  color: #626b66;
  font-size: 0.84rem;
  line-height: 1.35;
}
@media (max-width: 760px) {
  .cart-empty-state {
    width: min(100%, 390px);
    margin: 0 auto 34px;
    gap: 16px;
  }
  .cart-empty-state__card {
    min-height: auto;
    padding: 44px 20px 22px;
    border-radius: 0;
    border: 0;
    background:
      radial-gradient(circle at 50% 20%, rgba(156, 243, 168, 0.18), transparent 36%),
      #f5f6f7;
    box-shadow: none;
    gap: 18px;
  }
  .cart-empty-state__mark {
    width: 118px;
    height: 118px;
    border-radius: 22px;
  }
  .cart-empty-state__bag {
    width: 92px;
    height: 92px;
  }
  .cart-empty-state__mark span {
    width: 46px;
    height: 46px;
    right: -8px;
    bottom: -8px;
    border-width: 5px;
    border-radius: 15px;
  }
  .cart-empty-state__mark span svg {
    width: 22px;
    height: 22px;
  }
  .cart-empty-state__eyebrow {
    font-size: 0.7rem;
    letter-spacing: 0.13em;
  }
  .cart-empty-state__copy h2 {
    font-size: 2rem;
    line-height: 1.08;
  }
  .cart-empty-state__copy p:last-child {
    max-width: 330px;
    font-size: 0.98rem;
    line-height: 1.55;
  }
  .cart-empty-state__actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 4px;
  }
  .cart-empty-state__primary,
  .cart-empty-state__secondary {
    width: 100%;
    min-height: 56px;
    border-radius: 8px;
    font-size: 0.96rem;
  }
  .cart-empty-state__quick-links {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .cart-empty-state__quick-links a {
    min-height: 76px;
    padding: 14px 16px;
    border-radius: 8px;
    grid-template-columns: 38px minmax(0, 1fr);
  }
  .cart-empty-state__quick-links svg {
    width: 38px;
    height: 38px;
    padding: 8px;
    border-radius: 11px;
  }
  .cart-empty-state__quick-links strong {
    font-size: 0.94rem;
  }
  .cart-empty-state__quick-links small {
    font-size: 0.8rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .cart-empty-state__primary,
  .cart-empty-state__secondary,
  .cart-empty-state__quick-links a,
  .cart-empty-state__mark,
  .cart-empty-state__mark span,
  .cart-empty-state__quick-links svg {
    transition: none;
    animation: none;
  }
  .cart-empty-state__primary:hover,
  .cart-empty-state__primary:focus-visible,
  .cart-empty-state__primary:active,
  .cart-empty-state__secondary:hover,
  .cart-empty-state__secondary:focus-visible,
  .cart-empty-state__secondary:active,
  .cart-empty-state__quick-links a:hover,
  .cart-empty-state__quick-links a:focus-visible {
    transform: none;
  }
}
.empty-state {
  min-height: 420px;
  display: grid;
  gap: 12px;
  align-content: center;
  justify-items: center;
  text-align: center;
}
.empty-state__icon {
  width: 140px;
  height: 140px;
}
.empty-state__icon svg {
  width: 100%;
  height: 100%;
}
.empty-state h2 {
  margin: 0;
  font-size: clamp(1.75rem, 2.5vw, 2.3rem);
}
.empty-state .hero-copy {
  margin: 0;
  max-width: 620px;
  color: var(--muted);
}
.empty-state .primary-link,
.empty-state .primary-button {
  background:
    radial-gradient(circle at 76% 18%, rgba(255, 255, 255, 0.14), transparent 34%),
    linear-gradient(135deg, #0b4dac 0%, #0a4fcf 45%, #0a4aa8 100%) !important;
  color: #ffffff !important;
  box-shadow: 0 14px 32px rgba(10, 79, 207, 0.22);
  transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
}
.empty-state .primary-link:hover,
.empty-state .primary-link:focus-visible,
.empty-state .primary-button:hover,
.empty-state .primary-button:focus-visible {
  background:
    radial-gradient(circle at 76% 18%, rgba(255, 255, 255, 0.14), transparent 34%),
    linear-gradient(135deg, #0b4dac 0%, #0a4fcf 45%, #0a4aa8 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 18px 38px rgba(10, 79, 207, 0.28);
  filter: saturate(1.04);
}
.empty-state .primary-link:active,
.empty-state .primary-button:active {
  transform: translateY(0);
  box-shadow: 0 10px 24px rgba(10, 79, 207, 0.2);
}
.wishlist-empty .primary-link,
.cart-empty .primary-link {
  background:
    radial-gradient(circle at 76% 18%, rgba(255, 255, 255, 0.14), transparent 34%),
    linear-gradient(135deg, #0b4dac 0%, #0a4fcf 45%, #0a4aa8 100%) !important;
  color: #ffffff !important;
  box-shadow: 0 14px 32px rgba(10, 79, 207, 0.22);
  transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
}
.wishlist-empty .primary-link:hover,
.wishlist-empty .primary-link:focus-visible,
.cart-empty .primary-link:hover,
.cart-empty .primary-link:focus-visible {
  background:
    radial-gradient(circle at 76% 18%, rgba(255, 255, 255, 0.14), transparent 34%),
    linear-gradient(135deg, #0b4dac 0%, #0a4fcf 45%, #0a4aa8 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 18px 38px rgba(10, 79, 207, 0.28);
  filter: saturate(1.04);
}
.wishlist-empty .primary-link:active,
.cart-empty .primary-link:active {
  transform: translateY(0);
  box-shadow: 0 10px 24px rgba(10, 79, 207, 0.2);
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
.checkout-mobile-action-bar {
  display: none;
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
  transition: transform 0.18s ease, box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease;
}
.checkout-payment__option:hover,
.checkout-payment__option:focus-visible {
  transform: translateY(-2px);
  border-color: rgba(24, 77, 34, 0.24);
  box-shadow: 0 14px 28px rgba(17, 24, 39, 0.08);
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
.checkout-payment__flow-options {
  border: 1px solid #ece5d9;
  padding: 20px;
  background: #fff;
  display: grid;
  gap: 12px;
}
.checkout-payment__flow-options h3 {
  margin: 0;
  color: #1f1d1b;
}
.checkout-payment__flow-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.checkout-payment__flow {
  border: 1px solid #d9e5f5;
  background: #fff;
  min-height: 90px;
  padding: 12px 14px;
  text-align: left;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease;
}
.checkout-payment__flow:hover,
.checkout-payment__flow:focus-visible {
  transform: translateY(-2px);
  border-color: rgba(13, 86, 218, 0.26);
  box-shadow: 0 14px 28px rgba(13, 86, 218, 0.09);
}
.checkout-payment__flow .checkout-payment__radio {
  margin-top: 2px;
}
.checkout-payment__flow.is-active .checkout-payment__radio {
  border-color: #0d56da;
}
.checkout-payment__flow.is-active .checkout-payment__radio::after {
  content: "";
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: #0d56da;
}
.checkout-payment__flow-copy {
  display: grid;
  gap: 4px;
}
.checkout-payment__flow strong {
  color: #1f1d1b;
}
.checkout-payment__flow small {
  color: var(--muted);
  line-height: 1.4;
}
.checkout-payment__flow.is-active {
  border-color: #0d56da;
  background: #f3f8ff;
}
.checkout-payment__instruction-card,
.checkout-payment__upload-card {
  border: 1px solid #ece5d9;
  padding: 22px;
  display: grid;
  gap: 16px;
  background: #fff;
  min-width: 0;
}
.checkout-payment__auto-card {
  border: 1px solid #cfe1fb;
  padding: 22px;
  display: grid;
  gap: 14px;
  background: linear-gradient(180deg, #f7fbff 0%, #f1f7ff 100%);
}
.checkout-payment__auto-head {
  display: flex;
  align-items: center;
  gap: 16px;
}
.checkout-payment__auto-head h3 {
  margin: 0 0 4px;
  color: #12345b;
}
.checkout-payment__auto-head p {
  margin: 0;
  color: #385270;
}
.checkout-payment__auto-steps {
  display: grid;
  gap: 10px;
}
.checkout-payment__auto-steps div {
  border: 1px solid #d8e8ff;
  background: #fff;
  color: #173251;
  padding: 10px 12px;
  font-size: 0.92rem;
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
.checkout-payment__auto-note {
  border: 1px dashed #d9e5f5;
  background: #f7fbff;
  color: #2b3b53;
  font-size: 0.92rem;
  padding: 12px 14px;
}
.checkout-payment__auto-note--strong {
  border-style: solid;
  border-color: #bfdaff;
  background: #eaf3ff;
  font-weight: 600;
  color: #183a61;
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
  min-width: 0;
  max-width: 100%;
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
  min-width: 0;
}
.checkout-payment__proof-meta strong,
.checkout-payment__proof-meta small {
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
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
  transition: transform 0.18s ease, box-shadow 0.22s ease, background 0.22s ease, border-color 0.22s ease, color 0.22s ease;
}
.checkout-payment__upload-button {
  border: 0;
  background: #184d22;
  color: #ffffff;
  box-shadow: 0 12px 26px rgba(24, 77, 34, 0.16);
}
.checkout-payment__secondary {
  border: 1px solid #e0d6c8;
  background: #ffffff;
  color: #1f1d1b;
}
.checkout-payment__upload-button:hover,
.checkout-payment__upload-button:focus-visible {
  transform: translateY(-2px);
  background: #123f1f;
  box-shadow: 0 16px 32px rgba(24, 77, 34, 0.22);
}
.checkout-payment__secondary:hover,
.checkout-payment__secondary:focus-visible {
  transform: translateY(-2px);
  border-color: rgba(24, 77, 34, 0.24);
  box-shadow: 0 14px 28px rgba(17, 24, 39, 0.08);
}
.checkout-payment__upload-button:active,
.checkout-payment__secondary:active {
  transform: translateY(0);
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.12);
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
.checkout-summary__pending-action {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border: 1px dashed #d8d0c3;
  background: #faf7f1;
}
.checkout-summary__pending-action strong {
  color: #1f1d1b;
}
.checkout-summary__pending-action span {
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.5;
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
  box-shadow: 0 12px 26px rgba(24, 77, 34, 0.16);
  transition: transform 0.18s ease, box-shadow 0.22s ease, background 0.22s ease;
}
.checkout-summary__button:hover,
.checkout-summary__button:focus-visible {
  transform: translateY(-2px);
  background: #123f1f;
  box-shadow: 0 16px 32px rgba(24, 77, 34, 0.22);
}
.checkout-summary__button:active {
  transform: translateY(0);
  box-shadow: 0 8px 18px rgba(24, 77, 34, 0.16);
}
.checkout-summary__button:disabled {
  opacity: 0.6;
  cursor: wait;
  transform: none;
  box-shadow: none;
}
.checkout-hubtel-modal {
  position: fixed;
  inset: 0;
  z-index: 1250;
  display: grid;
  place-items: center;
  padding: 16px;
}
.checkout-hubtel-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(12, 19, 31, 0.52);
  backdrop-filter: blur(4px);
}
.checkout-hubtel-modal__card {
  position: relative;
  z-index: 1;
  width: min(100%, 560px);
  border: 1px solid #dce6f5;
  background: #ffffff;
  box-shadow: 0 26px 60px rgba(10, 27, 53, 0.2);
  padding: 24px;
  display: grid;
  gap: 14px;
}
.checkout-hubtel-modal__close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border: 1px solid #d7e1f1;
  background: #ffffff;
  color: #21334b;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
}
.checkout-hubtel-modal__card h2 {
  margin: 0;
  color: #113458;
}
.checkout-hubtel-modal__card p {
  margin: 0;
  color: #40536c;
  line-height: 1.55;
}
.checkout-hubtel-modal__actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
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
.checkout-summary__price-note s {
  color: #8f8a80;
}
.checkout-summary__price-stack {
  display: grid;
  justify-items: end;
  gap: 4px;
}
.checkout-summary__price-stack small {
  color: #8f8a80;
  text-decoration: line-through;
}
.narrow-shell { width: min(680px, calc(100vw - 32px)); }
.auth-form { display: grid; gap: 14px; margin-top: 18px; }
.auth-page {
  position: relative;
  overflow: hidden;
}
.auth-page::before,
.auth-page::after {
  content: "";
  position: absolute;
  pointer-events: none;
  border-radius: 999px;
}
.auth-page::before {
  width: 320px;
  height: 320px;
  left: -120px;
  top: 10px;
  background: radial-gradient(circle, rgba(24, 79, 39, 0.12), transparent 68%);
}
.auth-page::after {
  width: 260px;
  height: 260px;
  right: -80px;
  bottom: -60px;
  background: radial-gradient(circle, rgba(217, 164, 65, 0.16), transparent 70%);
}
.auth-shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.82fr);
  gap: 22px;
  align-items: stretch;
  width: min(1120px, 100%);
  margin: 0 auto;
}
.auth-shell--reverse {
  grid-template-columns: minmax(320px, 0.82fr) minmax(0, 1fr);
}
.auth-panel {
  border: 1px solid #e9e2d6;
  border-radius: 28px;
  box-shadow: 0 20px 36px rgba(24, 79, 39, 0.09);
}
.auth-panel--form {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.94)),
    radial-gradient(circle at 92% 10%, rgba(24, 79, 39, 0.08), transparent 32%);
  padding: clamp(24px, 4vw, 44px);
  display: grid;
  align-content: center;
}
.auth-panel--form h1,
.auth-panel--story h2 {
  margin: 0;
  line-height: 1.04;
}
.auth-panel--form h1 {
  max-width: 16ch;
  font-size: clamp(1.9rem, 3.8vw, 3.25rem);
}
.auth-lead {
  margin: 14px 0 0;
  max-width: 44rem;
  color: var(--muted);
  font-size: 0.98rem;
  line-height: 1.65;
}
.auth-panel .field-group span {
  font-weight: 800;
  color: #2b251d;
}
.auth-panel .field {
  min-height: 54px;
  border-radius: 18px;
  background: #fff;
  border-color: #e9e2d6;
}
.auth-panel .field:focus {
  border-color: rgba(24, 79, 39, 0.42);
  box-shadow: 0 0 0 4px rgba(24, 79, 39, 0.1);
}
.auth-submit {
  min-height: 54px;
  width: fit-content;
  min-width: 220px;
  margin-top: 4px;
  background: #184f27;
  color: #fff;
  box-shadow: 0 16px 34px rgba(24, 79, 39, 0.18);
  transition:
    transform 0.18s ease,
    box-shadow 0.22s ease,
    background 0.22s ease,
    border-color 0.22s ease;
}
.auth-submit:not(:disabled):hover,
.auth-submit:not(:disabled):focus-visible {
  transform: translateY(-2px);
  background: #145021;
  border-color: #145021;
  box-shadow: 0 20px 42px rgba(24, 79, 39, 0.25);
}
.auth-submit:not(:disabled):active {
  transform: translateY(0);
  box-shadow: 0 12px 26px rgba(24, 79, 39, 0.18);
}
.auth-submit:disabled {
  opacity: 0.72;
  cursor: wait;
  transform: none;
  box-shadow: 0 12px 24px rgba(24, 79, 39, 0.12);
}
.auth-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  align-items: center;
  margin-top: 18px;
  color: var(--muted);
}
.auth-links a {
  color: #184f27;
  font-weight: 800;
  text-decoration-color: rgba(24, 79, 39, 0.35);
  text-underline-offset: 4px;
  transition:
    color 0.18s ease,
    text-decoration-color 0.18s ease,
    transform 0.18s ease;
}
.auth-links a:hover,
.auth-links a:focus-visible {
  color: #0d56da;
  text-decoration-color: rgba(13, 86, 218, 0.45);
  transform: translateY(-1px);
}
.auth-message,
.form-error {
  margin: 0;
  border: 1px solid #e9e2d6;
  border-radius: 18px;
  padding: 12px 14px;
  background: rgba(248, 242, 230, 0.72);
}
.form-error {
  color: var(--danger);
  border-color: rgba(197, 48, 48, 0.26);
  background: rgba(197, 48, 48, 0.06);
}
.auth-panel--story {
  position: relative;
  overflow: hidden;
  padding: clamp(24px, 4vw, 42px);
  background:
    radial-gradient(circle at 86% 18%, rgba(230, 186, 96, 0.26), transparent 24%),
    linear-gradient(145deg, #184f27 0%, #12391e 72%, #0b2415 100%);
  color: white;
  display: grid;
  gap: 24px;
  align-content: center;
}
.auth-panel--story::before {
  content: "";
  position: absolute;
  inset: auto -80px -110px auto;
  width: 240px;
  height: 240px;
  border-radius: 999px;
  border: 34px solid rgba(255,255,255,0.06);
}
.auth-badge {
  width: fit-content;
  border: 1px solid rgba(230, 186, 96, 0.35);
  border-radius: 999px;
  padding: 8px 13px;
  background: rgba(230, 186, 96, 0.12);
  color: #e6ba60;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.72rem;
  font-weight: 900;
}
.auth-panel--story h2 {
  max-width: 16ch;
  font-size: clamp(1.75rem, 3.2vw, 2.8rem);
}
.auth-benefits {
  display: grid;
  gap: 12px;
}
.auth-benefits p {
  position: relative;
  margin: 0;
  display: grid;
  gap: 4px;
  padding: 16px 16px 16px 46px;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 22px;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
}
.auth-benefits p::before {
  content: "";
  position: absolute;
  left: 16px;
  top: 18px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #e6ba60;
  box-shadow: 0 0 0 5px rgba(230, 186, 96, 0.14);
}
.auth-benefits strong {
  color: white;
}
.auth-benefits span {
  color: rgba(255,255,255,0.74);
  line-height: 1.55;
}

.auth-hp-page {
  min-height: calc(100vh - 80px);
  display: grid;
  place-items: center;
  padding: 18px 12px 28px;
  background: #dedede;
}
.auth-hp-card {
  width: min(560px, calc(100vw - 24px));
  background: #f4f5f7;
  border: 2px solid #0d56da;
  border-radius: 18px;
  padding: 16px;
  display: grid;
  gap: 12px;
}
.auth-hp-frame {
  border: 1px solid #d8dde7;
  border-radius: 4px;
  padding: 14px 14px 16px;
  display: grid;
  gap: 12px;
}
.auth-hp-head {
  display: flex;
  justify-content: center;
}
.auth-hp-logo-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.auth-hp-logo {
  width: auto;
  height: 64px;
  object-fit: contain;
  object-position: center;
  aspect-ratio: auto !important;
}
.auth-hp-head a {
  color: #0d56da;
  font-weight: 500;
  font-size: 0.92rem;
  white-space: nowrap;
}
.auth-hp-card h1 {
  margin: 0;
  color: #131722;
  font-size: clamp(2.05rem, 5vw, 3.1rem);
  font-weight: 500;
  line-height: 1.04;
}
.auth-hp-copy {
  margin: -2px 0 4px;
  color: #2c3446;
  font-size: 1rem;
}
.auth-hp-form {
  display: grid;
  gap: 12px;
}
.auth-hp-form .field-group span {
  color: #1b2432;
  font-weight: 600;
}
.auth-hp-form .field {
  min-height: 54px;
  border-radius: 16px;
  border: 1px solid #aab2bf;
  background: #fff;
  padding-inline: 14px;
  font-size: 1rem;
}
.auth-hp-form .password-field {
  position: relative;
}
.auth-hp-form .password-field .field {
  padding-right: 82px;
}
.auth-hp-form .password-field__toggle {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #0d56da;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 0;
  transition:
    color 0.18s ease,
    transform 0.18s ease;
}
.auth-hp-form .password-field__toggle:hover,
.auth-hp-form .password-field__toggle:focus-visible {
  color: #004aad;
  transform: translateY(calc(-50% - 1px));
}
.auth-hp-form .password-field__toggle:focus-visible {
  outline: 2px solid #0d56da;
  outline-offset: 3px;
  border-radius: 6px;
}
.auth-hp-form .field:focus {
  border-color: #0d56da;
  box-shadow: 0 0 0 3px rgba(13, 86, 218, 0.14);
}
.auth-hp-grid-two {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.auth-hp-btn {
  min-height: 54px;
  border-radius: 14px;
  border: 1px solid transparent;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.22s ease,
    background 0.22s ease,
    border-color 0.22s ease,
    color 0.22s ease;
}
.auth-hp-btn--primary {
  background: #0d56da;
  border-color: #0d56da;
  color: #fff;
  box-shadow: 0 14px 30px rgba(13, 86, 218, 0.2);
}
.auth-hp-btn:not(:disabled):hover,
.auth-hp-btn:not(:disabled):focus-visible {
  transform: translateY(-2px);
}
.auth-hp-btn--primary:not(:disabled):hover,
.auth-hp-btn--primary:not(:disabled):focus-visible {
  background: #004aad;
  border-color: #004aad;
  color: #fff;
  box-shadow: 0 18px 38px rgba(13, 86, 218, 0.28);
}
.auth-hp-btn:not(:disabled):active {
  transform: translateY(0);
  box-shadow: 0 10px 22px rgba(13, 86, 218, 0.18);
}
.auth-hp-btn:disabled {
  opacity: 0.72;
  cursor: wait;
  transform: none;
  box-shadow: none;
}
.auth-google {
  display: grid;
  gap: 10px;
}
.auth-google__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #677286;
  font-size: 0.88rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.auth-google__divider::before,
.auth-google__divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #d5dce8;
}
.auth-google__divider span {
  flex: 0 0 auto;
}
.auth-google__button {
  min-height: 44px;
  display: grid;
  justify-content: center;
  border-radius: 14px;
  transition:
    transform 0.18s ease,
    filter 0.22s ease;
}
.auth-google__button:not(.is-disabled):hover,
.auth-google__button:not(.is-disabled):focus-within {
  transform: translateY(-1px);
  filter: drop-shadow(0 12px 22px rgba(13, 86, 218, 0.14));
}
.auth-google__button.is-disabled {
  pointer-events: none;
  opacity: 0.72;
  transform: none;
  filter: none;
}
.auth-google__button > div {
  width: 100% !important;
  max-width: 100%;
}
.auth-google__button iframe {
  max-width: 100%;
}
.auth-google__error {
  margin: 0;
  text-align: center;
}
.auth-hp-link-row {
  justify-self: center;
  color: #0d56da;
  text-decoration: none;
  text-underline-offset: 2px;
  font-weight: 500;
  transition:
    color 0.18s ease,
    transform 0.18s ease,
    text-decoration-color 0.18s ease;
}
.auth-hp-link-row:hover,
.auth-hp-link-row:focus-visible {
  color: #004aad;
  text-decoration: underline;
  text-decoration-color: rgba(0, 74, 173, 0.5);
  transform: translateY(-1px);
}
.auth-hp-foot {
  display: grid;
  gap: 10px;
}
.auth-hp-check {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #2e3545;
  font-size: 0.94rem;
}
.auth-hp-check input {
  width: 18px;
  height: 18px;
}
.auth-hp-privacy {
  margin: 0 6px 0 auto;
  color: #8a8f9b;
  font-size: 0.86rem;
  text-decoration: none;
  transition:
    color 0.18s ease,
    text-decoration-color 0.18s ease,
    transform 0.18s ease;
}
.auth-hp-privacy:hover,
.auth-hp-privacy:focus-visible {
  color: #0d56da;
  text-decoration: underline;
  text-underline-offset: 2px;
  transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
  .auth-submit,
  .auth-links a,
  .auth-hp-form .password-field__toggle,
  .auth-hp-btn,
  .auth-google__button,
  .auth-hp-link-row,
  .auth-hp-privacy {
    transition: none;
  }
  .auth-submit:not(:disabled):hover,
  .auth-submit:not(:disabled):focus-visible,
  .auth-submit:not(:disabled):active,
  .auth-links a:hover,
  .auth-links a:focus-visible,
  .auth-hp-form .password-field__toggle:hover,
  .auth-hp-form .password-field__toggle:focus-visible,
  .auth-hp-btn:not(:disabled):hover,
  .auth-hp-btn:not(:disabled):focus-visible,
  .auth-hp-btn:not(:disabled):active,
  .auth-google__button:not(.is-disabled):hover,
  .auth-google__button:not(.is-disabled):focus-within,
  .auth-hp-link-row:hover,
  .auth-hp-link-row:focus-visible,
  .auth-hp-privacy:hover,
  .auth-hp-privacy:focus-visible {
    transform: none;
  }
}

.site-footer {
  border-top: 1px solid rgba(255,255,255,0.16);
  background: #252a33;
  color: #fff;
  margin-top: 42px;
}
.footer-feature-band {
  background: #252a33;
  border-bottom: 1px solid rgba(255,255,255,0.16);
}
.footer-payment-band {
  background: #252a33;
  border-bottom: 1px solid rgba(255,255,255,0.16);
}
.footer-payment-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, auto));
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: max-content;
  max-width: none;
  padding: 16px 18px;
  background: #ffffff;
  border: 1px solid rgba(18, 24, 35, 0.14);
  border-radius: 0;
  margin: 18px auto 0;
  white-space: nowrap;
}
.footer-payment-strip__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 78px;
  min-width: 78px;
  height: 34px;
}
.footer-payment-strip__item img {
  width: 100%;
  max-width: 78px;
  height: 34px;
  object-fit: contain;
}
.footer-feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  padding: 18px 0;
}
.footer-feature-item {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 12px;
  min-width: 0;
}
.footer-feature-item__icon {
  width: 30px;
  height: 30px;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  opacity: 0.96;
}
.footer-feature-item__icon svg {
  width: 21px;
  height: 21px;
}
.footer-feature-item__copy {
  display: grid;
  gap: 3px;
  min-width: 0;
}
.footer-feature-item__copy strong {
  color: #fff;
  font-size: 1.12rem;
  line-height: 1.15;
}
.footer-feature-item__copy span {
  color: rgba(255,255,255,0.92);
  font-size: 0.98rem;
  line-height: 1.25;
}
.footer-grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  padding: 36px 0 28px;
  border-bottom: 1px solid rgba(255,255,255,0.16);
  column-gap: 18px;
}
.footer-grid--mobile {
  display: none;
}
.footer-grid ul { padding: 0; margin: 0; list-style: none; display: grid; gap: 10px; color: var(--muted); }
.site-footer h3,
.site-footer p,
.site-footer a {
  color: #fff;
}
.footer-section {
  margin: 0;
  min-width: 0;
}
.footer-section:not(:last-child) {
  border-right: 1px solid rgba(255,255,255,0.14);
  padding-right: 14px;
}
.footer-section summary {
  list-style: none;
  cursor: default;
  font-size: 1.04rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  margin-bottom: 12px;
  user-select: none;
}
.footer-section summary::-webkit-details-marker {
  display: none;
}
.footer-section h3 {
  margin: 0 0 12px;
  font-size: 1.04rem;
  font-weight: 800;
  letter-spacing: 0.01em;
}
.footer-links {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.footer-links a {
  color: rgba(255,255,255,0.9);
  text-decoration: none;
}
.site-footer p {
  color: rgba(255,255,255,0.72);
}
.site-footer ul {
  color: rgba(255,255,255,0.84);
}
.site-footer a:hover {
  color: #f4d28f;
}
.footer-meta {
  padding: 24px 0 34px;
  display: grid;
  gap: 14px;
  justify-items: center;
  text-align: center;
}
.footer-socials {
  display: flex;
  gap: 14px;
}
.footer-socials a {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.35);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  color: #fff;
  text-decoration: none;
  transition: transform .18s ease, border-color .18s ease, background-color .18s ease;
}
.footer-socials a svg {
  width: 19px;
  height: 19px;
}
.footer-socials a:hover {
  transform: translateY(-1px);
  border-color: #4aa0ff;
  background: rgba(74, 160, 255, 0.16);
  color: #fff;
}
.footer-legal-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px;
  justify-content: center;
}
.footer-legal-links a {
  color: rgba(255,255,255,0.9);
  text-decoration: none;
  font-weight: 700;
}
.footer-address,
.footer-copyright,
.footer-disclaimer {
  max-width: 1040px;
  margin: 0;
  color: rgba(255,255,255,0.76);
}
.footer-disclaimer {
  color: rgba(255,255,255,0.62);
  font-size: 0.92rem;
  line-height: 1.6;
}
.toast-stack { position: fixed; top: calc(env(safe-area-inset-top) + 92px); left: 16px; z-index: 140; display: grid; gap: 10px; }
.toast { min-width: 220px; max-width: 360px; padding: 12px 14px; border-radius: 16px; color: white; box-shadow: var(--shadow); }
.toast--success { background: #0a9b8a; }
.toast--info { background: #0f62fe; }
.toast--warning { background: #b7791f; }
.toast--error { background: var(--danger); }
.danger-button {
  border: 1px solid rgba(183, 28, 28, 0.22);
  border-radius: 999px;
  padding: 12px 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  background: rgba(183, 28, 28, 0.08);
  color: #b71c1c;
  font-weight: 900;
}
.danger-button:disabled,
.primary-button:disabled,
.ghost-button:disabled {
  opacity: 0.58;
  cursor: not-allowed;
}
@keyframes accountTransientSpin {
  to {
    transform: rotate(360deg);
  }
}
/* Account dashboard - shared/base styles */
.account-dashboard__actions {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}
.contact-support-preview {
  display: grid;
  gap: 18px;
  padding: 28px;
  border: 1px solid #c1c9bd;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-support-preview h3 {
  margin: 0;
  color: #111c2c;
  font-size: 1.15rem;
  line-height: 1.35;
}
.contact-support-preview p {
  margin: 0;
  color: #414940;
  line-height: 1.6;
}
.contact-support-preview .primary-link {
  display: inline-flex;
  min-height: 56px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: #2bd567;
  box-shadow: 0 10px 22px rgba(43, 213, 103, 0.22);
}
.contact-support-preview__latest {
  border: 0;
  border-radius: 14px;
  padding: 12px 14px;
  background: #f7f8fa;
  display: grid;
  gap: 6px;
}
.contact-support-preview__latest strong {
  font-size: 1rem;
}
.contact-support-preview__latest p > span {
  text-transform: capitalize;
  font-weight: 700;
  color: #0d56da;
}
@media (min-width: 981px) {
  /* Desktop-only public affiliate dashboard refresh. */
}
@media (max-width: 700px) {
  .has-affiliate-mobile-dashboard {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 0;
    background: #f4f5f8;
  }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
@media (hover: none), (pointer: coarse), (max-width: 980px) {
  .site-header,
  .mobile-menu,
  .nav-dropdown__panel,
  .desktop-search-tray,
  .checkout-hubtel-modal__backdrop,
  .checkout-success-transition,
  .auth-benefits p,
  .content-fact-strip article {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
  img,
  svg,
  .stable-image,
  .brand-mark__image {
    transform: none !important;
    -webkit-transform: none !important;
    backface-visibility: visible !important;
    -webkit-backface-visibility: visible !important;
  }
  .checkout-success-transition,
  .checkout-success-transition__halo,
  .checkout-success-transition__spinner,
  .checkout-success-transition__burst-dot,
  .checkout-success-transition__spark,
  .order-complete--arriving,
  .order-complete--arriving .order-complete__intro,
  .order-complete--arriving .order-complete__check,
  .order-complete--arriving .order-complete__meta,
  .order-complete--arriving .order-complete__details,
  .order-complete--arriving .hero-actions {
    animation: none !important;
  }
  .mobile-menu,
  .nav-dropdown__panel,
  .desktop-search-tray,
  .desktop-search-tray__form .search-input,
  .primary-link,
  .ghost-link,
  .icon-button {
    transition-duration: 120ms !important;
  }
}
/* Account mobile home - dedicated mobile screen only */
/* Account dashboard - desktop only */

.resource-grid { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.resource-card { padding: 18px; border-radius: 20px; border: 1px solid var(--line); background: #fff; }
.resource-card h3 { margin-top: 0; }
.data-list { display: grid; gap: 12px; }
.data-item { padding: 16px; border: 1px solid var(--line); border-radius: 18px; background: white; }
.content-page {
  --policy-accent: #184f27;
  --policy-accent-soft: rgba(24, 79, 39, 0.1);
  --policy-glow: rgba(24, 79, 39, 0.16);
  display: grid;
  gap: 22px;
}
.content-page--warranty { --policy-accent: #184f27; --policy-accent-soft: rgba(24, 79, 39, 0.1); --policy-glow: rgba(24, 79, 39, 0.18); }
.content-page--payment { --policy-accent: #195f32; --policy-accent-soft: rgba(25, 95, 50, 0.12); --policy-glow: rgba(25, 95, 50, 0.2); }
.content-page--delivery { --policy-accent: #0f6b54; --policy-accent-soft: rgba(15, 107, 84, 0.12); --policy-glow: rgba(15, 107, 84, 0.2); }
.content-page--returns { --policy-accent: #1d5b2d; --policy-accent-soft: rgba(29, 91, 45, 0.12); --policy-glow: rgba(29, 91, 45, 0.2); }
.content-page--privacy { --policy-accent: #146345; --policy-accent-soft: rgba(20, 99, 69, 0.12); --policy-glow: rgba(20, 99, 69, 0.18); }
.content-page--terms { --policy-accent: #234f35; --policy-accent-soft: rgba(35, 79, 53, 0.12); --policy-glow: rgba(35, 79, 53, 0.18); }
.content-hero, .content-section, .content-cta { display: grid; gap: 18px; }
.content-hero {
  position: relative;
  overflow: hidden;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  padding: clamp(24px, 5vw, 48px);
  border-color: rgba(24, 79, 39, 0.14);
  background:
    radial-gradient(circle at 88% 12%, var(--policy-glow), transparent 28%),
    linear-gradient(135deg, #fff 0%, #fffaf1 54%, var(--policy-accent-soft) 100%);
}
.content-hero::after {
  content: "";
  position: absolute;
  right: clamp(18px, 5vw, 72px);
  bottom: -42px;
  width: 150px;
  height: 150px;
  border: 1px solid color-mix(in srgb, var(--policy-accent) 22%, transparent);
  border-radius: 48px;
  transform: rotate(18deg);
  opacity: 0.45;
}
.content-hero__copy {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 12px;
}
.content-hero__badge {
  position: relative;
  z-index: 1;
  width: clamp(92px, 13vw, 150px);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: 34px;
  background: var(--policy-accent);
  color: #fff;
  box-shadow: 0 24px 60px var(--policy-glow);
  transform: rotate(-5deg);
}
.content-hero__badge span {
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transform: rotate(5deg);
}
.content-meta { color: var(--muted); margin: 0; }
.content-highlight-grid, .content-grid, .faq-actions-grid, .thankyou-meta-grid {
  display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
.content-highlight, .content-block {
  border: 1px solid var(--line); border-radius: 22px; padding: 18px; background: rgba(255,255,255,0.8);
}
.content-highlight {
  position: relative;
  overflow: hidden;
  border-color: color-mix(in srgb, var(--policy-accent) 18%, var(--line));
  box-shadow: 0 16px 42px rgba(31, 29, 26, 0.06);
}
.content-highlight::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 4px;
  background: var(--policy-accent);
}
.content-highlight span { color: var(--muted); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.1em; }
.content-highlight h2, .content-section h2, .content-cta h2, .faq-action-card h2, .thankyou-items-panel h2 { margin: 0; font-size: 1.2rem; }
.content-fact-strip {
  position: relative;
  z-index: 1;
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  padding-top: 6px;
}
.content-fact-strip article {
  display: grid;
  gap: 4px;
  padding: 16px 18px;
  border: 1px solid color-mix(in srgb, var(--policy-accent) 20%, var(--line));
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.74);
  backdrop-filter: blur(10px);
}
.content-fact-strip strong {
  color: var(--policy-accent);
  font-size: clamp(1.35rem, 2.5vw, 2.1rem);
  line-height: 1;
}
.content-fact-strip span {
  color: #5f5547;
  font-size: 0.9rem;
  font-weight: 700;
}
.content-section {
  position: relative;
  overflow: hidden;
  padding: clamp(20px, 3vw, 32px);
  border-color: rgba(24, 79, 39, 0.1);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.86)),
    radial-gradient(circle at top right, var(--policy-accent-soft), transparent 34%);
}
.content-section > h2 {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.content-section > h2::before {
  content: "";
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: var(--policy-accent);
  box-shadow: 0 0 0 6px var(--policy-accent-soft);
}
.content-block h3, .content-block h4 { margin: 0; }
.content-block p, .content-block ul { margin: 0; color: var(--muted); }
.content-block {
  display: grid;
  gap: 12px;
  border-color: color-mix(in srgb, var(--policy-accent) 12%, var(--line));
}
.content-block h3 {
  color: #171513;
}
.content-block ul { padding-left: 18px; display: grid; gap: 8px; }
.content-note { color: var(--policy-accent); font-weight: 700; margin: 0; }
.content-points { display: grid; gap: 12px; }
.content-points > div {
  padding: 14px 16px; border-left: 4px solid var(--policy-accent); background: var(--policy-accent-soft); border-radius: 16px;
}
.content-cta {
  position: relative;
  overflow: hidden;
  padding: clamp(22px, 4vw, 36px);
  border: 1px solid color-mix(in srgb, var(--policy-accent) 20%, var(--line));
  background:
    linear-gradient(135deg, rgba(24, 79, 39, 0.95), color-mix(in srgb, var(--policy-accent) 86%, #171513));
  color: #fff;
}
.content-cta p,
.content-cta .content-meta {
  color: rgba(255, 255, 255, 0.82);
}
.content-cta .hero-actions {
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}
.content-cta .primary-link,
.content-cta .ghost-link {
  width: fit-content;
  min-width: 158px;
  max-width: 100%;
  min-height: 48px;
  padding: 0 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: normal;
}
.content-cta .primary-link {
  background: #fff;
  color: var(--policy-accent);
}
.content-cta .ghost-link {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.45);
  color: #fff;
}
.developer-profile {
  display: grid;
  gap: 24px;
}
.developer-profile-intro {
  display: grid;
  justify-items: center;
  gap: 18px;
  text-align: center;
  padding: 8px 0 2px;
}
.developer-profile-intro__photo {
  width: min(280px, 100%);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  overflow: hidden;
  border: 6px solid #f2f6fd;
  box-shadow: 0 18px 38px rgba(16, 52, 110, 0.12);
  background: #dfe9f8;
}
.developer-profile-intro__photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.developer-profile-intro__copy {
  display: grid;
  gap: 12px;
  max-width: 72ch;
}
.developer-profile-intro__copy h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  line-height: 1.08;
  color: #162132;
}
.developer-profile-intro__copy p {
  margin: 0;
}
.developer-contact-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
}
.developer-capability-section {
  display: grid;
  gap: 2px;
}
.developer-cta {
  margin-top: 6px;
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
  border-radius: 28px;
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
.faq-track-link {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0 26px;
  border-radius: 999px;
  background: #fff;
  color: #184f27;
  border: 1px solid rgba(255,255,255,0.6);
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 12px 24px rgba(11, 18, 13, 0.16);
}
.faq-track-link:hover {
  background: #f7f5ef;
}
.faq-support-card {
  display: grid;
  justify-items: center;
  gap: 16px;
  padding: 34px 26px;
  position: sticky;
  top: 120px;
  background: #184f27;
  color: #fff;
  text-align: center;
  box-shadow: 0 22px 44px rgba(24, 79, 39, 0.16);
  border-radius: 30px;
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
  border-radius: 999px;
}
.contact-shell {
  display: grid;
  gap: 32px;
}
.contact-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(300px, 0.88fr);
  gap: 28px;
  align-items: stretch;
}
.contact-form-panel {
  background: #fff;
  border: 1px solid #e9e2d6;
  border-radius: 30px;
  padding: 30px;
}
.contact-form {
  display: grid;
  gap: 20px;
}
.contact-form--corporate {
  gap: 18px;
}
.contact-form__intro {
  display: grid;
  gap: 8px;
}
.contact-form__intro h2 {
  margin: 0;
  font-size: clamp(1.5rem, 2.4vw, 2.05rem);
  line-height: 1.08;
}
.contact-form__intro p {
  margin: 0;
  color: rgba(31, 29, 27, 0.66);
  line-height: 1.7;
}
.contact-form__eyebrow,
.contact-map-section__eyebrow {
  margin: 0;
  color: #184f27;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
}
.contact-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 20px;
}
.contact-form__field {
  display: grid;
  gap: 10px;
}
.contact-form__field span {
  font-weight: 700;
  color: #1f1d1b;
}
.contact-form__textarea {
  min-height: 170px;
  resize: vertical;
}
.contact-form__status {
  margin: 0;
  font-weight: 600;
}
.contact-form__status.is-success {
  color: #184f27;
}
.contact-form__status.is-error {
  color: #b42318;
}
.contact-form__submit {
  justify-self: start;
  min-height: 54px;
  padding: 0 26px;
  border: 0;
  border-radius: 999px;
  background: #184f27;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 16px 32px rgba(24, 79, 39, 0.18);
}
.contact-form__submit:disabled {
  opacity: 0.72;
  cursor: progress;
}
.contact-visual {
  display: grid;
}
.contact-visual__frame {
  position: relative;
  min-height: 100%;
  display: grid;
  justify-items: center;
  align-content: start;
  gap: 22px;
  padding: 34px 28px;
  border-radius: 32px;
  background:
    radial-gradient(circle at top left, rgba(255,255,255,0.9), rgba(255,255,255,0.14) 42%),
    linear-gradient(160deg, #f5ede0 0%, #f1e4ce 35%, #d8b98b 100%);
  border: 1px solid #eadfce;
  overflow: hidden;
}
.contact-visual__logo {
  width: 146px;
  max-width: 100%;
  height: auto;
  display: block;
}
.contact-visual__content {
  display: grid;
  gap: 12px;
  max-width: 30rem;
  justify-items: start;
}
.contact-visual__eyebrow {
  margin: 0;
  color: #184f27;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
}
.contact-visual__content h2 {
  margin: 0;
  font-size: clamp(1.7rem, 3vw, 2.5rem);
  line-height: 1.08;
}
.contact-visual__content p {
  margin: 0;
  color: rgba(31, 29, 27, 0.76);
  line-height: 1.75;
}
.contact-visual__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.contact-visual__meta span {
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(24, 79, 39, 0.16);
  background: rgba(255,255,255,0.56);
  font-size: 0.93rem;
  font-weight: 600;
  color: #1f1d1b;
}
.contact-visual__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.contact-visual__link {
  min-height: 52px;
  padding: 0 24px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-weight: 700;
  background: #184f27;
  color: #fff;
  box-shadow: 0 14px 28px rgba(24, 79, 39, 0.18);
}
.contact-visual__link.is-light {
  background: rgba(255,255,255,0.84);
  color: #1f1d1b;
  box-shadow: none;
}
.contact-visual__spark {
  position: absolute;
  width: 68px;
  height: 68px;
  background: #184f27;
  clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);
  opacity: 0.92;
}
.contact-visual__spark--one {
  right: 32px;
  bottom: 42px;
}
.contact-visual__spark--two {
  width: 42px;
  height: 42px;
  right: 86px;
  bottom: 20px;
  background: #d0a145;
}
.contact-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.contact-cards--corporate {
  margin-top: 2px;
}
.contact-card {
  background: #fff;
  border: 1px solid #e9e2d6;
  border-radius: 24px;
  padding: 28px 22px;
  text-align: center;
  display: grid;
  justify-items: center;
  gap: 10px;
}
.contact-card__icon,
.contact-highlight__icon {
  width: 58px;
  height: 58px;
  border-radius: 999px;
  background: #184f27;
  color: #d9ae54;
  display: grid;
  place-items: center;
  box-shadow: 0 14px 28px rgba(24, 79, 39, 0.14);
}
.contact-card__icon svg,
.contact-highlight__icon svg {
  width: 24px;
  height: 24px;
  display: block;
}
.contact-card h3,
.contact-highlight h3 {
  margin: 0;
  font-size: 1.05rem;
}
.contact-card p,
.contact-highlight p {
  margin: 0;
  color: #1f1d1b;
}
.contact-card span {
  color: rgba(31, 29, 27, 0.62);
  line-height: 1.6;
}
.contact-map-section {
  display: grid;
  gap: 18px;
}
.contact-map-section__intro {
  display: grid;
  gap: 8px;
}
.contact-map-section__intro h2 {
  margin: 0;
  font-size: clamp(1.35rem, 2.2vw, 1.85rem);
  line-height: 1.1;
}
.contact-map-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.contact-map-selector__button {
  min-height: 50px;
  padding: 0 22px;
  border-radius: 999px;
  border: 1px solid #d9cfbe;
  background: #fff;
  color: #1f1d1b;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.contact-map-selector__button.is-active {
  background: #184f27;
  color: #fff;
  border-color: #184f27;
  box-shadow: 0 14px 28px rgba(24, 79, 39, 0.16);
}
.contact-map {
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid #e9e2d6;
  min-height: 360px;
}
.contact-map iframe {
  width: 100%;
  min-height: 360px;
  border: 0;
  display: block;
  filter: none;
}
.contact-page-simple {
  display: grid;
  gap: 28px;
}
.contact-page-simple__map {
  display: grid;
  gap: 12px;
}
.contact-map--simple {
  border-radius: 0;
  border: 1px solid #d9dfe8;
  min-height: 380px;
}
.contact-map--simple iframe {
  min-height: 380px;
}
.contact-page-simple__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  border: 1px solid #d9dfe8;
  background: #fff;
}
.contact-page-simple__left,
.contact-page-simple__right {
  padding: 34px 30px;
  display: grid;
  align-content: start;
  gap: 16px;
}
.contact-page-simple__right {
  border-left: 1px solid #d9dfe8;
}
.contact-page-simple__left h2,
.contact-page-simple__right h2 {
  margin: 0;
  font-size: clamp(1.9rem, 3.2vw, 2.8rem);
  line-height: 1.08;
  font-weight: 600;
}
.contact-page-simple__left > p,
.contact-page-simple__right > p {
  margin: 0;
  color: #666f7d;
  line-height: 1.4;
  font-size: clamp(1rem, 1.5vw, 1.12rem);
  max-width: 38rem;
}
.contact-info-simple {
  display: grid;
  gap: 12px;
  margin-top: 8px;
}
.contact-info-simple__item {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  align-items: start;
  gap: 10px;
}
.contact-info-simple__icon {
  width: 28px;
  height: 28px;
  color: #0d56da;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.contact-info-simple__icon svg {
  width: 20px;
  height: 20px;
}
.contact-info-simple__copy {
  display: grid;
  gap: 2px;
}
.contact-info-simple__copy strong {
  font-size: 1.05rem;
  font-weight: 500;
}
.contact-info-simple__copy span {
  color: #ef4444;
  font-size: 1rem;
}
.contact-form--simple {
  gap: 12px;
}
.contact-form--simple .field {
  border-radius: 8px;
  border-color: #c9d2df;
  min-height: 50px;
}
.contact-form--simple .contact-form__textarea {
  min-height: 180px;
}
.contact-form__submit--simple {
  border-radius: 8px;
  min-height: 52px;
  background: #e52f2f;
  box-shadow: none;
}
.contact-support-preview__cta {
  min-height: 40px;
  padding: 0 14px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #0d56da;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.contact-support-preview__cta:hover {
  background: #0b49ba;
}
.contact-highlights {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  align-items: start;
}
.contact-highlight {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  align-items: start;
}
.contact-highlight p {
  color: rgba(31, 29, 27, 0.66);
  line-height: 1.7;
}
.about-shell {
  display: grid;
  gap: 32px;
}
.about-story {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: start;
}
.about-category-preview {
  display: grid;
  gap: 18px;
}
.about-story__gallery {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: 148px;
  gap: 14px;
  min-height: 0;
  background: transparent;
}
.about-story__panel {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid #ece3d7;
  background: #ffffff;
  display: grid;
  place-items: center;
  padding: 8px;
}
.about-story__image {
  width: auto;
  height: auto;
  max-width: 88%;
  max-height: 88%;
  object-fit: contain;
  object-position: center;
  display: block;
  transform: translateY(-6px) scale(0.96);
  transition: transform 0.45s ease, filter 0.45s ease;
  filter: saturate(1.02) contrast(1.01);
}
.about-story__panel:hover .about-story__image {
  transform: translateY(-8px) scale(0.99);
}
.about-story__panel:nth-child(1) .about-story__image {
  transform: translateY(-14px) scale(0.92);
}
.about-story__panel:nth-child(2) .about-story__image {
  transform: translateY(-16px) scale(0.86);
}
.about-story__panel:nth-child(4) .about-story__image {
  transform: translateY(-18px) scale(0.76);
}
.about-story__panel:nth-child(6) .about-story__image {
  transform: translateY(-28px) scale(0.75);
}
.about-story__panel:nth-child(8) .about-story__image {
  transform: translateY(-22px) scale(0.67);
}
.about-story__panel:nth-child(1):hover .about-story__image {
  transform: translateY(-16px) scale(0.95);
}
.about-story__panel:nth-child(2):hover .about-story__image {
  transform: translateY(-18px) scale(0.89);
}
.about-story__panel:nth-child(4):hover .about-story__image {
  transform: translateY(-20px) scale(0.8);
}
.about-story__panel:nth-child(6):hover .about-story__image {
  transform: translateY(-30px) scale(0.79);
}
.about-story__panel:nth-child(8):hover .about-story__image {
  transform: translateY(-24px) scale(0.71);
}
.about-story__label {
  position: absolute;
  left: 16px;
  bottom: 16px;
  z-index: 1;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: rgba(255,255,255,0.9);
  color: #1f1d1b;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  box-shadow: 0 12px 24px rgba(31, 29, 27, 0.12);
  transition: opacity 180ms ease, transform 180ms ease;
}
.about-story__panel:hover .about-story__label,
.about-story__panel:active .about-story__label {
  opacity: 0;
  transform: translateY(6px);
}
.about-story__spark {
  position: absolute;
  background: #184f27;
  clip-path: polygon(50% 0, 63% 37%, 100% 50%, 63% 63%, 50% 100%, 37% 63%, 0 50%, 37% 37%);
}
.about-story__spark--one {
  width: 54px;
  height: 54px;
  left: -6px;
  bottom: 18px;
}
.about-story__spark--two {
  width: 26px;
  height: 26px;
  left: 44px;
  bottom: -2px;
  background: #d0a145;
}
.about-story__content {
  display: grid;
  gap: 16px;
}
.about-story__eyebrow {
  margin: 0;
  color: #184f27;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.8rem;
}
.about-story__content h2 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1.04;
}
.about-story__content p {
  margin: 0;
  color: rgba(31, 29, 27, 0.72);
  line-height: 1.8;
  max-width: 42rem;
}
.about-story__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  overflow: hidden;
  border-radius: 26px;
  background: #184f27;
  color: #fff;
  box-shadow: 0 20px 36px rgba(24, 79, 39, 0.14);
}
.about-story__stat {
  padding: 22px 18px;
  display: grid;
  gap: 6px;
  border-left: 1px solid rgba(255,255,255,0.12);
}
.about-story__stat:first-child {
  border-left: 0;
}
.about-story__stat strong {
  font-size: 2rem;
  color: #e6ba60;
  line-height: 1;
}
.about-story__stat span {
  color: rgba(255,255,255,0.82);
  font-size: 0.96rem;
}
.about-story__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.about-values {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.about-value-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: start;
  padding: 22px 24px;
  border-radius: 24px;
  border: 1px solid #e9e2d6;
  background: #fff;
}
.about-value-card__icon {
  width: 50px;
  height: 50px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #184f27;
  color: #e1b55a;
  box-shadow: 0 14px 28px rgba(24, 79, 39, 0.12);
}
.about-value-card__icon svg {
  width: 22px;
  height: 22px;
  display: block;
}
.about-value-card h3,
.about-showcase__stat strong,
.about-team__card h3 {
  margin: 0;
}
.about-value-card p {
  margin: 8px 0 0;
  color: rgba(31, 29, 27, 0.68);
  line-height: 1.75;
}
.about-showcase {
  display: grid;
  gap: 0;
  justify-items: center;
}
.about-showcase__media {
  width: min(100%, 760px);
  padding: 0 0 14px;
  display: grid;
  gap: 10px;
}
.about-showcase__screen {
  position: relative;
  width: fit-content;
  max-width: 100%;
  margin: 0 auto;
}
.about-showcase__slide {
  position: relative;
  padding: 0 44px;
  display: grid;
  place-items: center;
}
.about-showcase__poster {
  position: relative;
  z-index: 1;
  width: auto;
  max-width: min(100%, 560px);
  height: auto;
  display: block;
}
.about-showcase__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: min(100%, 760px);
  background: #184f27;
  color: #fff;
}
.about-showcase__stat {
  padding: 18px 16px;
  display: grid;
  gap: 4px;
  border-left: 1px solid rgba(255,255,255,0.12);
}
.about-showcase__stat:first-child {
  border-left: 0;
}
.about-showcase__stat strong {
  font-size: 1.7rem;
  color: #e3b75b;
}
.about-showcase__stat span {
  color: rgba(255,255,255,0.86);
  font-size: 0.92rem;
}
.about-section-heading {
  display: grid;
  gap: 10px;
}
.about-section-heading p {
  margin: 0;
  color: #184f27;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
}
.about-section-heading h2 {
  margin: 0;
  font-size: clamp(1.9rem, 4vw, 3rem);
  line-height: 1.08;
}
.about-section-heading span {
  color: rgba(31, 29, 27, 0.68);
  line-height: 1.75;
  max-width: 52rem;
}
.about-services,
.about-reasons,
.about-core-values {
  display: grid;
  gap: 24px;
}
.about-services__grid,
.about-reasons__grid,
.about-core-values__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.about-service-card,
.about-reason-card,
.about-core-card {
  display: grid;
  gap: 12px;
  border-radius: 24px;
  border: 1px solid #e9e2d6;
  background: #fff;
  padding: 22px 24px;
}
.about-service-card h3,
.about-reason-card h3,
.about-core-card h3 {
  margin: 0;
}
.about-service-card p,
.about-reason-card p,
.about-core-card p {
  margin: 0;
  color: rgba(31, 29, 27, 0.68);
  line-height: 1.75;
}
.about-reason-card {
  background: #184f27;
  color: #fff;
  border-color: rgba(24, 79, 39, 0.18);
}
.about-reason-card p {
  color: rgba(255,255,255,0.84);
}
.about-core-card {
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 14px 18px;
}
.about-core-card__number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  min-height: 64px;
  border-radius: 18px;
  background: #184f27;
  color: #e2b75c;
  font-weight: 800;
  font-size: 1.25rem;
}
.about-core-card h3,
.about-core-card p {
  grid-column: 2;
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
  box-shadow: 0 12px 26px rgba(17, 24, 39, 0.12);
  transition: transform 0.18s ease, box-shadow 0.22s ease, background 0.22s ease, color 0.22s ease;
}
.order-complete__invoice:hover,
.order-complete__invoice:focus-visible {
  transform: translateY(-2px);
  background: #f7fbf7;
  color: #184d22;
  box-shadow: 0 16px 32px rgba(17, 24, 39, 0.16);
}
.order-complete__invoice:active {
  transform: translateY(0);
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.12);
}
.order-complete .primary-link,
.order-complete .ghost-link {
  transition: transform 0.18s ease, box-shadow 0.22s ease, background 0.22s ease, border-color 0.22s ease, color 0.22s ease;
}
.order-complete .primary-link:hover,
.order-complete .primary-link:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px rgba(24, 77, 34, 0.22);
}
.order-complete .ghost-link:hover,
.order-complete .ghost-link:focus-visible {
  transform: translateY(-2px);
  border-color: rgba(24, 77, 34, 0.24);
  box-shadow: 0 14px 28px rgba(17, 24, 39, 0.08);
}
.order-complete .primary-link:active,
.order-complete .ghost-link:active {
  transform: translateY(0);
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.12);
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
.order-complete__price-stack {
  display: grid;
  justify-items: end;
  gap: 4px;
}
.order-complete__price-stack small {
  color: #8f8a80;
  text-decoration: line-through;
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
@media (prefers-reduced-motion: reduce) {
  .checkout-payment__option,
  .checkout-payment__flow,
  .checkout-payment__upload-button,
  .checkout-payment__secondary,
  .checkout-summary__button,
  .order-complete__invoice,
  .order-complete .primary-link,
  .order-complete .ghost-link {
    transition: none;
  }
  .checkout-payment__option:hover,
  .checkout-payment__option:focus-visible,
  .checkout-payment__flow:hover,
  .checkout-payment__flow:focus-visible,
  .checkout-payment__upload-button:hover,
  .checkout-payment__upload-button:focus-visible,
  .checkout-payment__upload-button:active,
  .checkout-payment__secondary:hover,
  .checkout-payment__secondary:focus-visible,
  .checkout-payment__secondary:active,
  .checkout-summary__button:hover,
  .checkout-summary__button:focus-visible,
  .checkout-summary__button:active,
  .order-complete__invoice:hover,
  .order-complete__invoice:focus-visible,
  .order-complete__invoice:active,
  .order-complete .primary-link:hover,
  .order-complete .primary-link:focus-visible,
  .order-complete .primary-link:active,
  .order-complete .ghost-link:hover,
  .order-complete .ghost-link:focus-visible,
  .order-complete .ghost-link:active {
    transform: none;
  }
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
  .order-list__meta span {
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
.order-list__products h3 {
  margin: 0;
}
.order-list__product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.order-list__product-chip {
  display: grid;
  gap: 14px;
  align-items: center;
}
.order-list__product-chip {
  grid-template-columns: 72px minmax(0, 1fr) auto;
}
.order-list__product-thumb {
  width: 72px;
  height: 72px;
  overflow: hidden;
  background: #f6efe3;
}
.order-list__product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.order-list__product-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}
.order-list__product-copy strong {
  color: #1f1d1b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.order-list__product-copy span {
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
@media (max-width: 640px) {
  body.has-track-order-page .app-content {
    padding-top: 0;
  }
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
  .mobile-header-search,
  .mobile-search-results {
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
  .checkout-summary {
    position: sticky;
    top: 108px;
  }
  .order-complete__details {
    padding: 28px 32px;
  }
}
@media (min-width: 641px) and (max-width: 899px) {
  .service-banner__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 1099px) {
  .header-mobile-top,
  .mobile-header-search,
  .mobile-search-results {
    grid-column: 1 / -1;
    width: 100%;
    min-width: 0;
  }
  .header-icon-actions {
    display: none;
  }
  .checkout-layout {
    grid-template-columns: 1fr;
    gap: 22px;
  }
  .checkout-summary {
    position: static;
  }
}
@media (max-width: 980px) {
  .mobile-account-dropdown {
    display: grid;
    gap: 12px;
    margin-top: 6px;
    border: 1px solid #d7dce5;
    background: #fff;
    padding: 12px;
  }
  .mobile-account-dropdown .account-dropdown__head {
    padding-bottom: 8px;
  }
  .mobile-account-dropdown .account-dropdown__link,
  .mobile-account-dropdown .account-dropdown__help {
    font-size: 0.9rem;
  }
  .mobile-account-dropdown .account-dropdown__guest-actions {
    grid-template-columns: 1fr 1fr;
  }
  .mobile-account-dropdown .account-dropdown__login,
  .mobile-account-dropdown .account-dropdown__register,
  .mobile-account-dropdown .account-dropdown__logout {
    min-height: 40px;
  }
  .mobile-account-dropdown .mobile-account-dropdown__select {
    border: 1px solid #e3e9f4;
    border-radius: 0;
  }
  .auth-shell,
  .auth-shell--reverse {
    grid-template-columns: 1fr;
  }
  .auth-panel--story {
    min-height: 360px;
  }
  .auth-panel--form h1,
  .auth-panel--story h2 {
    max-width: 22ch;
  }
  .hero-grid,
  .cart-layout { grid-template-columns: 1fr; }
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 20px 0 14px;
  }
  .footer-feature-grid {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 16px 0;
  }
  .footer-payment-strip {
    gap: 10px;
    padding: 12px 10px;
    margin-top: 14px;
  }
  .footer-feature-item__icon {
    width: 24px;
    height: 24px;
  }
  .footer-feature-item__icon svg {
    width: 20px;
    height: 20px;
  }
  .footer-feature-item__copy strong {
    font-size: 1.02rem;
  }
  .footer-feature-item__copy span {
    font-size: 0.96rem;
  }
  .footer-grid--desktop {
    display: none;
  }
  .footer-grid--mobile {
    display: grid;
  }
  .footer-section {
    border: 1px solid rgba(255,255,255,0.16);
    border-radius: 14px;
    overflow: hidden;
    background: rgba(255,255,255,0.02);
  }
  .footer-section:not(:last-child) {
    border-right: 1px solid rgba(255,255,255,0.16);
    padding-right: 0;
  }
  .footer-section summary {
    cursor: pointer;
    margin: 0;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .footer-section summary::after {
    content: "+";
    font-size: 1.1rem;
    color: #9fc3ff;
  }
  .footer-section[open] summary::after {
    content: "â€“";
  }
  .footer-links {
    display: none;
    padding: 0 16px 14px;
    gap: 9px;
  }
  .footer-links a {
    display: block;
    padding-inline: 10px;
  }
  .footer-section[open] .footer-links {
    display: grid;
  }
  .footer-meta {
    padding-top: 18px;
  }
  .footer-legal-links {
    gap: 8px 14px;
  }
  .footer-section[open] summary::after {
    content: "-";
  }
}
@media (max-width: 640px) {
  .developer-profile-intro__photo {
    width: min(230px, 72vw);
  }
  .developer-contact-actions {
    flex-direction: column;
  }
  .developer-contact-actions a {
    justify-content: center;
  }
  .shell, .narrow-shell { width: min(100vw - 20px, 100%); }
  .auth-page {
    padding-top: 18px;
  }
  .auth-shell {
    gap: 14px;
  }
  .auth-panel {
    border-radius: 26px;
  }
  .auth-panel--form,
  .auth-panel--story {
    padding: 22px 16px;
  }
  .auth-panel--story {
    min-height: auto;
  }
  .auth-panel--form h1 {
    font-size: clamp(1.8rem, 9vw, 2.55rem);
  }
  .auth-panel--story h2 {
    font-size: clamp(1.65rem, 8vw, 2.2rem);
  }
  .auth-lead {
    font-size: 0.94rem;
    line-height: 1.58;
  }
  .auth-submit {
    width: 100%;
    min-width: 0;
  }
  .auth-links {
    display: grid;
    gap: 10px;
  }
  .auth-benefits p {
    padding: 14px 14px 14px 42px;
    border-radius: 18px;
  }
  .content-hero {
    grid-template-columns: 1fr;
    padding: 22px 16px;
  }
  .content-hero__badge {
    width: 78px;
    border-radius: 24px;
    justify-self: end;
    order: -1;
  }
  .content-fact-strip {
    grid-template-columns: 1fr;
  }
  .content-section,
  .content-cta {
    padding: 20px 16px;
  }
  .content-grid,
  .content-highlight-grid {
    grid-template-columns: 1fr;
  }
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
    padding: 16px 14px 104px;
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
  .checkout-payment__auto-card {
    padding: 18px 16px;
  }
  .checkout-payment__auto-head {
    align-items: flex-start;
    flex-direction: column;
  }
  .checkout-payment__flow-grid {
    grid-template-columns: 1fr;
  }
  .checkout-hubtel-modal__card {
    padding: 18px;
  }
  .checkout-hubtel-modal__actions {
    grid-template-columns: 1fr;
  }
  .checkout-hubtel-modal__actions .checkout-payment__secondary,
  .checkout-hubtel-modal__actions .checkout-summary__button {
    width: 100%;
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
    gap: 12px;
    padding: 12px;
  }
  .checkout-payment__proof-thumb {
    width: 100%;
    max-width: 100%;
    height: clamp(140px, 48vw, 170px);
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
  .checkout-mobile-action-bar {
    display: grid;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 70;
    gap: 10px;
    padding: 10px 12px calc(env(safe-area-inset-bottom) + 12px);
    background: #ffffff;
    border-top: 1px solid #e6dfd3;
    box-shadow: 0 -14px 32px rgba(14, 19, 28, 0.2);
  }
  .checkout-mobile-action-bar__button {
    width: 100%;
    min-height: 54px;
    border-radius: 0;
    padding: 0 18px;
    background: #184d22;
    font-size: 0.98rem;
    letter-spacing: 0.01em;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
  }
  .checkout-mobile-action-bar__button.is-disabled {
    opacity: 0.72;
    pointer-events: none;
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
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
    padding: 18px 0 16px;
  }
  .cart-row__product {
    grid-column: 1;
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
  .cart-row__subtotal,
  .cart-row__subtotal-block {
    grid-column: 1;
  }
  .cart-row__subtotal-block { gap: 6px; }
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
  .cart-row__subtotal-block {
    display: grid;
    justify-items: stretch;
    gap: 8px;
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
    width: auto;
    height: 48px;
    min-width: 112px;
    min-height: 48px;
    padding: 0 14px;
    border: 1px solid #e5ddd0;
    background: #fff;
    color: #1f1d1b;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    border-radius: 0;
    white-space: nowrap;
    font-size: 0.9rem;
    font-weight: 600;
    transition: transform 0.18s ease, box-shadow 0.22s ease, background 0.22s ease, border-color 0.22s ease, color 0.22s ease;
  }
  .cart-row__remove-mobile:hover,
  .cart-row__remove-mobile:focus-visible {
    transform: translateY(-1px);
    border-color: #0d56da;
    color: #0a43ad;
    background: rgba(13, 86, 218, 0.05);
    box-shadow: 0 12px 24px rgba(13, 86, 218, 0.1);
  }
  .cart-row__remove-mobile:active {
    transform: translateY(0);
    box-shadow: 0 7px 16px rgba(13, 86, 218, 0.08);
  }
  .cart-row__remove-mobile svg {
    width: 17px;
    height: 17px;
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
  .wishlist-page {
    min-height: 1040px;
  }
  .wishlist-skeleton {
    min-height: 620px;
  }
  .wishlist-skeleton__head {
    display: none;
  }
  .wishlist-skeleton__row {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 18px 0;
  }
  .wishlist-skeleton__row > span:not(.wishlist-skeleton__button) {
    height: 16px;
  }
  .wishlist-skeleton__button {
    min-height: 48px;
  }
  .wishlist-skeleton__row > .wishlist-skeleton__button:first-child {
    display: none;
  }
  .wishlist-skeleton__product {
    grid-template-columns: 82px minmax(0, 1fr);
    gap: 12px;
  }
  .wishlist-skeleton__thumb {
    width: 82px;
    height: 82px;
    border-radius: 14px;
  }
  .wishlist-skeleton__meta span:first-child {
    width: 100%;
  }
  .wishlist-skeleton__meta span:last-child {
    width: 46%;
  }
  .wishlist-skeleton__actions {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .wishlist-skeleton__actions span,
  .wishlist-skeleton__actions span:not(:first-child) {
    width: 100%;
  }
  .wishlist-empty .stack-actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
  }
  .wishlist-empty .primary-link,
  .wishlist-empty .ghost-link {
    width: 100%;
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
    min-height: 52px;
    border: 1px solid #e5ddd0;
    background: #ffffff;
    color: #1f1d1b;
    font-size: 0.95rem;
    font-weight: 700;
    border-radius: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
  }
  .wishlist-row__remove-mobile svg {
    width: 17px;
    height: 17px;
    flex: 0 0 17px;
    display: block;
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
  /* Account mobile rules are isolated in the dedicated account section below. */
  .faq-showcase__layout {
    grid-template-columns: 1fr;
  }
  .faq-card {
    border-radius: 24px;
  }
  .faq-card__question {
    padding: 20px 18px;
    font-size: 1.02rem;
  }
  .faq-card__answer {
    padding: 0 18px 20px;
  }
  .faq-track-link {
    min-height: 50px;
    padding: 0 22px;
  }
  .faq-support-card {
    position: static;
    top: auto;
    padding: 28px 20px;
    border-radius: 26px;
  }
  .contact-layout,
  .contact-cards,
  .contact-highlights {
    grid-template-columns: 1fr;
  }
  .contact-page-simple__layout {
    grid-template-columns: 1fr;
  }
  .contact-page-simple__right {
    border-left: 0;
    border-top: 1px solid #d9dfe8;
  }
  .contact-page-simple__left,
  .contact-page-simple__right {
    padding: 24px 18px;
  }
  .contact-page-simple__left h2,
  .contact-page-simple__right h2 {
    font-size: 2rem;
  }
  .contact-map--simple,
  .contact-map--simple iframe {
    min-height: 300px;
  }
  .about-story,
  .about-values,
  .about-services__grid,
  .about-reasons__grid,
  .about-core-values__grid {
    grid-template-columns: 1fr;
  }
  .contact-form-panel {
    padding: 24px 18px;
    border-radius: 24px;
  }
  .about-story__gallery {
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 162px;
    gap: 10px;
    min-height: 0;
  }
  .about-story__panel {
    border-radius: 20px;
    padding: 8px;
  }
  .about-story__panel:nth-child(1) .about-story__image,
  .about-story__panel:nth-child(2) .about-story__image,
  .about-story__panel:nth-child(4) .about-story__image,
  .about-story__panel:nth-child(6) .about-story__image,
  .about-story__panel:nth-child(8) .about-story__image,
  .about-story__panel:nth-child(1):hover .about-story__image,
  .about-story__panel:nth-child(2):hover .about-story__image,
  .about-story__panel:nth-child(4):hover .about-story__image,
  .about-story__panel:nth-child(6):hover .about-story__image,
  .about-story__panel:nth-child(8):hover .about-story__image {
    transform: translateY(-6px) scale(0.96);
  }
  .about-story__label {
    left: 12px;
    right: 12px;
    bottom: 12px;
    min-height: 34px;
    justify-content: center;
    text-align: center;
    font-size: 0.78rem;
    padding: 0 10px;
  }
  .about-story__stats,
  .about-showcase__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .about-showcase {
  }
  .about-showcase__media {
    width: 100%;
    padding: 0 0 12px;
  }
  .about-showcase__screen {
    width: 100%;
  }
  .about-showcase__slide {
    padding: 0 32px;
  }
  .about-showcase__stat {
    padding: 14px 12px;
  }
  .about-showcase__stat strong {
    font-size: 1.45rem;
  }
  .about-showcase__stat span {
    font-size: 0.84rem;
  }
  .about-showcase__poster {
    max-width: 100%;
  }
  .contact-form__grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .contact-form__submit {
    width: 100%;
    justify-self: stretch;
  }
  .contact-visual__frame {
    padding: 26px 20px 86px;
    border-radius: 26px;
  }
  .contact-visual__logo {
    width: 118px;
  }
  .contact-visual__content h2 {
    font-size: 1.65rem;
  }
  .contact-visual__meta {
    flex-direction: column;
    align-items: stretch;
  }
  .contact-visual__meta span {
    justify-content: center;
    text-align: center;
  }
  .contact-visual__actions {
    display: grid;
    grid-template-columns: 1fr;
  }
  .contact-visual__link {
    width: 100%;
  }
  .contact-card {
    padding: 24px 18px;
  }
  .contact-map-selector {
    display: grid;
    grid-template-columns: 1fr;
  }
  .contact-map-selector__button {
    width: 100%;
  }
  .contact-map,
  .contact-map iframe {
    min-height: 300px;
  }
  .contact-highlight {
    grid-template-columns: auto 1fr;
  }
  .orders-summary,
  .order-list__product-grid {
    grid-template-columns: 1fr;
  }
  .order-list__head,
  .order-list__meta {
    flex-direction: column;
    align-items: start;
  }
  .order-list__product-chip {
    grid-template-columns: 64px minmax(0, 1fr);
  }
  .order-list__actions .primary-link {
    width: 100%;
    text-align: center;
  }
  .toast-stack {
    top: calc(env(safe-area-inset-top) + 74px);
  }
  .service-banner,
  .page-section {
    overflow-x: clip;
  }
  .home-social-strip {
    grid-template-columns: 1fr;
    padding-bottom: 16px;
  }
  .home-social-strip__links {
    justify-content: flex-start;
  }
  .header-topbar__inner { justify-content: center; text-align: center; }
  .header-topbar__inner span:last-child { display: none; }
  .header-inner {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    row-gap: 12px;
  }
  .brand-mark--mobile .brand-mark__image { height: 36px; }
  .brand-mark--desktop-shell {
    display: none;
  }
  .header-icon-actions {
    display: none;
  }
  .header-search-mode {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
  }
  .header-search-mode__brand {
    display: none;
  }
  .header-search-mode__results {
    max-height: calc(100dvh - 140px);
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    border: 1px solid #d7dce5;
    margin-top: 4px;
  }
  .header-search-mode__form .search-input {
    height: 46px;
    padding-right: 88px;
    font-size: 16px;
  }
  .header-search-mode__cancel {
    width: 38px;
    height: 38px;
  }
  .header-search-mode__results .desktop-search-tray__results {
    display: block;
    border: 0;
    margin-top: 0;
  }
  .header-search-mode__results .desktop-search-tray__sidebar {
    border-right: 0;
    border-bottom: 1px solid #d7dce5;
    padding: 16px 18px;
    gap: 10px;
  }
  .header-search-mode__results .desktop-search-tray__sidebar-title {
    font-size: 2rem;
    font-weight: 500;
  }
  .header-search-mode__results .desktop-search-tray__suggestion {
    font-size: 1.12rem;
    line-height: 1.35;
    font-weight: 600;
    text-transform: lowercase;
  }
  .header-search-mode__results .desktop-search-tray__all-results {
    width: fit-content;
    min-height: 44px;
    padding: 0 18px;
    margin-top: 10px;
    font-size: 0.72rem;
    letter-spacing: 0.03em;
  }
  .header-search-mode__results .desktop-search-tray__main {
    padding: 14px 16px 18px;
  }
  .header-search-mode__results .desktop-search-tray__section-head {
    margin-bottom: 8px;
  }
  .header-search-mode__results .desktop-search-tray__section-title {
    font-size: 1.9rem;
  }
  .header-search-mode__results .desktop-search-tray__section-title span {
    font-size: 1.3rem;
  }
  .header-search-mode__results .desktop-search-tray__see-all {
    font-size: 0.95rem;
  }
  .header-search-mode__results .desktop-search-tray__products {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .header-search-mode__results .desktop-search-tray__product {
    grid-template-columns: 84px minmax(0, 1fr);
    padding: 8px;
    gap: 10px;
  }
  .header-search-mode__results .desktop-search-tray__product-thumb {
    width: 78px;
    height: 62px;
  }
  .header-search-mode__results .desktop-search-tray__product-copy {
    gap: 5px;
  }
  .header-search-mode__results .desktop-search-tray__product-copy strong {
    font-size: 0.94rem;
    line-height: 1.25;
  }
  .header-search-mode__results .desktop-search-tray__product-copy p {
    font-size: 0.79rem;
    -webkit-line-clamp: 2;
  }
  .header-search-mode__results .desktop-search-tray__product-copy b {
    font-size: 0.95rem;
  }
  .header-search-mode__results .desktop-search-tray__section-head--secondary {
    display: none;
  }
  .header-search-mode__assist {
    display: none;
    position: fixed;
    right: 2px;
    top: 56%;
    transform: translateY(-50%) rotate(180deg);
    writing-mode: vertical-rl;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 10px 8px;
    background: #0d56da;
    color: #ffffff;
    border-radius: 4px 0 0 4px;
    z-index: 30;
  }
  .products-results {
    font-size: 0.82rem;
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
  .service-banner__grid {
    grid-template-columns: 1fr;
  }
  .cart-row, .filters-panel, .content-highlight-grid, .content-grid, .faq-actions-grid, .thankyou-meta-grid { grid-template-columns: 1fr; }
}
@media (max-width: 420px) {
  .auth-hp-card {
    border-radius: 14px;
    padding: 10px;
  }
  .auth-hp-frame {
    padding: 12px 10px 14px;
  }
  .auth-hp-grid-two {
    grid-template-columns: 1fr;
  }
  .auth-hp-card h1 {
    font-size: 2.55rem;
  }
  .auth-hp-head a {
    font-size: 0.88rem;
  }
}
@media (max-width: 1099px) {
  .shell {
    width: min(100%, calc(100vw - clamp(24px, 4vw, 32px)));
  }
  .page-section {
    padding-block: clamp(22px, 6vw, 36px);
  }
  .hero-panel,
  .panel {
    padding: clamp(18px, 4vw, 24px);
  }
}
@media (max-width: 760px) {
  input,
  select,
  textarea {
    font-size: 16px;
  }
  .shell {
    width: min(100%, calc(100vw - 24px));
  }
  .checkout-payment__flow-grid,
  .checkout-fields,
  .checkout-delivery__options,
  .checkout-customer-grid,
  .cart-shell,
  .wishlist-shell,
  .checkout-shell {
    padding: 18px 14px;
  }
  .checkout-form,
  .checkout-payment,
  .checkout-payment__details,
  .checkout-summary,
  .cart-summary,
  .wishlist-table,
  .checkout-payment__option,
  .checkout-payment__flow,
  .checkout-payment__auto-head,
  .checkout-payment__instruction-head,
  .wishlist-actions__link {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: stretch;
    align-items: start;
  }
  .checkout-summary__actions {
    align-items: stretch;
  }
  .checkout-summary__button,
  .checkout-payment__secondary,
  .checkout-payment__upload-button {
    width: 100%;
  }
  .checkout-payment__copy,
  .checkout-summary__line strong,
  .cart-summary__line strong,
  .wishlist-row__meta {
    width: 100%;
  }
  .checkout-summary__line,
  .checkout-summary__total,
  .cart-summary__line,
  .cart-summary__total {
    align-items: flex-start;
  }
  .checkout-summary__line strong,
  .cart-summary__line strong {
    max-width: none;
    white-space: normal;
    overflow-wrap: anywhere;
  }
  .checkout-payment__proof-preview {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }
  .checkout-payment__proof-thumb {
    width: 100%;
    max-width: 100%;
    height: clamp(150px, 48vw, 180px);
  }
}
@media (max-width: 520px) {
  .checkout-payment__option,
  .checkout-payment__flow,
  .checkout-payment__instruction-card,
  .checkout-payment__upload-card,
  .checkout-payment__auto-card,
  .checkout-customer-card {
    padding: 16px;
  }
  .checkout-mobile-action-bar {
    z-index: 160;
  }
  .toast-stack {
    left: 12px;
    right: 12px;
    top: auto;
    bottom: calc(74px + env(safe-area-inset-bottom));
    z-index: 1400;
  }
  body:has(.cart-feedback) .toast-stack {
    bottom: calc(220px + env(safe-area-inset-bottom));
  }
  .toast {
    width: 100%;
    max-width: none;
  }
}


`;

export default function GlobalStyles() {
  return <style dangerouslySetInnerHTML={{ __html: styles }} />;
}


