"use client";

import { useMemo, useState } from "react";

export default function StableImage({
  src,
  alt,
  className = "",
  width = 320,
  height = 320,
  loading = "lazy",
  decoding = "async",
  fetchPriority = "low",
  fallback = null,
  fallbackClassName = "product-card__placeholder",
  fallbackText = "No image",
  style,
  ...rest
}) {
  const [failed, setFailed] = useState(false);
  const normalizedSrc = useMemo(() => String(src || "").trim(), [src]);
  const showFallback = !normalizedSrc || failed;
  const widthValue = Number(width) > 0 ? Number(width) : 320;
  const heightValue = Number(height) > 0 ? Number(height) : 320;
  const mergedStyle = {
    aspectRatio: `${widthValue} / ${heightValue}`,
    ...style,
  };

  if (showFallback) {
    if (fallback) return fallback;
    return (
      <div
        className={fallbackClassName}
        style={mergedStyle}
        aria-label={alt || fallbackText}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <img
      src={normalizedSrc}
      alt={alt || "Image"}
      className={className ? `stable-image ${className}` : "stable-image"}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      width={widthValue}
      height={heightValue}
      style={mergedStyle}
      draggable={false}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
