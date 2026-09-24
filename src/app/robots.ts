import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://unitainment.renitsuki.in";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/movies", "/anime", "/games", "/media/", "/forum", "/donate"],
      disallow: ["/api/", "/library", "/chat", "/profile", "/auth/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
