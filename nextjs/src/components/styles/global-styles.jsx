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
  -webkit-text-size-adjust: 100%;
}
body {
  background: #f5f6f7;
  color: var(--text);
  font-family: "Poppins", sans-serif;
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
  z-index: 120;
  display: flex;
  justify-content: flex-end;
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
  height: 100%;
  background: #ffffff;
  border-left: 1px solid #dbe4f0;
  box-shadow: -20px 0 52px rgba(9, 23, 42, 0.22);
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
}
.cart-feedback__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 24px 16px;
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
  border: 0;
  background: transparent;
  color: #0d56da;
  cursor: pointer;
  width: auto;
  height: 30px;
  min-width: 76px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  font-size: 0.96rem;
  font-weight: 700;
  line-height: 1;
}
.cart-feedback__delete svg {
  width: 15px;
  height: 15px;
}
.cart-feedback__delete:hover {
  color: #083fa5;
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
  padding: 16px 24px 20px;
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
}
.cart-feedback__view {
  background: #184d22;
  color: #fff;
}
.cart-feedback__checkout {
  background:
    radial-gradient(circle at 76% 18%, rgba(255, 255, 255, 0.14), transparent 34%),
    linear-gradient(135deg, #0b4dac 0%, #0a4fcf 45%, #0a4aa8 100%);
  color: #fff;
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
    min-width: 70px;
    height: 28px;
    padding: 0;
    font-size: 0.85rem;
    gap: 4px;
  }
  .cart-feedback__delete svg {
    width: 13px;
    height: 13px;
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
  color: #171513; box-shadow: var(--shadow); font-weight: 700;
}
.ghost-link, .ghost-button { background: white; color: var(--text); border: 1px solid var(--line); }
.cart-pill { background: var(--text); color: white; }
.cart-pill span {
  min-width: 26px; height: 26px; border-radius: 999px; display: grid; place-items: center;
  background: rgba(255,255,255,0.18);
}
.page-section { padding: 32px 0 48px; }
.hero-section { padding: 0 0 48px; }
.hero-grid, .filters-panel, .cart-layout, .account-grid, .product-detail, .footer-grid, .admin-layout, .resource-grid {
  display: grid; gap: 18px;
}
.hero-grid { grid-template-columns: 1.4fr 1fr; }
.hero-grid h1, .section-header h1, .panel h1 { margin: 0; font-size: clamp(2rem, 5vw, 4rem); line-height: 1.02; }
.hero-copy, .section-kicker, .product-card__eyebrow, .auth-copy, .form-error, .muted { color: var(--muted); }
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
.hero-banner {
  position: relative;
  overflow: hidden;
  height: auto;
  aspect-ratio: 16 / 6;
  background: #f4f6fa;
  box-shadow: 0 28px 70px rgba(16, 16, 16, 0.24);
}
.hero-banner__slides {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 480ms ease;
}
.hero-banner__slide {
  position: relative;
  flex: 0 0 100%;
  min-height: 100%;
  height: 100%;
  overflow: hidden;
}
.hero-banner__slide-link {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}
.hero-banner__slide-media {
  position: relative;
  width: 100%;
  height: 100%;
}
.hero-banner__slide-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100% !important;
}
.hero-banner__slide-image--bg {
  display: none;
}
.hero-banner__slide-image--fg {
  object-fit: cover;
  object-position: center center;
}
.hero-banner__slide-fallback {
  position: absolute;
  inset: 0;
  background: linear-gradient(140deg, #1d1d1d 0%, #2d2d2d 42%, #121212 100%);
}
.hero-banner__shade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.68) 0%, rgba(0, 0, 0, 0.45) 32%, rgba(0, 0, 0, 0.12) 70%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.42) 0%, rgba(0, 0, 0, 0.1) 38%, rgba(0, 0, 0, 0.06) 100%);
}
.hero-banner__inner {
  position: absolute;
  inset: 0;
  min-height: 0;
  height: 100%;
  display: grid;
  align-items: end;
  padding: clamp(14px, 2.4vw, 30px) clamp(14px, 2.2vw, 34px) clamp(20px, 3vw, 42px);
}
.hero-banner__inner,
.hero-banner__content,
.hero-banner__arrow { position: relative; z-index: 1; }
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
.hero-banner__content {
  display: grid;
  gap: 12px;
  width: min(620px, 100%);
}
.hero-banner__eyebrow {
  margin: 0;
  color: #c7e8f8;
  font-size: clamp(0.72rem, 1.5vw, 0.9rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.hero-banner__content h1 {
  margin: 0;
  color: #f6f2eb;
  font-size: clamp(1.4rem, 4.4vw, 3.1rem);
  line-height: 1.05;
  font-weight: 700;
  text-wrap: balance;
}
.hero-banner__content h1 span {
  display: block; margin-top: 8px; color: #ffffff; font-weight: 700;
}
.hero-banner .hero-copy {
  margin: 0;
  color: rgba(255,255,255,0.9);
  max-width: 46ch;
  font-size: clamp(0.85rem, 1.55vw, 1.05rem);
  line-height: 1.45;
}
.hero-banner .hero-actions {
  gap: 10px;
  margin-top: 4px;
}
.hero-banner .primary-link {
  min-width: 124px; text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.72rem;
  background: linear-gradient(180deg, #1693cf 0%, #0f84bc 100%);
  color: #ffffff;
  border: 1px solid rgba(22, 147, 207, 0.35);
}
.hero-banner__ghost {
  background: rgba(255,255,255,0.08); color: white; border-color: rgba(255,255,255,0.14);
}
.hero-banner__arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 50px; height: 50px; border: 0; border-radius: 999px;
  background: rgba(255,255,255,0.9); color: #2c2c2c; display: inline-flex;
  align-items: center; justify-content: center; cursor: pointer;
  box-shadow: 0 8px 28px rgba(0,0,0,0.24);
  transition: transform 160ms ease, opacity 160ms ease;
}
.hero-banner__arrow:hover { transform: translateY(-50%) scale(1.04); }
.hero-banner__arrow span {
  width: 13px; height: 13px; display: block; border-top: 2px solid currentColor; border-right: 2px solid currentColor;
}
.hero-banner__arrow--left { left: 18px; }
.hero-banner__arrow--left span { transform: rotate(-135deg); margin-left: 4px; }
.hero-banner__arrow--right { right: 18px; }
.hero-banner__arrow--right span { transform: rotate(45deg); margin-right: 4px; }
.hero-banner__dots {
  position: absolute;
  left: 50%;
  bottom: 14px;
  transform: translateX(-50%);
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
}
.hero-banner__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  border: 0;
  background: #9fcae2;
  cursor: pointer;
}
.hero-banner__dot.is-active {
  background: #0d85be;
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
.home-logo-marquee {
  width: 100vw;
  margin: 8px 0 10px;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  padding: 10px 0;
  background: #ffffff;
  overflow: hidden;
}
.home-logo-marquee__track {
  display: flex;
  width: max-content;
  animation: homeLogoMarquee 34s linear infinite;
  will-change: auto;
}
.home-logo-marquee__lane {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-right: 14px;
}
.home-logo-marquee__item {
  width: 130px;
  height: 72px;
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
  padding: 4px 8px;
}
.home-logo-marquee__item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: saturate(0.95) contrast(1.02);
}
.home-logo-marquee__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: saturate(0.95) contrast(1.02);
}
.home-logo-marquee__fallback {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(232, 224, 212, 0.42), rgba(245, 246, 247, 0.88));
}
@keyframes homeLogoMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-50% - 7px)); }
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
.category-tile__media {
  transition: transform 380ms cubic-bezier(0.22, 1, 0.36, 1);
}
.category-art,
.category-tile__image,
.category-tile__fallback {
  width: 100%; height: 100%; display: block; object-fit: cover;
}
.category-tile__image {
  object-fit: contain;
  object-position: center bottom;
  padding: clamp(10px, 2vw, 18px);
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), filter 320ms ease;
}
.category-tile__image--laptops-desktops {
  object-position: center center;
  padding: clamp(6px, 1.2vw, 12px);
  transform: scale(1.08);
  transform-origin: center;
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
  transition: background 300ms ease;
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
.category-tile__count,
.category-tile__content h2,
.category-tile__cta {
  transition: transform 260ms ease;
}
@media (hover: hover) and (pointer: fine) {
  .category-tile:hover .category-tile__media {
    transform: scale(1.035);
  }
  .category-tile:hover .category-tile__image {
    transform: scale(1.02);
    filter: saturate(1.08);
  }
  .category-tile:hover .category-tile__overlay {
    background: linear-gradient(180deg, rgba(10,10,10,0.16) 0%, rgba(10,10,10,0.56) 56%, rgba(10,10,10,0.9) 100%);
  }
  .category-tile:hover .category-tile__count,
  .category-tile:hover .category-tile__content h2,
  .category-tile:hover .category-tile__cta {
    transform: translateY(-2px);
  }
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
  gap: 16px;
  margin-bottom: 12px;
  padding: 0;
  text-align: center;
  background: transparent;
  border: 1px solid #e1e1e1;
  border-radius: 0;
  overflow: hidden;
}
.shop-hero h1 {
  margin: 0;
  font-size: clamp(1.4rem, 3.2vw, 2rem);
  line-height: 1.08;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  padding: 16px 12px 18px;
}
.shop-hero__crumbs {
  margin: 0;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1f2937;
  font-size: 0.84rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 12px 14px;
  justify-content: flex-start;
  background: #f2f2f2;
  border-bottom: 1px solid #e1e1e1;
}
.shop-hero__crumbs a:hover {
  color: var(--text);
}
.shop-layout {
  display: grid; gap: 14px;
  scroll-margin-top: 110px;
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
.shop-sidebar__section-toggle {
  width: 100%;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0;
  text-align: left;
  cursor: pointer;
}
.shop-sidebar__section h3,
.shop-sidebar__heading h2 {
  margin: 0; font-size: 0.98rem; color: var(--text);
}
.shop-sidebar__section-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  font-size: 1.15rem;
  color: #475569;
}
.shop-sidebar__section-content {
  display: grid;
  gap: 8px;
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
.shop-price-filter {
  display: grid;
  gap: 10px;
}
.shop-price-filter__values {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
}
.shop-price-filter__values span {
  border: 1px solid #cfd4de;
  background: #fff;
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  font-size: 0.82rem;
  color: #1f2937;
}
.shop-price-filter__slider {
  position: relative;
  height: 34px;
  display: grid;
  align-items: center;
}
.shop-price-filter__slider::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 999px;
  background: #d0d4dc;
}
.shop-price-filter__track-active {
  position: absolute;
  height: 4px;
  border-radius: 999px;
  background: #111827;
  pointer-events: none;
}
.shop-price-filter__slider input[type="range"] {
  position: absolute;
  left: 0;
  width: 100%;
  margin: 0;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  pointer-events: none;
}
.shop-price-filter__slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 0;
  background: #111827;
  cursor: pointer;
  pointer-events: auto;
}
.shop-price-filter__slider input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 0;
  background: #111827;
  cursor: pointer;
  pointer-events: auto;
}
.shop-price-filter__slider input[type="range"]::-webkit-slider-runnable-track {
  background: transparent;
}
.shop-price-filter__slider input[type="range"]::-moz-range-track {
  background: transparent;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid #e1e1e1;
  border-radius: 0;
}
.shop-toolbar__summary {
  display: grid; gap: 8px;
}
.shop-active-filters {
  display: flex; flex-wrap: wrap; gap: 8px;
}
.shop-toolbar__controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.shop-toolbar__view {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #4b5563;
  font-size: 0.84rem;
  letter-spacing: 0.04em;
}
.shop-toolbar__view span {
  font-weight: 600;
}
.shop-toolbar__view strong {
  font-size: 1rem;
  color: #111827;
  font-weight: 800;
  line-height: 1;
}
.shop-toolbar__view small {
  font-size: 0.82rem;
  color: #6b7280;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.shop-toolbar__sort {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #c8c8c8;
  border-radius: 0;
  padding: 4px 8px;
  min-height: 40px;
}
.shop-toolbar__sort span {
  font-size: 0.82rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: 0.03em;
  white-space: nowrap;
}
.shop-toolbar__sort select {
  border: 0;
  background: transparent;
  color: #1f2937;
  font-size: 0.88rem;
  min-width: 170px;
  outline: none;
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
  margin: 0;
  color: #4b5563;
  font-size: 0.96rem;
  font-weight: 500;
  letter-spacing: 0.01em;
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
.homepage-products__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.homepage-products__title h2 {
  margin: 0; font-size: clamp(1.65rem, 3vw, 2.35rem); line-height: 1.04;
}
.homepage-products__mobile-view-toggle {
  display: none;
}
.homepage-products__view-mode {
  border: 1px solid #cfd7e5;
  background: #ffffff;
  color: #101722;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(14, 32, 63, 0.08);
}
.homepage-products__view-mode.is-active {
  border-color: #0f223f;
  box-shadow: 0 6px 14px rgba(15, 34, 63, 0.14);
}
.homepage-products__view-mode-image {
  width: 18px;
  height: 18px;
  object-fit: contain;
  display: block;
}
.homepage-products__view-icon {
  display: grid;
  align-items: center;
  justify-items: center;
}
.homepage-products__view-icon--list {
  grid-template-columns: 1fr;
  gap: 3px;
}
.homepage-products__view-icon--list span {
  width: 16px;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
}
.homepage-products__view-icon--grid {
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
}
.homepage-products__view-icon--grid span {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  background: currentColor;
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
.homepage-products__view-all--below {
  justify-self: center;
  margin-top: 2px;
}
.homepage-products__stack {
  display: grid; gap: 22px;
}
.homepage-products__section {
  display: grid; gap: 14px;
}
.homepage-products__rail-wrap {
  position: relative;
  width: 100%;
  min-width: 0;
}
.homepage-products__rail-controls {
  display: none;
}
.homepage-products__rail-arrow {
  display: none;
}
.homepage-products__section-head {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 14px;
}
.homepage-products__section-head h3 {
  margin: 0 0 6px; font-size: clamp(1.15rem, 2vw, 1.55rem);
}
.homepage-products__section-head .hero-copy {
  margin: 0; max-width: 72ch;
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
.product-card--home,
.product-card--related {
}
.product-card--catalog,
.product-card--home,
.product-card--related {
  contain: none;
  backface-visibility: visible;
  -webkit-backface-visibility: visible;
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
  position: relative;
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
.product-card__image {
  transition: opacity 280ms ease, transform 280ms ease;
}
.product-card__image--secondary {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
}
.product-card__placeholder {
  width: 100%; height: 100%; min-height: 180px; display: grid; place-items: center; color: var(--muted);
}
.product-card__placeholder--image {
  background: linear-gradient(180deg, #faf6ef 0%, #f1e8db 100%);
  color: transparent;
}
.homepage-products,
.category-showcase,
.cart-layout,
.wishlist-shell,
.orders-shell,
.account-dashboard,
.contact-cards,
.contact-map-section,
.contact-highlights,
.faq-showcase,
.about-story,
.about-showcase,
.about-services,
.about-reasons,
.about-core-values,
.policy-shell,
.static-content-page {
  content-visibility: visible;
  contain: none;
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
  font-size: 0.98rem; font-weight: 800; color: #1f1d1b;
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
.product-card__icon-fallback {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: rgba(33, 82, 59, 0.16);
  display: inline-block;
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
  .product-card__image--primary.has-hover-image {
    opacity: 1;
  }
  .product-card:hover .product-card__image--primary.has-hover-image,
  .product-card:focus-within .product-card__image--primary.has-hover-image {
    opacity: 0;
    transform: scale(1.01);
  }
  .product-card:hover .product-card__image--secondary,
  .product-card:focus-within .product-card__image--secondary {
    opacity: 1;
    transform: scale(1.01);
  }
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
  width: 46px;
  height: 46px;
  border: 1px solid #d4deef;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  color: #0f2347;
  font-size: 1.55rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 10px 24px rgba(15, 35, 71, 0.16);
}
.product-gallery__stage-arrow:hover {
  border-color: #0d56da;
  color: #0d56da;
}
.product-gallery__stage-arrow--left {
  left: -22px;
}
.product-gallery__stage-arrow--right {
  right: -22px;
}
.product-gallery__selector {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) 36px;
  gap: 12px;
  align-items: center;
}
.product-gallery__arrow {
  border: 1px solid #d4deef;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  color: #0f2347;
  font-size: 1.35rem;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  min-height: 36px;
  box-shadow: 0 8px 16px rgba(15, 35, 71, 0.14);
}
.product-gallery__arrow:hover {
  border-color: #0d56da;
  color: #0d56da;
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
  background: #0d56da !important;
  color: #ffffff !important;
  box-shadow: 0 14px 32px rgba(13, 86, 218, 0.2);
}
.product-summary__cart:hover {
  background: #0b4cc2 !important;
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
  width: 46px;
  height: 46px;
  border: 1px solid #d4deef;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  color: #0f2347;
  font-size: 1.55rem;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 24px rgba(15, 35, 71, 0.16);
}
.product-preview__arrow:hover {
  border-color: #0d56da;
  color: #0d56da;
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
.product-review-form__toggle {
  width: 100%;
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid #e8e2d8;
  background: #ffffff;
  color: #1f1d1b;
  padding: 0 16px;
  font-size: 1.14rem;
  font-weight: 700;
  cursor: pointer;
}
.product-review-form__toggle-icon {
  font-size: 1.6rem;
  line-height: 1;
  color: #0d56da;
}
.product-review-form__body {
  display: grid;
  gap: 14px;
}
.product-review-form__body > p {
  margin: 0;
  color: var(--muted);
}
.product-review-form label {
  display: grid;
  gap: 8px;
}
.product-review-form label span {
  color: var(--muted);
  font-size: 0.84rem;
}
.product-review-form__rating {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.product-review-form__star {
  width: 46px;
  height: 46px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #c2c8d8;
  font-size: 2rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 160ms ease, color 160ms ease, background 160ms ease;
}
.product-review-form__star:hover,
.product-review-form__star:focus-visible {
  color: #f0bf3f;
  background: rgba(240, 191, 63, 0.12);
  transform: translateY(-1px);
  outline: none;
}
.product-review-form__star.is-active {
  color: #f0bf3f;
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
  background: linear-gradient(135deg, #0d56da, #0a43ac);
  color: #ffffff;
  box-shadow: 0 14px 32px rgba(13, 86, 218, 0.22);
}
.product-review-form__submit:hover {
  background: linear-gradient(135deg, #0b4cc2, #083a94);
}
.related-products {
  margin-top: 44px;
  display: grid;
  gap: 18px;
  overflow: visible;
  min-width: 0;
}
.related-products__header {
  width: 100%;
  text-align: center;
  display: grid;
  justify-items: center;
  gap: 8px;
  overflow: visible;
  min-width: 0;
}
.related-products__header h2 {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2rem);
  text-align: center;
  white-space: normal;
  overflow: visible;
  word-break: keep-all;
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
.related-products__rail-wrap {
  position: relative;
  width: 100%;
  min-width: 0;
  isolation: isolate;
}
.related-products__grid.related-products__rail {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 2px 48px 10px;
  gap: 14px;
  scroll-padding-inline: 48px;
}
.related-products__grid.related-products__rail::-webkit-scrollbar {
  display: none;
}
.related-products__item {
  flex: 0 0 clamp(220px, 30vw, 268px);
  min-width: 0;
  scroll-snap-align: start;
  padding: 0;
}
.related-products__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  border: 1px solid #d8e1f0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.94);
  color: #0e203f;
  font-size: 1.5rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 10px 22px rgba(10, 31, 63, 0.15);
}
.related-products__arrow:hover {
  border-color: #0d56da;
  color: #0d56da;
}
.related-products__arrow--left {
  left: 0;
}
.related-products__arrow--right {
  right: 0;
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
  border: 0;
  background: transparent;
  color: #0d56da;
  cursor: pointer;
  width: auto;
  height: auto;
  padding: 0;
  border-radius: 0;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.2;
}
.cart-row__remove svg {
  width: 14px;
  height: 14px;
}
.cart-row__remove:hover {
  color: #0a43ad;
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
  border: 1px solid #e6dfd2;
  background: #fff;
  color: #1b1916;
  font-size: 0.84rem;
  font-weight: 700;
  line-height: 1.1;
  cursor: pointer;
  min-height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.wishlist-row__remove svg {
  width: 15px;
  height: 15px;
}
.wishlist-row__remove:hover {
  border-color: #0d56da;
  color: #0d56da;
  background: rgba(13, 86, 218, 0.05);
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
}
.empty-state .primary-link:hover,
.empty-state .primary-button:hover {
  background:
    radial-gradient(circle at 76% 18%, rgba(255, 255, 255, 0.14), transparent 34%),
    linear-gradient(135deg, #0b4dac 0%, #0a4fcf 45%, #0a4aa8 100%) !important;
}
.wishlist-empty .primary-link,
.cart-empty .primary-link {
  background:
    radial-gradient(circle at 76% 18%, rgba(255, 255, 255, 0.14), transparent 34%),
    linear-gradient(135deg, #0b4dac 0%, #0a4fcf 45%, #0a4aa8 100%) !important;
  color: #ffffff !important;
  box-shadow: 0 14px 32px rgba(10, 79, 207, 0.22);
}
.wishlist-empty .primary-link:hover,
.cart-empty .primary-link:hover {
  background:
    radial-gradient(circle at 76% 18%, rgba(255, 255, 255, 0.14), transparent 34%),
    linear-gradient(135deg, #0b4dac 0%, #0a4fcf 45%, #0a4aa8 100%) !important;
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
  display: grid;
  gap: 4px;
  cursor: pointer;
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
}
.auth-submit:disabled {
  opacity: 0.72;
  cursor: wait;
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
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.auth-hp-head-spacer {
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
}
.auth-hp-logo-wrap {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #dde3ee;
}
.auth-hp-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left center;
  aspect-ratio: auto !important;
}
.auth-hp-head a {
  color: #0d56da;
  font-weight: 500;
  font-size: 0.92rem;
  white-space: nowrap;
  margin-left: auto;
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
}
.auth-hp-btn--primary {
  background: #0d56da;
  border-color: #0d56da;
  color: #fff;
}
.auth-hp-btn:disabled {
  opacity: 0.72;
  cursor: wait;
}
.auth-hp-link-row {
  justify-self: center;
  color: #0d56da;
  text-decoration: none;
  text-underline-offset: 2px;
  font-weight: 500;
}
.auth-hp-link-row:hover {
  text-decoration: underline;
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
  transition: color 140ms ease, text-decoration-color 140ms ease;
}
.auth-hp-privacy:hover {
  color: #0d56da;
  text-decoration: underline;
  text-underline-offset: 2px;
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
.footer-grid ul, .admin-nav { padding: 0; margin: 0; list-style: none; display: grid; gap: 10px; color: var(--muted); }
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
.toast-stack { position: fixed; right: 16px; bottom: 16px; z-index: 40; display: grid; gap: 10px; }
.toast { min-width: 220px; max-width: 360px; padding: 12px 14px; border-radius: 16px; color: white; box-shadow: var(--shadow); }
.toast--success { background: #0a9b8a; }
.toast--info { background: #0f62fe; }
.toast--warning { background: #b7791f; }
.toast--error { background: var(--danger); }
.admin-layout {
  grid-template-columns: 240px 1fr;
  align-items: start;
  max-width: 100%;
  overflow-x: clip;
}
.admin-layout > * {
  min-width: 0;
}
.admin-nav {
  position: sticky;
  top: 96px;
  background: white; border: 1px solid var(--line); border-radius: 24px; padding: 18px; box-shadow: var(--shadow);
}
.admin-nav a { padding: 12px 14px; border-radius: 14px; color: var(--muted); text-decoration: none; font-weight: 800; }
.admin-nav a:hover, .admin-nav a.active { background: rgba(24, 79, 39, 0.1); color: #184f27; }
.admin-manager {
  min-width: 0;
  display: grid;
  gap: 18px;
  max-width: 100%;
}
.admin-manager > .panel,
.admin-viz-grid,
.admin-viz-card,
.admin-toolbar,
.admin-hero {
  min-width: 0;
  max-width: 100%;
}
.admin-state {
  display: grid;
  gap: 12px;
}
.admin-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px;
  align-items: center;
  background:
    radial-gradient(circle at 86% 12%, rgba(217, 164, 65, 0.22), transparent 28%),
    linear-gradient(135deg, #fff 0%, #fffaf1 48%, rgba(24, 79, 39, 0.1) 100%);
}
.admin-hero h1,
.admin-create-panel h2,
.admin-record h3,
.admin-stat-card strong {
  margin: 0;
}
.admin-hero p,
.admin-record p,
.admin-state p,
.admin-stat-card p {
  margin: 0;
  color: var(--muted);
}
.admin-hero__badge {
  min-width: 112px;
  aspect-ratio: 1;
  border-radius: 32px;
  display: grid;
  place-items: center;
  text-align: center;
  background: #184f27;
  color: #fff;
  box-shadow: 0 24px 60px rgba(24, 79, 39, 0.22);
}
.admin-hero__badge strong {
  font-size: clamp(1.8rem, 4vw, 3rem);
  line-height: 1;
}
.admin-hero__badge span {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.admin-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.admin-toolbar .field {
  min-width: min(360px, 100%);
  flex: 1 1 260px;
}
.admin-toolbar__filter.field {
  min-width: 180px;
  flex: 0 1 220px;
}
.admin-toolbar--stats {
  justify-content: flex-start;
}
.admin-create-panel,
.admin-form,
.admin-record-list,
.admin-record {
  display: grid;
  gap: 14px;
}
.admin-form {
  grid-template-columns: minmax(0, 1fr);
}
.admin-form__split,
.admin-form--inline {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.admin-form--inline {
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  align-items: end;
}
.admin-check {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-weight: 800;
}
.admin-check-group {
  margin: 0;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(24, 79, 39, 0.14);
  background: rgba(24, 79, 39, 0.03);
}
.admin-check-group legend {
  padding: 0 8px;
  color: #184f27;
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.admin-check-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 8px;
}
.admin-check--box {
  padding: 8px 10px;
  border-radius: 10px;
  background: #fff;
}
.admin-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.admin-stat-card {
  display: grid;
  gap: 8px;
}
.admin-stat-card span {
  color: var(--muted);
  font-weight: 800;
}
.admin-stat-card strong {
  color: #184f27;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  overflow-wrap: anywhere;
}
.admin-record {
  border-color: rgba(24, 79, 39, 0.14);
}
.admin-record__head,
.admin-record__main,
.admin-record__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
}
.admin-record__main {
  grid-template-columns: 96px minmax(0, 1fr);
}
.admin-record__image {
  width: 96px;
  height: 96px;
  border: 1px solid rgba(24, 79, 39, 0.12);
  border-radius: 22px;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: #fffaf1;
  color: var(--muted);
  font-size: 0.8rem;
  text-align: center;
}
.admin-record__image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.admin-record__items,
.admin-chip-row,
.admin-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}
.admin-record__items {
  color: var(--muted);
}
.admin-record__items--order {
  align-items: flex-start;
}
.admin-record__items span {
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(24, 79, 39, 0.08);
}
.admin-order-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.admin-order-info,
.admin-order-proof {
  display: grid;
  gap: 8px;
  padding: 12px;
  border: 1px solid rgba(232, 224, 212, 0.95);
  border-radius: 14px;
  background: #fff;
}
.admin-order-info h4,
.admin-order-proof h4 {
  margin: 0;
  font-size: 0.95rem;
}
.admin-order-info p,
.admin-order-proof p {
  margin: 0;
  font-size: 0.88rem;
  color: var(--muted);
  overflow-wrap: anywhere;
}
.admin-order-proof__image {
  display: block;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(24, 79, 39, 0.12);
  background: #fffaf1;
}
.admin-order-proof__image img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}
.admin-meta-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
.admin-meta-grid span {
  display: grid;
  gap: 4px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(24, 79, 39, 0.06);
  color: var(--muted);
}
.admin-meta-grid strong {
  color: var(--text);
  overflow-wrap: anywhere;
}
.admin-collapsible {
  gap: 0;
  overflow: hidden;
}
.admin-collapsible__header {
  width: 100%;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  padding: 0;
  cursor: pointer;
}
.admin-collapsible__header h2 {
  margin: 0;
}
.admin-collapsible__icon {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: rgba(24, 79, 39, 0.08);
  color: #184f27;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1;
}
.admin-collapsible__body {
  margin-top: 12px;
}
.admin-review-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.admin-review-rating span {
  color: #c9cfd9;
  font-size: 1rem;
  line-height: 1;
}
.admin-review-rating span.is-filled {
  color: #f0bf3f;
}
.admin-review-rating strong {
  margin-left: 6px;
  color: #1f2937;
  font-size: 0.88rem;
}
.admin-review-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.admin-support-ticket {
  gap: 12px;
  background: #ffffff;
  border-color: var(--line);
}
.admin-support-ticket__summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px;
  border-bottom: 1px solid var(--line);
}
.admin-support-ticket__summary::-webkit-details-marker {
  display: none;
}
.admin-support-ticket__summary-copy strong {
  display: block;
  color: #0f172a;
  font-size: 1rem;
}
.admin-support-ticket__summary-copy p {
  margin: 4px 0 0;
  color: #475569;
  font-size: 0.9rem;
}
.admin-support-ticket__summary-meta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.admin-support-ticket__summary-meta small {
  color: #64748b;
  font-size: 0.78rem;
}
.admin-support-ticket__body {
  display: grid;
  gap: 12px;
  padding: 14px;
}
.admin-support-ticket__meta {
  gap: 8px;
}
.admin-support-ticket__message {
  display: grid;
  gap: 10px;
  padding: 14px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}
.admin-support-ticket__message h4 {
  margin: 0;
  font-size: 0.92rem;
  color: #0f172a;
}
.admin-support-ticket__message p {
  color: #1e293b;
}
.admin-support-ticket__image {
  display: block;
  width: min(340px, 100%);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(24, 79, 39, 0.16);
}
.admin-support-ticket__image img {
  width: 100%;
  height: 170px;
  object-fit: cover;
}
.admin-support-ticket__thread {
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 14px;
  background: #f8fafc;
  overflow: hidden;
}
.admin-support-ticket__thread > summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  font-weight: 700;
  color: #0f172a;
  border-bottom: 1px solid #e2e8f0;
}
.admin-support-ticket__thread > summary span {
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 700;
}
.admin-support-ticket__thread > summary::-webkit-details-marker {
  display: none;
}
.admin-support-ticket__thread-list {
  display: grid;
  gap: 10px;
  padding: 12px;
  max-height: 320px;
  overflow-y: auto;
}
.admin-support-ticket__thread-item {
  display: grid;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #dbe4ef;
  width: min(88%, 560px);
}
.admin-support-ticket__thread-item.is-user {
  justify-self: start;
  background: #e8f0ff;
}
.admin-support-ticket__thread-item.is-admin {
  justify-self: end;
  background: #ffffff;
}
.admin-support-ticket__thread-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.admin-support-ticket__thread-head strong {
  font-size: 0.84rem;
  color: #0f172a;
}
.admin-support-ticket__thread-head span {
  color: #64748b;
  font-size: 0.78rem;
}
.admin-support-ticket__thread-item p {
  margin: 0;
  color: #1e293b;
}
.admin-support-ticket__thread-image {
  display: block;
  width: min(230px, 100%);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(24, 79, 39, 0.15);
}
.admin-support-ticket__thread-image img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}
.admin-support-ticket__form {
  gap: 10px;
}
.admin-support-ticket__quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.admin-support-ticket__quick-replies .ghost-button {
  min-height: 34px;
  padding: 0 10px;
  font-size: 0.78rem;
  border-color: #cfd8e3;
  color: #0f172a;
  background: #ffffff;
}
.admin-support-ticket__form .field {
  border-color: #cfd8e3;
  background: #ffffff;
  color: #0f172a;
}
.admin-support-ticket__composer-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.admin-support-ticket__composer-input {
  min-height: 42px;
  max-height: 140px;
  resize: vertical;
}
.admin-support-ticket__hint {
  margin: 0;
  color: #64748b;
  font-size: 0.78rem;
}
.admin-support-ticket__submit {
  width: auto;
  min-width: 152px;
  min-height: 42px;
  padding: 0 18px;
  justify-self: start;
  font-size: 0.9rem;
}
.admin-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(26, 23, 17, 0.08);
  color: var(--text);
  font-weight: 900;
  white-space: nowrap;
}
.admin-chip.is-success { background: rgba(14, 121, 73, 0.12); color: #0e7949; }
.admin-chip.is-warning { background: rgba(217, 164, 65, 0.18); color: #8a5a00; }
.admin-chip.is-danger { background: rgba(183, 28, 28, 0.1); color: #b71c1c; }
.admin-chip.is-neutral { background: rgba(24, 79, 39, 0.08); color: #184f27; }
.admin-inline-control {
  display: grid;
  gap: 6px;
  min-width: 150px;
}
.admin-inline-control span {
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.admin-dashboard {
  display: grid;
  gap: 16px;
}
.admin-dashboard__hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: end;
}
.admin-dashboard__hero h1 {
  margin: 0;
}
.admin-dashboard__hero p {
  margin: 0;
}
.admin-dashboard__sync {
  min-width: 188px;
  display: grid;
  justify-items: end;
  gap: 6px;
}
.admin-dashboard__sync span {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(14, 121, 73, 0.12);
  color: #0e7949;
  font-size: 0.76rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.admin-dashboard__sync strong {
  color: var(--muted);
  font-size: 0.86rem;
}
.admin-dash-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.admin-dash-card {
  display: grid;
  gap: 6px;
  padding: 16px;
  border-radius: 16px;
}
.admin-dash-card p {
  margin: 0;
  color: var(--muted);
  font-size: 0.76rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.09em;
}
.admin-dash-card strong {
  font-size: clamp(1.35rem, 2vw, 1.9rem);
  line-height: 1.1;
  overflow-wrap: anywhere;
}
.admin-dash-card span {
  color: var(--muted);
  font-size: 0.84rem;
}
.admin-dash-card.is-warning {
  border-color: rgba(217, 164, 65, 0.32);
  background: rgba(217, 164, 65, 0.09);
}
.admin-dash-card.is-success {
  border-color: rgba(14, 121, 73, 0.28);
  background: rgba(14, 121, 73, 0.08);
}
.admin-dash-panels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.admin-dash-panels--overview {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.admin-dash-panel {
  display: grid;
  gap: 10px;
  padding: 16px;
  border-radius: 16px;
  align-content: start;
}
.admin-dash-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.admin-dash-panel__head h2 {
  margin: 0;
  font-size: 1.08rem;
  overflow-wrap: anywhere;
}
.admin-dash-list {
  display: grid;
  gap: 8px;
}
.admin-dash-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(232, 224, 212, 0.7);
}
.admin-dash-row:last-child {
  border-bottom: 0;
}
.admin-dash-row strong,
.admin-dash-row p {
  margin: 0;
}
.admin-dash-row strong {
  display: block;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.admin-dash-row p {
  color: var(--muted);
  font-size: 0.84rem;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.admin-dash-row > div:last-child {
  display: grid;
  gap: 6px;
  justify-items: end;
  min-width: 0;
  max-width: 100%;
}
.admin-dash-panel--users .admin-dash-list--users {
  gap: 10px;
}
.admin-dash-row--users {
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
  align-items: start;
}
.admin-dash-row--users > div:last-child {
  justify-items: start;
}
.admin-dash-row > div:last-child .admin-chip {
  max-width: 100%;
}
.admin-dash-shortcuts {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
}
.admin-dash-shortcuts h2 {
  margin: 0;
}
.admin-dash-shortcuts__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.admin-dash-shortcut {
  display: grid;
  gap: 6px;
  padding: 12px;
  border: 1px solid rgba(232, 224, 212, 0.9);
  border-radius: 14px;
  background: #fff;
  transition: border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
}
.admin-dash-shortcut strong {
  color: #184f27;
}
.admin-dash-shortcut span {
  color: var(--muted);
  font-size: 0.84rem;
}
.admin-dash-shortcut:hover {
  border-color: rgba(24, 79, 39, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(24, 79, 39, 0.08);
}
.admin-viz-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  align-items: stretch;
}
.admin-viz-card {
  border: 1px solid rgba(232, 224, 212, 0.9);
  border-radius: 14px;
  background: #fff;
  padding: 14px;
  display: grid;
  gap: 10px;
  align-content: start;
}
.admin-viz-card h3 {
  margin: 0;
  font-size: 0.95rem;
}
.admin-viz-bars {
  display: grid;
  gap: 8px;
}
.admin-viz-bars p {
  margin: 0;
  color: var(--muted);
  font-size: 0.85rem;
}
.admin-viz-bar-row {
  display: grid;
  grid-template-columns: minmax(74px, 120px) minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
}
.admin-viz-bar-row span {
  color: var(--muted);
  font-size: 0.78rem;
  text-transform: capitalize;
  min-width: 0;
  overflow-wrap: anywhere;
}
.admin-viz-bar-row strong {
  font-size: 0.82rem;
  min-width: 0;
  overflow-wrap: anywhere;
}
.admin-viz-bar-track {
  height: 8px;
  border-radius: 999px;
  background: rgba(24, 79, 39, 0.12);
  overflow: hidden;
}
.admin-viz-bar-track i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2886af, #1d59d1);
}
.admin-viz-donut-wrap {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}
.admin-viz-donut {
  width: 120px;
  height: 120px;
  transform: rotate(-90deg);
}
.admin-viz-donut circle {
  fill: none;
  stroke-width: 12;
}
.admin-viz-donut__base {
  stroke: rgba(24, 79, 39, 0.1);
}
.admin-viz-donut__slice {
  stroke-linecap: round;
}
.admin-viz-donut__slice.is-0 { stroke: #1d59d1; }
.admin-viz-donut__slice.is-1 { stroke: #2886af; }
.admin-viz-donut__slice.is-2 { stroke: #0e7949; }
.admin-viz-donut__slice.is-3 { stroke: #d9a441; }
.admin-viz-donut__slice.is-4 { stroke: #7e57c2; }
.admin-viz-donut__center {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
}
.admin-viz-donut__center strong {
  font-size: 1.2rem;
}
.admin-viz-donut__center span {
  color: var(--muted);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.admin-viz-legend {
  display: grid;
  gap: 6px;
}
.admin-viz-legend__row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
}
.admin-viz-legend__row span {
  color: var(--muted);
  font-size: 0.8rem;
  text-transform: capitalize;
}
.admin-viz-legend__row strong {
  font-size: 0.82rem;
}
.admin-viz-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  display: block;
}
.admin-viz-dot.is-0 { background: #1d59d1; }
.admin-viz-dot.is-1 { background: #2886af; }
.admin-viz-dot.is-2 { background: #0e7949; }
.admin-viz-dot.is-3 { background: #d9a441; }
.admin-viz-dot.is-4 { background: #7e57c2; }
.admin-overlay {
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: grid;
  place-items: center;
  padding: 16px;
}
.admin-overlay__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(10, 18, 32, 0.56);
}
.admin-overlay__card {
  position: relative;
  z-index: 1;
  width: min(1100px, 100%);
  max-height: min(88vh, 860px);
  overflow: auto;
  display: grid;
  gap: 14px;
}
.admin-overlay__head {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
  flex-wrap: wrap;
}
.admin-overlay__head h2,
.admin-overlay__head p {
  margin: 0;
}
.admin-overlay__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.admin-overlay__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.admin-timeline {
  display: grid;
  gap: 8px;
}
.admin-timeline__item {
  border: 1px solid rgba(232, 224, 212, 0.9);
  border-radius: 12px;
  padding: 10px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 10px;
  align-items: start;
}
.admin-timeline__item strong,
.admin-timeline__item p,
.admin-timeline__item time {
  margin: 0;
}
.admin-timeline__item p,
.admin-timeline__item time {
  color: var(--muted);
  font-size: 0.84rem;
}
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
.account-nav {
  display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px;
}
.account-nav a {
  padding: 10px 12px; border-radius: 14px; border: 1px solid var(--line); background: white; color: var(--muted);
}
.account-nav a:hover, .account-nav a.active { background: rgba(24, 79, 39, 0.1); color: #184f27; border-color: rgba(24, 79, 39, 0.28); }
.account-dashboard-shell {
  display: grid;
  gap: 10px;
}
.account-dashboard {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}
.account-dashboard__sidebar {
  display: grid;
  gap: 14px;
}
.account-dashboard__nav {
  width: 100%;
  min-height: 84px;
  padding: 0 24px;
  border-radius: 24px;
  border: 1px solid rgba(26, 23, 17, 0.12);
  background: #fff;
  color: var(--text);
  text-align: left;
  font-size: 1rem;
  font-weight: 700;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
.account-dashboard__nav.is-active {
  background: #184f27;
  border-color: #184f27;
  color: #fff;
}
.account-dashboard__content {
  min-width: 0;
}
.account-dashboard__section {
  display: grid;
  gap: 20px;
}
.account-dashboard__section-head {
  display: grid;
  gap: 8px;
}
.account-dashboard__section-head h2 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 3rem);
  line-height: 1;
}
.account-dashboard__section-head p {
  margin: 0;
  color: var(--muted);
  max-width: 720px;
}
.account-dashboard__section-head--row {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
}
.account-dashboard__form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px 28px;
}
.account-dashboard__field {
  display: grid;
  gap: 10px;
}
.account-dashboard__field span {
  font-weight: 700;
}
.account-dashboard__field--full {
  grid-column: 1 / -1;
}
.account-dashboard__submit {
  width: fit-content;
  min-width: 190px;
}
.account-dashboard__actions,
.account-dashboard__cta-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}
.account-dashboard__stack {
  display: grid;
  gap: 18px;
}
.account-dashboard .primary-button,
.account-dashboard .primary-link,
.account-dashboard__content .primary-button {
  background: linear-gradient(135deg, #1d6a33, #184f27);
  color: #ffffff;
  box-shadow: 0 14px 32px rgba(24, 79, 39, 0.22);
}
.account-dashboard__content .primary-link {
  background: linear-gradient(135deg, #1d6a33, #184f27);
  color: #ffffff;
  box-shadow: 0 14px 32px rgba(24, 79, 39, 0.22);
}
.account-dashboard .primary-button:hover,
.account-dashboard .primary-link:hover,
.account-dashboard__content .primary-button:hover {
  background: linear-gradient(135deg, #16572a, #123f1f);
}
.account-dashboard__content .primary-link:hover {
  background: linear-gradient(135deg, #16572a, #123f1f);
}
.account-support-chat {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  padding: 12px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid var(--line);
}
.account-support-chat__thread-wrap {
  min-width: 0;
  display: grid;
  grid-template-rows: auto minmax(260px, 1fr) auto;
  gap: 12px;
}
.account-support-chat__thread-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 12px 14px;
  background: #f8fafc;
}
.account-support-chat__thread-head strong {
  display: block;
  margin: 0;
  color: #0f172a;
}
.account-support-chat__thread-head p {
  margin: 4px 0 0;
  color: #475569;
  font-size: 0.9rem;
}
.account-support-chat__thread {
  display: grid;
  gap: 10px;
  max-height: 460px;
  overflow: auto;
  padding: 8px 2px;
}
.account-support-chat__bubble {
  max-width: min(84%, 620px);
  border: 1px solid #dbe4f0;
  border-radius: 14px 14px 6px 14px;
  padding: 10px 12px;
  background: #f8fafc;
  display: grid;
  gap: 8px;
}
.account-support-chat__bubble.is-user {
  justify-self: end;
  background: linear-gradient(180deg, #1e63d6, #0d56da);
  border-color: rgba(13, 86, 218, 0.45);
  border-radius: 14px 14px 14px 6px;
}
.account-support-chat__bubble.is-admin {
  justify-self: start;
  background: #f1f5f9;
}
.account-support-chat__bubble-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.account-support-chat__bubble-meta strong {
  font-size: 0.86rem;
  color: #0f172a;
}
.account-support-chat__bubble-meta span {
  font-size: 0.76rem;
  color: #64748b;
}
.account-support-chat__bubble p {
  margin: 0;
  line-height: 1.5;
  color: #0f172a;
}
.account-support-chat__bubble.is-user p,
.account-support-chat__bubble.is-user .account-support-chat__bubble-meta strong,
.account-support-chat__bubble.is-user .account-support-chat__bubble-meta span {
  color: #ffffff;
}
.account-support-chat__image {
  display: block;
  max-width: 240px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.12);
}
.account-support-chat__image img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}
.account-support-chat__composer {
  display: grid;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 10px 12px;
  background: #ffffff;
}
.account-support-chat__composer-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.account-support-chat__input {
  min-height: 48px;
  max-height: 140px;
  resize: vertical;
  border-radius: 22px;
  border-color: #cfd8e3;
  background: #ffffff;
  color: #0f172a;
  padding: 10px 14px;
  flex: 1;
}
.account-support-chat__quick {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.account-support-chat__quick .ghost-button {
  min-height: 34px;
  padding: 0 12px;
  font-size: 0.84rem;
  border-color: #c9d5e6;
  color: #0f172a;
  background: #f8fbff;
}
.account-support-chat__send {
  min-width: 72px;
  min-height: 44px;
  border-radius: 999px;
  padding: 0 14px;
  font-size: 0.95rem;
  font-weight: 800;
}
.contact-support-preview {
  display: grid;
  gap: 10px;
  border-color: rgba(13, 86, 218, 0.2);
  background: linear-gradient(180deg, #ffffff, #f8fbff);
}
.contact-support-preview h3 {
  margin: 0;
  font-size: clamp(1.2rem, 2.3vw, 1.6rem);
}
.contact-support-preview p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
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
.affiliate-hero {
  position: relative;
  overflow: hidden;
}
.affiliate-hero::before {
  content: "";
  position: absolute;
  inset: auto 8% 8% auto;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(217, 164, 65, 0.24), transparent 68%);
  animation: affiliatePulse 4s ease-in-out infinite;
}
.affiliate-hero__eyebrow {
  margin: 0 0 10px;
  color: #184f27;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.affiliate-hero__copy {
  position: relative;
  z-index: 1;
  width: min(760px, 100%);
  margin: 18px auto 0;
  color: #51483d;
  line-height: 1.8;
}
.affiliate-layout {
  display: grid;
  gap: 30px;
  animation: affiliateRise 520ms ease both;
}
.affiliate-main {
  display: grid;
  gap: 22px;
  min-width: 0;
}
.affiliate-loading,
.affiliate-empty {
  padding: 28px;
  border: 1px solid var(--line);
  background: #fff;
}
.affiliate-join-card,
.affiliate-command {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px;
  align-items: center;
  padding: clamp(24px, 4vw, 42px);
  border: 1px solid rgba(25, 79, 33, 0.16);
  background:
    radial-gradient(circle at top right, rgba(217, 164, 65, 0.18), transparent 35%),
    linear-gradient(135deg, #ffffff 0%, #fbf6ed 100%);
}
.affiliate-join-card::after,
.affiliate-command::after {
  content: "";
  position: absolute;
  inset: auto -40px -60px auto;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(25, 79, 33, 0.08);
}
.affiliate-join-card h2,
.affiliate-command h2,
.affiliate-referrals h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 3rem);
  line-height: 1;
}
.affiliate-join-card p,
.affiliate-command p,
.affiliate-referrals p,
.affiliate-empty p {
  margin: 12px 0 0;
  color: var(--muted);
  line-height: 1.7;
}
.affiliate-learn {
  display: grid;
  gap: 24px;
  padding: clamp(20px, 3.5vw, 36px);
  border: 1px solid #d5deee;
  background: var(--page-secondary, #f4f6fa);
}
.affiliate-learn h2,
.affiliate-learn h3,
.affiliate-learn h4 {
  margin: 0;
}
.affiliate-learn__header p {
  margin: 8px 0 0;
  color: var(--muted);
}
.affiliate-learn__steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.affiliate-learn__step {
  position: relative;
  display: grid;
  gap: 8px;
  padding: 18px 16px 16px;
  border: 2px solid #1d5fe7;
  border-radius: 18px;
  background: #fff;
  text-align: center;
}
.affiliate-learn__step-index {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: 2px solid #1d5fe7;
  color: #1d5fe7;
  display: grid;
  place-items: center;
  font-size: 0.78rem;
  font-weight: 800;
}
.affiliate-learn__step-icon {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  margin: 0 auto 6px;
  font-size: 1.25rem;
  background: #1d5fe7;
}
.affiliate-learn__step strong {
  font-size: clamp(1.35rem, 1.9vw, 1.85rem);
  line-height: 1.2;
  color: #0f172a;
}
.affiliate-learn__rate::after {
  content: "Never decreases.";
  display: block;
  margin-top: 6px;
  color: #4b5563;
  font-size: 0.84rem;
  font-weight: 500;
}
.affiliate-learn__step p {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}
.affiliate-learn__commission {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid #d5deee;
  border-radius: 18px;
  background: #fff;
}
.affiliate-learn__commission > p {
  margin: 0;
  color: var(--muted);
}
.affiliate-learn__commission-grid {
  display: grid;
  grid-template-columns: minmax(220px, 0.9fr) minmax(0, 1.1fr);
  gap: 14px;
  align-items: stretch;
}
.affiliate-learn__rate {
  display: inline-grid;
  flex-direction: column;
  width: 100%;
  align-content: center;
  justify-items: center;
  gap: 2px;
  padding: 18px 16px;
  border-radius: 16px;
  border: 2px solid #1d5fe7;
  background: #fff;
  color: #1d5fe7;
  font-weight: 900;
  font-size: 2rem;
  line-height: 1;
}
.affiliate-learn__rate span {
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.affiliate-learn__commission ul,
.affiliate-learn__why ul {
  margin: 0;
  padding-left: 0;
  display: grid;
  gap: 10px;
  list-style: none;
}
.affiliate-learn__commission li,
.affiliate-learn__why li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 10px 12px;
  border: 1px solid #d9e0ed;
  border-radius: 12px;
  background: #f9fbff;
}
.affiliate-learn__commission li::before,
.affiliate-learn__why li::before {
  content: "✓";
  color: #099240;
  font-weight: 900;
  line-height: 1.2;
}
.affiliate-learn__note {
  margin: 0;
  border-left: 3px solid #1d5fe7;
  padding: 6px 0 6px 12px;
  background: #f5f8ff;
}
.affiliate-learn__tiers,
.affiliate-learn__examples,
.affiliate-learn__why,
.affiliate-learn__journey,
.affiliate-learn__faq {
  display: grid;
  gap: 12px;
}
.affiliate-learn__tier-grid,
.affiliate-learn__example-grid,
.affiliate-learn__journey-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}
.affiliate-learn__tier-card,
.affiliate-learn__example-grid article,
.affiliate-learn__journey-grid article {
  display: grid;
  gap: 8px;
  padding: 14px;
  border: 2px solid #d5deee;
  border-radius: 16px;
  background: #fff;
}
.affiliate-learn__tier-card h4 {
  display: flex;
  align-items: center;
  gap: 8px;
}
.affiliate-learn__tier-card h4 span {
  font-size: 1.1rem;
}
.affiliate-learn__tier-card.is-bronze {
  border-color: #d97706;
}
.affiliate-learn__tier-card.is-silver {
  border-color: #94a3b8;
}
.affiliate-learn__tier-card.is-gold {
  border-color: #eab308;
}
.affiliate-learn__tier-deals {
  margin: 0 0 2px auto;
  width: fit-content;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d5deee;
  background: #f8fafc;
  color: #1d5fe7;
  font-weight: 700;
}
.affiliate-learn__tier-card ul {
  margin: 0;
  padding-left: 0;
  display: grid;
  gap: 5px;
  list-style: none;
}
.affiliate-learn__tier-card li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.affiliate-learn__tier-card li::before {
  content: "✓";
  color: #099240;
  font-weight: 900;
}
.affiliate-learn__example-grid article span,
.affiliate-learn__journey-grid article span {
  color: var(--muted);
}
.affiliate-learn__example-grid article strong {
  color: #099240;
}
.affiliate-learn__bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.affiliate-learn__examples,
.affiliate-learn__why {
  border: 1px solid #d5deee;
  border-radius: 16px;
  background: #fff;
  padding: 16px;
}
.affiliate-learn__examples h3 {
  padding: 10px 12px;
  margin: -16px -16px 12px;
  border-radius: 14px 14px 0 0;
  background: linear-gradient(90deg, #1d5fe7, #2f78ff);
  color: #fff;
}
.affiliate-learn__journey {
  border: 1px solid #d5deee;
  border-radius: 16px;
  background: #fff;
  padding: 16px;
}
.affiliate-learn__faq-item {
  border: 1px solid #d5deee;
  border-radius: 12px;
  background: #fff;
}
.affiliate-learn__faq-item summary {
  cursor: pointer;
  padding: 12px 14px;
  font-weight: 700;
}
.affiliate-learn__faq-item p {
  margin: 0;
  padding: 0 14px 14px;
  color: var(--muted);
  line-height: 1.65;
}
.affiliate-badge,
.affiliate-status {
  display: inline-flex;
  width: fit-content;
  min-height: 34px;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.affiliate-badge {
  margin-bottom: 14px;
  background: rgba(25, 79, 33, 0.1);
  color: #184f27;
}
.affiliate-primary {
  position: relative;
  z-index: 1;
  display: inline-flex;
  min-height: 56px;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  border-radius: 999px;
  border: 1px solid #103918;
  background: #184f27;
  color: #fff;
  font-weight: 800;
  box-shadow: 0 18px 38px rgba(24, 79, 39, 0.18);
}
.affiliate-primary:disabled {
  opacity: 0.7;
  cursor: wait;
}
.affiliate-command__intro {
  position: relative;
  z-index: 1;
}
.affiliate-code-card {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 14px;
  min-width: min(360px, 100%);
  padding: 24px;
  border: 1px solid rgba(25, 79, 33, 0.18);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: var(--shadow);
}
.affiliate-code-card span,
.affiliate-progress span,
.affiliate-referral-row span {
  color: var(--muted);
  font-size: 0.9rem;
}
.affiliate-code-card strong {
  font-size: clamp(2rem, 4vw, 3.5rem);
  letter-spacing: 0.08em;
}
.affiliate-code-card__actions,
.affiliate-referrals__head {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.affiliate-code-card__actions button {
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid #184f27;
  background: #fff;
  color: #184f27;
  font-weight: 800;
}
.affiliate-code-card__actions button:first-child {
  background: #184f27;
  color: #fff;
}
.affiliate-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px;
}
.affiliate-stats article {
  display: grid;
  gap: 10px;
  min-width: 0;
  padding: 20px;
  min-height: 158px;
  border: 2px solid var(--line);
  background: #fff;
  animation: affiliateRise 520ms ease both;
}
.affiliate-stats article:nth-child(2) { animation-delay: 80ms; }
.affiliate-stats article:nth-child(3) { animation-delay: 140ms; }
.affiliate-stats article:nth-child(4) { animation-delay: 200ms; }
.affiliate-stats article:nth-child(5) { animation-delay: 260ms; }
.affiliate-stats article:nth-child(6) { animation-delay: 320ms; }
.affiliate-stats article.is-green {
  border-color: #184f27;
}
.affiliate-stats article.is-gold,
.affiliate-stats article.is-amber {
  border-color: #c58310;
}
.affiliate-stats article.is-emerald {
  border-color: #178f55;
}
.affiliate-stats article.is-blue {
  border-color: #0f7ab8;
}
.affiliate-stats span {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-weight: 800;
  min-width: 0;
  overflow-wrap: anywhere;
}
.affiliate-stats strong {
  max-width: 100%;
  color: #12100d;
  font-size: clamp(1.45rem, 2.2vw, 2.35rem);
  line-height: 1.05;
  overflow-wrap: anywhere;
}
.affiliate-stats small {
  color: #5f5547;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.affiliate-stat-icon,
.affiliate-tier-card__icon {
  display: inline-grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 10px;
  background: rgba(24, 79, 39, 0.1);
  color: #184f27;
  flex: 0 0 auto;
}
.affiliate-stat-icon svg,
.affiliate-tier-card__icon svg,
.affiliate-benefit-card__icon svg {
  width: 18px;
  height: 18px;
}
.affiliate-stats article.is-gold .affiliate-stat-icon,
.affiliate-stats article.is-amber .affiliate-stat-icon {
  background: rgba(197, 131, 16, 0.14);
  color: #a46905;
}
.affiliate-stats article.is-emerald .affiliate-stat-icon {
  background: rgba(23, 143, 85, 0.12);
  color: #178f55;
}
.affiliate-stats article.is-blue .affiliate-stat-icon {
  background: rgba(15, 122, 184, 0.12);
  color: #0f7ab8;
}
.affiliate-tier-card {
  display: grid;
  gap: 20px;
  padding: clamp(24px, 4vw, 36px);
  border: 1px solid rgba(24, 79, 39, 0.22);
  border-top: 4px solid #c58310;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.9)),
    radial-gradient(circle at top right, rgba(217, 164, 65, 0.18), transparent 32%);
  box-shadow: var(--shadow);
}
.affiliate-tier-card__head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;
}
.affiliate-tier-card__head h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2.5rem);
  line-height: 1.1;
  overflow-wrap: anywhere;
}
.affiliate-tier-card__head p {
  margin: 10px 0 0;
  color: #463b2d;
  font-weight: 700;
  overflow-wrap: anywhere;
}
.affiliate-tier-pill {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding: 0 22px;
  border-radius: 999px;
  background: #184f27;
  color: #fff;
  font-weight: 900;
  text-transform: uppercase;
}
.affiliate-tier-card__amount {
  color: #184f27;
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1;
}
.affiliate-tier-track {
  position: relative;
  height: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: #e8e0d4;
}
.affiliate-tier-track span {
  position: relative;
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #184f27, #d9a441);
  overflow: hidden;
  animation: affiliateFill 1.15s cubic-bezier(0.2, 0.9, 0.24, 1) both;
}
.affiliate-tier-track span::after,
.affiliate-progress__track span::after,
.affiliate-analytics__row i::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.48), transparent);
  transform: translateX(-120%);
  animation: affiliateBarShine 1.55s ease 620ms both;
}
.affiliate-tier-milestones {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  color: #5f5547;
  font-size: 0.9rem;
  text-align: center;
}
.affiliate-tier-milestones span {
  position: relative;
  padding-top: 18px;
  min-width: 0;
  overflow-wrap: anywhere;
}
.affiliate-tier-milestones span::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d9a441;
  transform: translateX(-50%);
}
.affiliate-tier-milestones span.is-active {
  color: #184f27;
  font-weight: 900;
}
.affiliate-tier-milestones span.is-active::before {
  background: #184f27;
}
.affiliate-insights-grid,
.affiliate-analytics-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.affiliate-breakdown,
.affiliate-benefits,
.affiliate-analytics {
  display: grid;
  gap: 18px;
}
.affiliate-breakdown h2,
.affiliate-benefits h2,
.affiliate-analytics h2 {
  margin: 0;
}
.affiliate-breakdown dl {
  display: grid;
  margin: 0;
}
.affiliate-breakdown dl > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-top: 1px solid var(--line);
}
.affiliate-breakdown dt {
  color: #40382d;
}
.affiliate-breakdown dd {
  margin: 0;
  font-weight: 900;
}
.affiliate-benefit-card {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  padding: 18px;
  border: 1px solid rgba(24, 79, 39, 0.14);
  background: #fbf7ee;
}
.affiliate-benefit-card__icon {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  border-radius: 18px;
  background: #184f27;
  color: #fff;
  font-weight: 900;
}
.affiliate-benefit-card strong {
  display: block;
  font-size: clamp(1.4rem, 2vw, 2rem);
}
.affiliate-benefit-card p,
.affiliate-benefit-card small {
  display: block;
  margin: 8px 0 0;
  color: #5f5547;
}
.affiliate-benefits__note {
  margin: 0;
  padding: 16px 18px;
  border-left: 4px solid #184f27;
  background: rgba(24, 79, 39, 0.08);
  color: #184f27;
  font-weight: 900;
}
.affiliate-analytics__row {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  animation: affiliateRise 560ms ease both;
}
.affiliate-analytics__row:nth-of-type(2) { animation-delay: 80ms; }
.affiliate-analytics__row:nth-of-type(3) { animation-delay: 140ms; }
.affiliate-analytics__row div {
  position: relative;
  height: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: #e8e0d4;
}
.affiliate-analytics__row i {
  position: relative;
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #184f27;
  overflow: hidden;
  transform-origin: left;
  animation: affiliateFill 1s cubic-bezier(0.2, 0.9, 0.24, 1) both;
}
.affiliate-analytics__row.is-pending i {
  background: #d9a441;
}
.affiliate-analytics__row.is-cancelled i {
  background: #a62c22;
}
.affiliate-analytics__row strong {
  white-space: nowrap;
}
.affiliate-muted {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}
.affiliate-progress {
  display: grid;
  gap: 16px;
}
.affiliate-progress div:first-child {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.affiliate-progress__track {
  position: relative;
  height: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: #eee7da;
}
.affiliate-progress__track span {
  position: relative;
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #184f27, #d9a441);
  overflow: hidden;
  animation: affiliateFill 1s cubic-bezier(0.2, 0.9, 0.24, 1) both;
}
.affiliate-referrals {
  display: grid;
  gap: 20px;
}
.affiliate-earning-history {
  overflow: hidden;
}
.affiliate-earning-history__scroll {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-color: rgba(24, 79, 39, 0.45) rgba(24, 79, 39, 0.08);
  scrollbar-width: thin;
}
.affiliate-earning-history__scroll:focus {
  outline: 2px solid rgba(24, 79, 39, 0.32);
  outline-offset: 4px;
}
.affiliate-earning-table {
  width: 100%;
  min-width: 880px;
  border-collapse: collapse;
}
.affiliate-earning-table th,
.affiliate-earning-table td {
  padding: 16px 10px;
  border-bottom: 1px solid var(--line);
  text-align: left;
  vertical-align: middle;
}
.affiliate-earning-table th {
  color: #12100d;
  font-size: 0.95rem;
  font-weight: 900;
  white-space: nowrap;
}
.affiliate-earning-table td {
  color: #231d16;
  font-weight: 700;
}
.affiliate-earning-table tbody tr {
  animation: affiliateTableRow 520ms ease both;
}
.affiliate-earning-table tbody tr:nth-child(2) { animation-delay: 70ms; }
.affiliate-earning-table tbody tr:nth-child(3) { animation-delay: 120ms; }
.affiliate-earning-table tbody tr:nth-child(4) { animation-delay: 170ms; }
.affiliate-earning-table tbody tr:nth-child(5) { animation-delay: 220ms; }
.affiliate-earning-table tbody tr:nth-child(6) { animation-delay: 270ms; }
.affiliate-earning-table tbody tr:nth-child(7) { animation-delay: 320ms; }
.affiliate-earning-table tbody tr:nth-child(8) { animation-delay: 370ms; }
.affiliate-earning-table td:first-child {
  font-weight: 900;
}
.affiliate-earning-table td strong,
.affiliate-earning-table td span {
  display: block;
}
.affiliate-earning-table td span:not(.affiliate-status) {
  margin-top: 4px;
  color: var(--muted);
  font-size: 0.86rem;
  font-weight: 600;
}
.affiliate-referrals__list {
  display: grid;
}
.affiliate-referral-row {
  display: grid;
  grid-template-columns: minmax(110px, 0.7fr) minmax(0, 1.3fr) minmax(120px, 0.7fr) minmax(120px, 0.8fr) auto;
  gap: 16px;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}
.affiliate-referral-row:last-child {
  border-bottom: 0;
}
.affiliate-referral-row > div {
  display: grid;
  gap: 4px;
  min-width: 0;
}
.affiliate-status.is-earned {
  background: rgba(25, 79, 33, 0.1);
  color: #184f27;
}
.affiliate-status.is-pending {
  background: rgba(217, 164, 65, 0.14);
  color: #8a5d07;
}
.affiliate-status.is-cancelled {
  background: rgba(192, 57, 43, 0.1);
  color: #a62c22;
}
@keyframes affiliateRise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes affiliatePulse {
  0%, 100% {
    transform: scale(0.9);
    opacity: 0.65;
  }
  50% {
    transform: scale(1.12);
    opacity: 1;
  }
}
@keyframes affiliateFill {
  from {
    transform: scaleX(0);
    transform-origin: left;
  }
  to {
    transform: scaleX(1);
    transform-origin: left;
  }
}
@keyframes affiliateBarShine {
  from {
    transform: translateX(-120%);
  }
  to {
    transform: translateX(120%);
  }
}
@keyframes affiliateTableRow {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
  .home-logo-marquee__track,
  .affiliate-tier-track span,
  .affiliate-progress__track span,
  .affiliate-analytics__row,
  .affiliate-analytics__row i,
  .affiliate-earning-table tbody tr {
    animation: none;
  }
  .affiliate-tier-track span::after,
  .affiliate-progress__track span::after,
  .affiliate-analytics__row i::after {
    display: none;
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
  .product-card__media img,
  .category-tile__image,
  .brand-mark__image {
    transform: none !important;
    -webkit-transform: none !important;
    backface-visibility: visible !important;
    -webkit-backface-visibility: visible !important;
  }
  .home-logo-marquee__track {
    animation-duration: 42s !important;
    will-change: auto;
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
  .order-complete--arriving .hero-actions,
  .affiliate-tier-track span,
  .affiliate-progress__track span,
  .affiliate-analytics__row,
  .affiliate-analytics__row i,
  .affiliate-earning-table tbody tr {
    animation: none !important;
  }
  .mobile-menu,
  .nav-dropdown__panel,
  .desktop-search-tray,
  .desktop-search-tray__form .search-input,
  .product-card,
  .product-card__footer--reveal,
  .shop-filter-option,
  .primary-link,
  .ghost-link,
  .icon-button {
    transition-duration: 120ms !important;
  }
  .product-card,
  .category-tile,
  .shop-filter-option {
    transform: none !important;
  }
  .category-tile__image--laptops-desktops {
    object-position: center center;
    padding: 12px;
  }
}
.account-dashboard__empty {
  display: grid;
  gap: 10px;
}
.account-dashboard__empty h3,
.account-address-card strong {
  margin: 0;
}
.account-dashboard__empty p,
.account-address-card p {
  margin: 0;
  color: var(--muted);
}
.account-address-card {
  display: grid;
  gap: 8px;
}
.account-mini-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.account-mini-card {
  display: grid;
  gap: 8px;
}
.account-mini-card span {
  color: var(--muted);
  font-size: 0.9rem;
}
.account-mini-card strong {
  font-size: 1.5rem;
}
.account-mini-card p {
  margin: 0;
  color: var(--muted);
}
.account-mini-row,
.account-review-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
}
.account-mini-row__product,
.account-review-card__product {
  min-width: 0;
  display: grid;
  grid-template-columns: 78px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  color: inherit;
  text-decoration: none;
}
.account-mini-row__product:hover strong,
.account-mini-row__product:focus-visible strong,
.account-review-card__product:hover strong,
.account-review-card__product:focus-visible strong {
  color: #184f27;
}
.account-mini-row__thumb,
.account-review-card__thumb,
.account-order-card__thumb {
  width: 78px;
  height: 78px;
  border-radius: 18px;
  overflow: hidden;
  background: #fbf6ee;
  display: grid;
  place-items: center;
}
.account-mini-row__thumb img,
.account-review-card__thumb img,
.account-order-card__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.account-mini-row__copy,
.account-review-card__copy,
.account-order-card__copy {
  min-width: 0;
  display: grid;
  gap: 4px;
}
.account-mini-row__copy strong,
.account-review-card__copy strong,
.account-order-card__copy strong {
  font-size: 1.05rem;
}
.account-mini-row__copy span,
.account-review-card__copy span,
.account-order-card__copy span {
  color: var(--muted);
}
.account-mini-row__meta {
  display: grid;
  gap: 6px;
  text-align: right;
}
.account-mini-row__meta span {
  color: #1d8b47;
}
.account-review-card__stars {
  margin: 0;
  display: inline-flex;
  gap: 4px;
  align-items: center;
  color: #c9972f;
}
.account-review-card__stars span {
  color: #d8d4cb;
}
.account-review-card__stars span.is-filled {
  color: #c9972f;
}
.account-review-card__stars small {
  margin-left: 8px;
  color: var(--text);
}
.account-order-card {
  padding: 0;
  overflow: hidden;
}
.account-order-card__summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  background: #194f21;
  color: #fff;
}
.account-order-card__summary > div {
  padding: 22px 24px;
  display: grid;
  gap: 8px;
  min-width: 0;
}
.account-order-card__summary > div + div {
  border-left: 1px solid rgba(255,255,255,0.18);
}
.account-order-card__summary span {
  font-size: 0.88rem;
  color: rgba(255,255,255,0.78);
}
.account-order-card__summary strong {
  font-size: clamp(0.95rem, 1.2vw, 1.22rem);
  line-height: 1.2;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.account-order-card__items {
  display: grid;
  gap: 0;
  padding: 10px 22px 0;
}
.account-order-card__item {
  display: grid;
  grid-template-columns: 78px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #ece3d7;
  color: inherit;
  text-decoration: none;
}
.account-order-card__item:hover .account-order-card__copy strong,
.account-order-card__item:focus-visible .account-order-card__copy strong {
  color: var(--brand-strong);
}
.account-order-card__footer {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  padding: 20px 22px 22px;
  flex-wrap: wrap;
}
.account-order-card__status {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
}
.account-order-card__status p {
  margin: 0;
  font-size: 1rem;
}
.account-order-card__pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  font-weight: 700;
  border: 1px solid #d9e4d8;
  background: #f7fbf7;
}
.account-order-card__pill.is-success {
  color: #1d8b47;
  border-color: rgba(29,139,71,0.45);
  background: rgba(29,139,71,0.06);
}
.account-order-card__pill.is-warning {
  color: #cf7a00;
  border-color: rgba(207,122,0,0.45);
  background: rgba(207,122,0,0.06);
}
.account-order-card__pill.is-danger {
  color: #d23d2a;
  border-color: rgba(210,61,42,0.4);
  background: rgba(210,61,42,0.05);
}
.account-order-card__pill.is-neutral {
  color: #4b5563;
}
.account-order-card__actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.account-order-card__actions .primary-button,
.account-order-card__actions .ghost-button {
  min-width: 150px;
}
.account-hero {
  margin-bottom: 28px;
}
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
.policy-page {
  display: grid;
  gap: 20px;
}
.policy-standalone {
  display: grid;
  gap: 0;
}
.policy-standalone__hero {
  width: 100%;
  background:
    radial-gradient(circle at 76% 18%, rgba(255, 255, 255, 0.14), transparent 34%),
    linear-gradient(135deg, #0b4dac 0%, #0a4fcf 45%, #0a4aa8 100%);
  color: #fff;
  padding: 88px 0 92px;
  border-top: 4px solid #0b4dac;
}
.policy-standalone__hero-inner {
  display: grid;
  place-items: center;
  text-align: center;
  gap: 14px;
}
.policy-standalone__hero-inner h1 {
  margin: 0;
  color: #fff;
  font-size: clamp(1.9rem, 3.2vw, 3.2rem);
  line-height: 1.15;
  letter-spacing: 0.01em;
  font-weight: 800;
  max-width: 26ch;
}
.policy-standalone__crumbs {
  margin: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 700;
  font-size: 0.98rem;
}
.policy-standalone__crumbs a {
  color: #fff;
  text-decoration: none;
}
.policy-standalone__crumbs a:hover {
  text-decoration: underline;
}
.policy-content--standalone {
  margin-top: 24px;
  margin-bottom: 30px;
  border-radius: 0;
  box-shadow: none;
  border: none;
  background: transparent;
  padding-left: 0;
  padding-right: 0;
}
.policy-layout {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  align-items: start;
  gap: 0;
  padding: 0;
  overflow: hidden;
}
.policy-mobile-controls,
.policy-mobile-sidebar-head,
.account-mobile-controls,
.account-mobile-sidebar-head,
.account-mobile-content-head {
  display: none;
}
.policy-sidebar {
  border-right: 1px solid #d8dee8;
  padding: 28px 20px;
  background: #fff;
  position: sticky;
  top: 90px;
}
.policy-sidebar-group + .policy-sidebar-group {
  margin-top: 24px;
}
.policy-sidebar-group {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
}
.policy-sidebar-group h3 {
  margin: 0 0 12px;
  padding: 0 2px;
  font-size: 1.95rem;
  font-weight: 800;
  color: #1a2230;
}
.policy-sidebar-group ul {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid #e2e8f0;
}
.policy-sidebar-group li {
  border-bottom: 1px solid #e2e8f0;
}
.policy-sidebar-group a {
  display: block;
  padding: 12px 12px;
  text-decoration: none;
  color: #1f2a3b;
  font-size: 1.02rem;
  font-weight: 500;
}
.policy-sidebar-group a:hover {
  color: #0a4fcf;
}
.policy-sidebar-group a.is-active {
  color: #0a4fcf;
  font-weight: 700;
}
.policy-content {
  padding: 30px clamp(20px, 4vw, 40px);
  background: #fff;
  color: #1f2a3b;
}
.policy-content.policy-content--standalone {
  background: transparent;
  border: 0;
  box-shadow: none;
  padding: 34px 0 10px;
}
.policy-content--standalone .policy-content-section--cta {
  border-top: 0;
  padding-top: 6px;
}
.policy-content--standalone .policy-faq-item {
  border: 0;
  box-shadow: none;
  background: #f7f8fa;
}
.policy-kicker {
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  font-weight: 700;
  color: #5b6678;
}
.policy-content h1 {
  margin: 0 0 12px;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  line-height: 1.2;
  color: #1a2230;
}
.policy-intro,
.policy-meta,
.policy-content p {
  margin: 0 0 12px;
  color: #2f394a;
  line-height: 1.6;
}
.policy-meta {
  color: #637086;
  font-size: 0.95rem;
}
.policy-content-section {
  margin-top: 24px;
}
.policy-content-section h2 {
  margin: 0 0 12px;
  font-size: clamp(1.15rem, 2.1vw, 1.6rem);
  color: #1a2230;
}
.policy-content-block {
  margin-bottom: 16px;
}
.policy-content-block h3,
.policy-content-block h4 {
  margin: 0 0 8px;
  font-size: 1.02rem;
  color: #1c2738;
}
.policy-content-block ul,
.policy-point-list {
  margin: 0;
  padding-left: 20px;
  display: grid;
  gap: 8px;
}
.policy-content-note {
  margin: 8px 0 0;
  color: #0a4fcf;
  font-weight: 700;
}
.policy-content-section--cta {
  border-top: 1px solid #d8dee8;
  padding-top: 18px;
  display: grid;
  gap: 10px;
  justify-items: center;
  text-align: center;
}
.policy-content-section--cta p {
  max-width: 62ch;
}
.policy-faq-list {
  display: grid;
  gap: 10px;
}
.policy-faq-item {
  border: 1px solid #d8dee8;
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
}
.policy-faq-item summary {
  list-style: none;
  cursor: pointer;
  margin: 0;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-weight: 700;
  color: #1a2230;
}
.policy-faq-item summary::-webkit-details-marker {
  display: none;
}
.policy-faq-item summary::after {
  content: "+";
  flex: 0 0 auto;
  color: #1a2230;
  font-size: 1.2rem;
  line-height: 1;
  font-weight: 500;
}
.policy-faq-item[open] summary::after {
  content: "-";
}
.policy-faq-item__answer {
  padding: 0 16px 14px;
  border-top: 1px solid #e4eaf2;
  display: grid;
  gap: 10px;
}
.policy-faq-item__answer p {
  margin: 10px 0 0;
}
.policy-faq-link {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  text-decoration: none;
  font-weight: 700;
  color: #0a4fcf;
}
.policy-faq-link:hover {
  text-decoration: underline;
}
.policy-cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}
.policy-cta-actions a {
  text-decoration: none;
  border: 1px solid #0a4fcf;
  color: #0a4fcf;
  padding: 9px 14px;
  border-radius: 8px;
  font-weight: 700;
}
.policy-cta-actions a:hover {
  background: #0a4fcf;
  color: #fff;
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
  gap: 14px;
  align-items: center;
}
.order-list__product-chip {
  grid-template-columns: 72px minmax(0, 1fr) auto;
}
.track-order-product {
  grid-template-columns: minmax(0, 1fr) auto;
}
.track-order-product__link {
  min-width: 0;
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  color: inherit;
  text-decoration: none;
}
.track-order-product__link:hover strong,
.track-order-product__link:focus-visible strong {
  color: #184f27;
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
  .home-logo-marquee__item {
    width: 148px;
    height: 78px;
  }
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
  .hero-banner {
    height: auto;
    aspect-ratio: 16 / 6;
  }
  .hero-banner__inner {
    height: 100%;
    padding: 28px 82px 44px 84px;
    align-items: end;
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
  .related-products__grid.related-products__rail {
    padding: 2px 48px 10px;
  }
  .related-products__item {
    flex-basis: clamp(220px, 24vw, 268px);
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
    padding: 0 0 env(safe-area-inset-bottom);
    margin-top: 0;
    background: #171513;
  }
  .shop-mobile-bar__button {
    width: 100%;
    min-height: 52px; border: 0; border-radius: 0;
    background: #171513; color: #fff; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
    box-shadow: none;
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
  .affiliate-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .affiliate-insights-grid,
  .affiliate-analytics-grid {
    grid-template-columns: 1fr;
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
  .home-logo-marquee__track {
    animation-duration: 28s;
  }
  .home-logo-marquee__item {
    width: 112px;
    height: 62px;
    padding: 8px 10px;
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
  .hero-grid, .product-detail, .cart-layout, .admin-layout, .product-detail-view { grid-template-columns: 1fr; }
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
  .policy-layout {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .policy-mobile-controls {
    display: flex;
    padding: 12px;
    border-bottom: 1px solid #d8dee8;
    background: #fff;
  }
  .policy-mobile-controls .ghost-button {
    width: 100%;
    min-height: 46px;
  }
  .policy-sidebar {
    display: none;
  }
  .policy-layout.policy-layout--mobile-nav-open .policy-sidebar {
    display: block;
    position: static;
    border-right: none;
    border-bottom: none;
    padding: 12px 16px 20px;
  }
  .policy-layout.policy-layout--mobile-nav-open .policy-content {
    display: none;
  }
  .policy-mobile-sidebar-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
  }
  .policy-mobile-sidebar-head strong {
    font-size: 1rem;
    color: #1a2230;
  }
  .policy-mobile-sidebar-head .ghost-button {
    min-height: 38px;
    padding: 0 14px;
  }
  .policy-sidebar {
    position: static;
    border-right: none;
    border-bottom: 1px solid #d8dee8;
    padding: 20px 16px;
  }
  .policy-sidebar-group h3 {
    font-size: 1.5rem;
  }
  .policy-content {
    padding: 20px 16px 24px;
  }
  .admin-nav {
    position: static;
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding: 12px;
    border-radius: 20px;
    scroll-snap-type: x proximity;
  }
  .admin-nav .section-kicker {
    display: none;
  }
  .admin-nav a {
    flex: 0 0 auto;
    white-space: nowrap;
    scroll-snap-align: start;
  }
  .admin-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .admin-meta-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 640px) {
  .policy-standalone__hero {
    padding: 62px 0 56px;
    border-top-width: 3px;
  }
  .policy-standalone__hero-inner {
    gap: 10px;
  }
  .policy-standalone__hero-inner h1 {
    font-size: clamp(1.7rem, 8vw, 2.2rem);
    max-width: 18ch;
  }
  .policy-standalone__crumbs {
    font-size: 0.9rem;
    gap: 8px;
  }
  .policy-content--standalone {
    margin-top: 12px;
    margin-bottom: 16px;
    border: none;
    padding-left: 0;
    padding-right: 0;
  }
  .home-logo-marquee {
    margin: 4px auto 8px;
  }
  .home-logo-marquee__track {
    animation-duration: 24s;
  }
  .home-logo-marquee__lane {
    gap: 10px;
    padding-right: 10px;
  }
  .home-logo-marquee__item {
    width: 102px;
    height: 56px;
  }
  .shell, .narrow-shell { width: min(100vw - 20px, 100%); }
  .homepage-products__section-head {
    flex-direction: column;
    align-items: flex-start;
  }
  .homepage-products__section-head .homepage-products__view-all {
    margin-top: 2px;
  }
  .homepage-products__mobile-view-toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex: 0 0 auto;
  }
  .homepage-products__view-mode {
    width: 36px;
    height: 36px;
  }
  .homepage-products__title-row {
    align-items: center;
    gap: 10px;
  }
  .homepage-products__title-row h2 {
    flex: 1 1 auto;
  }
  .homepage-products__rail-wrap {
    width: 100%;
    min-width: 0;
    display: grid;
    gap: 8px;
  }
  .homepage-products__rail-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 0 6px;
  }
  .homepage-products__mobile-rail {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 14px;
    gap: 12px;
    border: 0;
    background: transparent;
    padding: 2px 14px 10px;
  }
  .homepage-products__mobile-rail::-webkit-scrollbar {
    display: none;
  }
  .homepage-products__mobile-rail .product-card {
    flex: 0 0 min(68vw, 220px);
    scroll-snap-align: start;
    border: 1px solid #ece7de;
    display: grid;
  }
  .homepage-products__mobile-rail .product-card:nth-child(n + 5) {
    display: grid;
  }
  .homepage-products__rail-arrow {
    display: inline-flex;
    width: 30px;
    height: 30px;
    border: 1px solid #d6dfee;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.96);
    color: #0f2244;
    font-size: 1.25rem;
    line-height: 1;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 16px rgba(14, 32, 63, 0.12);
    z-index: 2;
  }
  .homepage-products__rail-arrow:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    box-shadow: none;
  }
  .homepage-products__rail-arrow--left {
    left: auto;
  }
  .homepage-products__rail-arrow--right {
    right: auto;
  }
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
  .admin-layout {
    gap: 14px;
  }
  .admin-dashboard__hero,
  .admin-dash-panels,
  .admin-dash-shortcuts__grid,
  .admin-viz-grid {
    grid-template-columns: 1fr;
  }
  .admin-dashboard__sync {
    justify-items: start;
  }
  .admin-hero {
    grid-template-columns: 1fr;
    padding: 20px 16px;
  }
  .admin-hero__badge {
    min-width: 92px;
    width: 92px;
    justify-self: end;
    border-radius: 26px;
  }
  .admin-toolbar,
  .admin-actions {
    align-items: stretch;
  }
  .admin-toolbar .field,
  .admin-toolbar__filter.field,
  .admin-toolbar .ghost-button,
  .admin-actions > *,
  .admin-form .primary-button,
  .admin-form .ghost-button,
  .admin-form .danger-button {
    width: 100%;
  }
  .admin-form__split,
  .admin-form--inline,
  .admin-stat-grid,
  .admin-meta-grid,
  .admin-dash-grid {
    grid-template-columns: 1fr;
  }
  .admin-record__head,
  .admin-record__main {
    grid-template-columns: 1fr;
    align-items: start;
  }
  .admin-order-detail-grid {
    grid-template-columns: 1fr;
  }
  .admin-record__image {
    width: 100%;
    height: 150px;
  }
  .admin-chip {
    width: fit-content;
    max-width: 100%;
  }
  .admin-viz-bar-row {
    grid-template-columns: minmax(0, 1fr);
    gap: 6px;
    align-items: start;
  }
  .admin-viz-bar-row strong {
    justify-self: end;
  }
  .admin-support-ticket__summary {
    flex-direction: column;
    align-items: flex-start;
  }
  .admin-support-ticket__summary-meta {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .admin-support-ticket__thread-item {
    width: 100%;
    max-width: 100%;
  }
  .admin-support-ticket__thread-item.is-user,
  .admin-support-ticket__thread-item.is-admin {
    justify-self: stretch;
  }
  .admin-support-ticket__composer-row {
    flex-direction: column;
    align-items: stretch;
  }
  .admin-support-ticket__submit {
    width: 100%;
    min-width: 0;
  }
  .admin-support-ticket__quick-replies .ghost-button {
    max-width: 100%;
  }
  .admin-manager > .panel,
  .admin-viz-card,
  .admin-toolbar,
  .admin-hero {
    overflow-x: hidden;
  }
  .admin-overlay__grid {
    grid-template-columns: 1fr;
  }
  .admin-timeline__item {
    grid-template-columns: 1fr;
  }
  .admin-dash-row {
    grid-template-columns: 1fr;
    align-items: start;
  }
  .admin-dash-row > div:last-child {
    justify-items: start;
  }
  .admin-inline-control {
    width: 100%;
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
    height: 42px;
    min-width: 98px;
    min-height: 42px;
    padding: 0 12px;
    border: 1px solid #e5ddd0;
    background: #fff;
    color: #1f1d1b;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    border-radius: 999px;
    white-space: nowrap;
    font-size: 0.86rem;
    font-weight: 600;
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
  .account-dashboard {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .account-dashboard__sidebar {
    display: none;
  }
  .account-dashboard.account-dashboard--mobile-nav-open .account-dashboard__sidebar {
    display: grid;
    gap: 10px;
  }
  .account-dashboard.account-dashboard--mobile-nav-open .account-dashboard__content {
    display: none;
  }
  .account-mobile-sidebar-head {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    margin-bottom: 2px;
  }
  .account-mobile-sidebar-head strong {
    font-size: 0.96rem;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: #334155;
  }
  .account-mobile-content-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;
  }
  .account-mobile-content-head .ghost-button {
    min-height: 38px;
    padding: 0 14px;
  }
  .account-mobile-content-head strong {
    font-size: 0.92rem;
    color: #334155;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
  .affiliate-join-card,
  .affiliate-command,
  .affiliate-referral-row {
    grid-template-columns: 1fr;
  }
  .affiliate-primary,
  .affiliate-code-card__actions button,
  .affiliate-referrals__head .ghost-link {
    width: 100%;
  }
  .affiliate-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .affiliate-tier-card {
    padding: 22px 16px;
  }
  .affiliate-tier-card__head {
    flex-direction: column;
    align-items: flex-start;
  }
  .affiliate-tier-milestones {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    text-align: left;
  }
  .affiliate-tier-milestones span::before {
    left: 0;
    transform: none;
  }
  .affiliate-insights-grid,
  .affiliate-analytics-grid {
    grid-template-columns: 1fr;
  }
  .affiliate-learn__commission-grid {
    grid-template-columns: 1fr;
  }
  .affiliate-learn__steps {
    grid-template-columns: 1fr;
  }
  .affiliate-learn__rate {
    font-size: 1.6rem;
  }
  .affiliate-learn__tier-grid,
  .affiliate-learn__example-grid,
  .affiliate-learn__journey-grid {
    grid-template-columns: 1fr;
  }
  .affiliate-learn__bottom-grid {
    grid-template-columns: 1fr;
  }
  .affiliate-benefit-card {
    grid-template-columns: 1fr;
  }
  .affiliate-analytics__row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .affiliate-analytics__row strong {
    justify-self: start;
  }
  .affiliate-code-card {
    min-width: 0;
  }
  .affiliate-referrals__head {
    align-items: stretch;
  }
  .account-dashboard__sidebar {
    gap: 10px;
  }
  .account-dashboard__nav {
    min-height: 72px;
    padding: 0 18px;
    border-radius: 20px;
  }
  .account-dashboard__section-head h2 {
    font-size: clamp(1.7rem, 6vw, 2.4rem);
  }
  .account-support-chat {
    grid-template-columns: 1fr;
    padding: 10px;
  }
  .account-support-chat__tickets {
    max-height: none;
  }
  .account-support-chat__thread-wrap {
    grid-template-rows: auto auto auto;
  }
  .account-support-chat__thread {
    max-height: 420px;
  }
  .account-support-chat__bubble {
    max-width: 100%;
  }
  .account-support-chat__quick {
    flex-direction: column;
  }
  .account-support-chat__quick .ghost-button {
    width: 100%;
  }
  .account-support-chat__composer-row {
    align-items: stretch;
  }
  .account-support-chat__input {
    min-height: 46px;
    border-radius: 16px;
  }
  .account-support-chat__send {
    min-height: 46px;
    min-width: 64px;
  }
  .account-dashboard__section-head--row {
    grid-template-columns: 1fr;
  }
  .account-dashboard__form,
  .account-mini-grid,
  .account-order-card__summary {
    grid-template-columns: 1fr;
  }
  .account-mini-row,
  .account-review-card,
  .account-order-card__item {
    grid-template-columns: 64px minmax(0, 1fr);
  }
  .account-mini-row,
  .account-review-card {
    grid-template-columns: 1fr;
  }
  .account-mini-row__product,
  .account-review-card__product {
    grid-template-columns: 64px minmax(0, 1fr);
  }
  .account-mini-row__meta {
    grid-column: 1 / -1;
    text-align: left;
  }
  .account-order-card__summary > div + div {
    border-left: 0;
    border-top: 1px solid rgba(255,255,255,0.12);
  }
  .account-order-card__footer {
    flex-direction: column;
    align-items: stretch;
  }
  .account-order-card__actions,
  .account-dashboard__actions,
  .account-dashboard__cta-row {
    flex-direction: column;
    align-items: stretch;
  }
  .account-order-card__actions .primary-button,
  .account-order-card__actions .ghost-button,
  .account-dashboard__submit {
    width: 100%;
  }
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
  .track-order-product {
    grid-template-columns: 1fr;
  }
  .track-order-product__link {
    grid-template-columns: 64px minmax(0, 1fr);
  }
  .track-order-product__meta {
    grid-column: 1;
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
    padding: 0;
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
    width: 30px;
    height: 30px;
    min-height: 30px;
    font-size: 1.15rem;
  }
  .product-gallery__stage-arrow {
    width: 38px;
    height: 38px;
    font-size: 1.3rem;
  }
  .product-gallery__stage-arrow--left {
    left: -10px;
  }
  .product-gallery__stage-arrow--right {
    right: -10px;
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
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
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
  .related-products__grid.related-products__rail {
    padding: 2px 34px 10px;
    scroll-padding-inline: 34px;
  }
  .related-products__item {
    flex: 0 0 min(76vw, 250px);
    min-width: 0;
    padding: 0;
  }
  .related-products__arrow {
    width: 34px;
    height: 34px;
    font-size: 1.35rem;
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
    padding: 0 0 env(safe-area-inset-bottom);
    background: #171513;
  }
  .shop-mobile-bar__button {
    width: 100%;
    min-height: 52px; border: 0; border-radius: 0;
    background: #171513; color: #fff; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
    box-shadow: none;
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
    font-size: 0.92rem;
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
  .hero-section {
    padding-top: 0;
    padding-bottom: 8px;
  }
  .hero-banner {
    height: auto;
    aspect-ratio: 16 / 6;
    overflow: visible;
    padding-bottom: 12px;
  }
  .hero-banner__inner {
    height: 100%;
    padding: 10px 12px 34px;
  }
  .hero-banner__content {
    max-width: min(94vw, 430px);
    gap: 8px;
  }
  .hero-banner__slide-image--fg {
    object-fit: cover;
  }
  .hero-banner .hero-actions {
    display: inline-flex;
    width: auto;
    gap: 8px;
  }
  .hero-banner .primary-link,
  .hero-banner__ghost {
    width: auto;
    min-height: 36px;
    padding: 8px 12px;
    font-size: 0.67rem;
    letter-spacing: 0.07em;
  }
  .hero-banner__arrow {
    width: 40px; height: 40px;
  }
  .hero-banner__arrow--left {
    left: 8px;
  }
  .hero-banner__arrow--right {
    right: 8px;
  }
  .hero-banner__dots {
    position: static;
    left: auto;
    transform: none;
    display: flex;
    gap: 6px;
    padding: 6px 10px;
    margin: 8px auto 0;
    width: fit-content;
  }
  .hero-banner__dot {
    width: 8px;
    height: 8px;
  }
  .home-logo-marquee {
    margin-top: 0;
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
  .shop-hero {
    gap: 10px;
    margin-bottom: 10px;
  }
  .shop-hero__crumbs {
    font-size: 0.72rem;
    padding: 10px 12px;
    gap: 7px;
  }
  .shop-hero h1 {
    font-size: 1.2rem;
    padding: 12px 10px 14px;
  }
  .shop-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 10px;
  }
  .shop-toolbar__controls {
    justify-content: space-between;
    gap: 10px;
  }
  .shop-toolbar__view {
    font-size: 0.76rem;
  }
  .shop-toolbar__sort {
    flex: 1 1 auto;
    min-height: 38px;
    padding: 4px 6px;
  }
  .shop-toolbar__sort span {
    font-size: 0.74rem;
  }
  .shop-toolbar__sort select {
    min-width: 120px;
    width: 100%;
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
@media (max-width: 420px) {
  .affiliate-stats {
    grid-template-columns: 1fr;
  }
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
`;

export default function GlobalStyles() {
  return <style dangerouslySetInnerHTML={{ __html: styles }} />;
}
