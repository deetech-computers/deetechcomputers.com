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

export function normalizeProductUpgradeSpecsInput(input) {
  let source = input;

  if (typeof input === "string") {
    const raw = input.trim();
    if (!raw) {
      return {
        enabled: false,
        ramOptions: [],
        storageOptions: [],
      };
    }

    try {
      source = JSON.parse(raw);
    } catch {
      throw new Error("Invalid upgrade specs format");
    }
  }

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return {
      enabled: false,
      ramOptions: [],
      storageOptions: [],
    };
  }

  const ramOptions = normalizeUpgradeOptions(source.ramOptions);
  const storageOptions = normalizeUpgradeOptions(source.storageOptions);
  const enabled =
    Boolean(source.enabled) && (ramOptions.length > 0 || storageOptions.length > 0);

  return {
    enabled,
    ramOptions,
    storageOptions,
  };
}

export function hasProductUpgradeSpecs(product) {
  const specs = normalizeProductUpgradeSpecsInput(product?.upgradeSpecs);
  return specs.enabled && (specs.ramOptions.length > 0 || specs.storageOptions.length > 0);
}

export function normalizeUpgradeSelection(selection) {
  if (!selection || typeof selection !== "object" || Array.isArray(selection)) {
    return {};
  }

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

  if (normalized.ram) {
    parts.push(`ram:${normalized.ram.toLowerCase()}`);
  }
  if (normalized.storage) {
    parts.push(`storage:${normalized.storage.toLowerCase()}`);
  }

  return parts.join("|");
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
  const upgradeSpecs = normalizeProductUpgradeSpecsInput(product?.upgradeSpecs);
  const normalizedSelection = normalizeUpgradeSelection(selection);
  const resolved = {};
  let totalDelta = 0;

  if (normalizedSelection.ram) {
    const option = findUpgradeOption(upgradeSpecs.ramOptions, normalizedSelection.ram);
    if (!option) {
      throw new Error("Selected RAM upgrade is no longer available for this product");
    }
    resolved.ram = {
      label: option.label,
      priceDelta: option.priceDelta,
    };
    totalDelta += option.priceDelta;
  }

  if (normalizedSelection.storage) {
    const option = findUpgradeOption(upgradeSpecs.storageOptions, normalizedSelection.storage);
    if (!option) {
      throw new Error("Selected storage upgrade is no longer available for this product");
    }
    resolved.storage = {
      label: option.label,
      priceDelta: option.priceDelta,
    };
    totalDelta += option.priceDelta;
  }

  const hasSelections = Boolean(resolved.ram || resolved.storage);
  if (hasSelections && !upgradeSpecs.enabled) {
    throw new Error("This product does not allow upgrade selections");
  }

  return {
    selectedUpgrades: resolved,
    totalDelta: Number(totalDelta.toFixed(2)),
    signature: buildUpgradeSignature({
      ram: resolved.ram?.label,
      storage: resolved.storage?.label,
    }),
  };
}
