import type { MetadataRoute } from "next";
import { fetchRanking } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://virtuals-dashboard.vercel.app";
  
  // Static pages
  const routes = [
    { url: baseUrl, priority: 1.0, changeFrequency: "hourly" as const },
    { url: `${baseUrl}/analytics`, priority: 0.8, changeFrequency: "daily" as const },
    { url: `${baseUrl}/insights`, priority: 0.8, changeFrequency: "daily" as const },
  ];

  // Dynamic agent pages
  try {
    const agents = await fetchRanking();
    const agentRoutes = agents.slice(0, 100).map((agent) => ({
      url: `${baseUrl}/agent/${agent.agentId}`,
      lastModified: new Date(),
      priority: 0.7,
      changeFrequency: "daily" as const,
    }));
    
    return [...routes, ...agentRoutes];
  } catch (error) {
    console.error("Failed to fetch agents for sitemap:", error);
    return routes;
  }
}
