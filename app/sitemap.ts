import { MetadataRoute } from 'next';
import { getAllDocs } from '@/lib/docs';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://operating-system-notes.vercel.app';
  
  // Get all documentation pages
  const docs = getAllDocs();
  
  // Create sitemap entries for all docs
  const docEntries: MetadataRoute.Sitemap = docs.map((doc) => ({
    url: `${baseUrl}/docs/${doc.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: doc.slug === 'readme' ? 0.8 : 0.7,
  }));

  // Add home page
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...docEntries,
  ];

  return routes;
}

