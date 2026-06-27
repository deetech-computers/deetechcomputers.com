const styles = `
/* Vercel redeploy trigger: no visual behavior change. */
:root {
  color-scheme: light;
  --panel: #ffffff;
  --panel-soft: #f8f2e6;
  --text: #1b1916;
  --muted: #665d52;
  --line: #e8e0d4;
  --brand: #0088cc;
  --brand-strong: #006e9e;
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
.main-nav,
  .header-actions,
  .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
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
.nav-link.is-active::after, .nav-link:hover::after, .nav-link.is-open::after { background: #0088cc; transform: scaleX(1); }
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
  background: #0088cc;
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
  color: #006e9e;
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
  color: #0088cc;
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
  background: #0088cc;
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
  color: #0088cc;
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
  border-color: #0088cc;
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
  color: #0088cc;
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
  background: #0088cc;
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
  background: #006e9e;
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
  outline: 2px solid #0088cc;
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
.account-dropdown__head:has(.account-dropdown__avatar) {
  display: flex;
  align-items: center;
  gap: 10px;
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
.account-dropdown__avatar {
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  overflow: hidden;
  border: 2px solid #184f27;
}
.account-dropdown__avatar img,
.account-dropdown__avatar .product-card__placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.account-dropdown__avatar .product-card__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #a6f5af;
  color: #003714;
  font-weight: 800;
  font-size: 1.1rem;
}
.account-dropdown__identity {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.account-dropdown__identity strong {
  font-size: 0.95rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.account-dropdown__identity span {
  color: #617086;
  font-size: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  color: #006e9e;
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
  border: 1px solid #0088cc;
  background: #0088cc;
  color: #fff;
}
.account-dropdown__help {
  color: #0088cc;
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
  background: #0088cc;
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
  color: #0088cc;
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
.icon-button:hover { background: rgba(0, 136, 204, 0.08); border-color: rgba(0, 136, 204, 0.24); }
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
  background: rgba(0, 136, 204, 0.1);
}
.icon-button--mobile-action svg {
  width: 1.42rem; height: 1.42rem;
}
.icon-button--desktop { display: none; }
.cart-button { position: relative; }
.icon-button__badge {
  position: absolute; top: -5px; right: -6px; min-width: 18px; height: 18px; padding: 0 4px;
  border-radius: 999px; background: var(--brand); color: #ffffff; font-size: 0.7rem; font-weight: 700;
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
  color: #fff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12); font-weight: 700;
}
.ghost-link, .ghost-button { background: white; color: var(--text); border: 1px solid var(--line); }
.cart-pill { background: var(--text); color: white; }
.cart-pill span {
  min-width: 26px; height: 26px; border-radius: 999px; display: grid; place-items: center;
  background: rgba(255,255,255,0.18);
}
.page-section { padding: 32px 0 48px; }
.hero-grid,
  .footer-grid {
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
@media (max-width: 640px) {
  .cart-hero {
    padding: 12px 0 20px;
    gap: 8px;
  }
  .cart-hero__crumbs {
    font-size: 0.92rem;
    gap: 8px;
  }
}
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
@keyframes homeLogoMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-50% - 7px)); }
}
.panel {
  background: var(--panel); border: 1px solid rgba(217, 226, 240, 0.95); border-radius: 28px; box-shadow: var(--shadow);
}
.panel { padding: 24px; }
.field-group { display: grid; gap: 8px; }
.disabled-field { background: #f5f7fb; color: var(--muted); }
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
@keyframes skeleton-shimmer {
  0% { background-position: 120% 0; }
  100% { background-position: -120% 0; }
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
  background: #0088cc !important;
  background-image: none !important;
  color: #ffffff !important;
  box-shadow: none;
  border-radius: 4px;
  transition: transform 180ms ease, background 180ms ease;
}
.empty-state .primary-link:hover,
.empty-state .primary-link:focus-visible,
.empty-state .primary-button:hover,
.empty-state .primary-button:focus-visible {
  background: #006e9e !important;
  transform: translateY(-2px);
}
.empty-state .primary-link:active,
.empty-state .primary-button:active {
  transform: translateY(0);
}
.auth-form { display: grid; gap: 14px; margin-top: 18px; }
.auth-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  align-items: center;
  margin-top: 18px;
  color: var(--muted);
}
.auth-links a {
  color: #0088cc;
  font-weight: 800;
  text-decoration-color: rgba(0, 136, 204, 0.35);
  text-underline-offset: 4px;
  transition:
    color 0.18s ease,
    text-decoration-color 0.18s ease,
    transform 0.18s ease;
}
.auth-links a:hover,
.auth-links a:focus-visible {
  color: #0088cc;
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

@media (prefers-reduced-motion: reduce) {
  .auth-links a,
  .auth-google__button {
    transition: none;
  }
  .auth-links a:hover,
  .auth-links a:focus-visible,
  .auth-google__button:not(.is-disabled):hover,
  .auth-google__button:not(.is-disabled):focus-within {
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
  color: #4aa0ff;
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
  .desktop-search-tray {
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
@media (max-width: 640px) {
  body.has-track-order-page .app-content {
    padding-top: 0;
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
  .hero-grid { grid-template-columns: 1fr; }
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
    content: "–";
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
  .shell { width: min(100vw - 20px, 100%); }
  .auth-links {
    display: grid;
    gap: 10px;
  }
  /* Account mobile rules are isolated in the dedicated account section below. */
  .toast-stack {
    top: calc(env(safe-area-inset-top) + 74px);
  }
  .page-section {
    overflow-x: clip;
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
    background: #0088cc;
    color: #ffffff;
    border-radius: 4px 0 0 4px;
    z-index: 30;
  }
}
@media (max-width: 1099px) {
  .shell {
    width: min(100%, calc(100vw - clamp(24px, 4vw, 32px)));
  }
  .page-section {
    padding-block: clamp(22px, 6vw, 36px);
  }
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
}
@media (max-width: 520px) {
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


