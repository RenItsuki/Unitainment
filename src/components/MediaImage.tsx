"use client";

import React, { useState, useEffect } from "react";
import { getOptimizedImageUrl, getFallbackPlaceholder } from "@/lib/imageHelper";

interface MediaImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
  mediaType?: string;
  fallbackSrc?: string;
}

export function MediaImage({
  src,
  mediaType,
  fallbackSrc,
  alt,
  className,
  ...props
}: MediaImageProps) {
  const fallback = fallbackSrc || getFallbackPlaceholder(mediaType);
  const [currentSrc, setCurrentSrc] = useState<string>(() => getOptimizedImageUrl(src, mediaType));
  const [triedProxy, setTriedProxy] = useState(false);

  useEffect(() => {
    setCurrentSrc(getOptimizedImageUrl(src, mediaType));
    setTriedProxy(false);
  }, [src, mediaType]);

  const handleError = () => {
    if (!triedProxy && src && !currentSrc.includes("/api/image-proxy") && !src.startsWith("/")) {
      setTriedProxy(true);
      setCurrentSrc(`/api/image-proxy?url=${encodeURIComponent(src)}`);
    } else {
      setCurrentSrc(fallback);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt || "Media artwork"}
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
      {...props}
    />
  );
}
