/**
 * Image helper utility to ensure robust, high-performance image loading
 * across all ISPs and browsers without SSL errors or connection resets.
 */

export function getOptimizedImageUrl(url?: string | null, mediaType?: string): string {
  if (!url || typeof url !== "string" || !url.trim()) {
    return getFallbackPlaceholder(mediaType);
  }

  const cleanUrl = url.trim();

  // Already safe / local / unsplash / dicebear / wsrv
  if (
    cleanUrl.startsWith("/") ||
    cleanUrl.includes("unsplash.com") ||
    cleanUrl.includes("dicebear.com") ||
    cleanUrl.includes("wsrv.nl") ||
    cleanUrl.includes("weserv.nl")
  ) {
    return cleanUrl;
  }

  // TMDB images are rock-solid globally via BunnyCDN
  if (cleanUrl.includes("image.tmdb.org")) {
    return cleanUrl;
  }

  // Steam images & rawg & MAL: proxy through Cloudflare's global wsrv edge cache
  // This completely bypasses ISP DNS blocks, ERR_CONNECTION_RESET, and SSL untrusted cert issues
  if (
    cleanUrl.includes("steamstatic.com") ||
    cleanUrl.includes("steampowered.com") ||
    cleanUrl.includes("rawg.io") ||
    cleanUrl.includes("myanimelist.net")
  ) {
    return `https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}&output=webp&q=85`;
  }

  return cleanUrl;
}

export function getFallbackPlaceholder(type?: string): string {
  switch (type?.toUpperCase()) {
    case "GAME":
      return "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=780&auto=format&fit=crop&q=80";
    case "ANIME":
      return "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=780&auto=format&fit=crop&q=80";
    case "SERIES":
      return "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=780&auto=format&fit=crop&q=80";
    case "MOVIE":
    default:
      return "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=780&auto=format&fit=crop&q=80";
  }
}
