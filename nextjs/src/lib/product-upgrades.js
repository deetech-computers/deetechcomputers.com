import { getProductPricing } from "./product-pricing";

function normalizeOptionLabel(value) {
  return String(value || "").trim();
}

function normalizePriceDelta(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number) || number < 0) return 0;
  return Number(number.toFixed(2));
}

function normalizeUpgradeOptions(options = []) {
  if (!Array.isArray(options)) return [];
  return options
    .map((option) => ({
      label: normalizeOptionLabel(option?.label),
      priceDelta: normalizePriceDelta(option?.priceDelta),
    }))
    .filter((option) => option.label);
}

export function normalizeProductUpgradeSpecs(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {
      enabled: false,
      ramOptions: [],
      storageOptions: [],
    };
  }

  const ramOptions = normalizeUpgradeOptions(input.ramOptions);
  const storageOptions = normalizeUpgradeOptions(input.storageOptions);
  const enabled =
    Boolean(input.enabled) && (ramOptions.length > 0 || storageOptions.length > 0);

  return {
    enabled,
    ramOptions,
    storageOptions,
  };
}

export function hasProductUpgradeSpecs(product) {
  const specs = normalizeProductUpgradeSpecs(product?.upgradeSpecs);
  return specs.enabled && (specs.ramOptions.length > 0 || specs.storageOptions.length > 0);
}

export function normalizeUpgradeSelection(selection) {
  if (!selection || typeof selection !== "object" || Array.isArray(selection)) return {};
  const next = {};
  const ram = normalizeOptionLabel(selection.ram);
  const storage = normalizeOptionLabel(selection.storage);
  if (ram) next.ram = ram;
  if (storage) next.storage = storage;
  return next;
}

export function buildUpgradeSignature(selection) {
  const normalized = normalizeUpgradeSelection(selection);
  const parts = [];
  if (normalized.ram) parts.push(`ram:${normalized.ram.toLowerCase()}`);
  if (normalized.storage) parts.push(`storage:${normalized.storage.toLowerCase()}`);
  return parts.join("|");
}

export function buildCartLineKey(productId, selection) {
  const id = String(productId || "").trim();
  if (!id) return "";
  const signature = buildUpgradeSignature(selection);
  return signature ? `${id}::${signature}` : `${id}::base`;
}

export function formatSelectedUpgrades(selection) {
  const normalized = normalizeUpgradeSelection(selection);
  return [normalized.ram, normalized.storage].filter(Boolean).join(" / ");
}

function findUpgradeOption(options = [], label = "") {
  const normalizedLabel = normalizeOptionLabel(label).toLowerCase();
  if (!normalizedLabel) return null;
  return (
    options.find((option) => String(option?.label || "").trim().toLowerCase() === normalizedLabel) ||
    null
  );
}

export function resolveProductUpgradeSelection(product, selection) {
  const upgradeSpecs = normalizeProductUpgradeSpecs(product?.upgradeSpecs);
  const normalizedSelection = normalizeUpgradeSelection(selection);
  const selectedUpgrades = {};
  let totalDelta = 0;

  if (normalizedSelection.ram) {
    const option = findUpgradeOption(upgradeSpecs.ramOptions, normalizedSelection.ram);
    if (option) {
      selectedUpgrades.ram = { label: option.label, priceDelta: option.priceDelta };
      totalDelta += option.priceDelta;
    }
  }

  if (normalizedSelection.storage) {
    const option = findUpgradeOption(upgradeSpecs.storageOptions, normalizedSelection.storage);
    if (option) {
      selectedUpgrades.storage = { label: option.label, priceDelta: option.priceDelta };
      totalDelta += option.priceDelta;
    }
  }

  return {
    selectedUpgrades,
    totalDelta: Number(totalDelta.toFixed(2)),
    signature: buildUpgradeSignature({
      ram: selectedUpgrades.ram?.label,
      storage: selectedUpgrades.storage?.label,
    }),
  };
}

function upsertSpecEntry(entries, matcher, label, value) {
  const index = entries.findIndex(([key]) => matcher(String(key || "")));
  if (index >= 0) {
    entries[index] = [entries[index][0], value];
    return;
  }
  entries.unshift([label, value]);
}

export function applyUpgradeSelectionToSpecs(specEntries, selection) {
  const entries = Array.isArray(specEntries)
    ? specEntries.map(([key, value]) => [String(key || ""), String(value || "")])
    : [];
  const normalized = normalizeUpgradeSelection(selection);

  if (normalized.ram) {
    upsertSpecEntry(
      entries,
      (key) => /ram|memory/i.test(key),
      "RAM",
      normalized.ram
    );
  }

  if (normalized.storage) {
    upsertSpecEntry(
      entries,
      (key) => /storage|ssd|hdd|drive|rom/i.test(key),
      "Storage",
      normalized.storage
    );
  }

  return entries;
}

export function getProductDisplayPricing(product, selection) {
  const pricing = getProductPricing(product);
  const upgrade = resolveProductUpgradeSelection(product, selection);
  const currentPrice = Number(pricing.currentPrice || 0) + Number(upgrade.totalDelta || 0);
  const originalPrice = Number(pricing.originalPrice || 0) + Number(upgrade.totalDelta || 0);
  const hasDiscount = pricing.isDiscountActive && currentPrice < originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return {
    ...pricing,
    currentPrice,
    originalPrice,
    discountPercent,
    hasDiscount,
    upgradeDelta: Number(upgrade.totalDelta || 0),
    selectedUpgrades: upgrade.selectedUpgrades,
    upgradeSignature: upgrade.signature,
  };
}
