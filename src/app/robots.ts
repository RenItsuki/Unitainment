import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://unitainment.renitsuki.in";

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: ["/", "/movies", "/anime", "/games", "/forum", "/donate"],
        disallow: ["/api/", "/library", "/chat", "/profile", "/auth/"],
      },
      {
        userAgent: "*",
        allow: ["/", "/movies", "/anime", "/games", "/forum", "/donate"],
        disallow: ["/api/", "/library", "/chat", "/profile", "/auth/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
