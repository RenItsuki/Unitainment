import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://unitainment.renitsuki.in";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/movies", "/anime", "/games", "/media/", "/forum", "/donate"],
      disallow: ["/api/", "/library", "/chat", "/profile", "/auth/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
