import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url || typeof url !== "string") {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Security check: only allow verified media hostnames
  const allowedHostnames = [
    "cdn.myanimelist.net",
    "image.tmdb.org",
    "m.media-amazon.com",
    "images.unsplash.com",
    "shared.akamai.steamstatic.com",
    "steamcdn-a.akamaihd.net",
    "media.rawg.io",
  ];

  try {
    const parsed = new URL(url);
    const isAllowed = allowedHostnames.some(
      (h) => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`)
    );

    if (!isAllowed) {
      return new NextResponse("Forbidden host", { status: 403 });
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return new NextResponse("Upstream error", { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new NextResponse("Proxy fetch error", { status: 500 });
  }
}
