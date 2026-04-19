import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://growaiedu.com'
 
  // Fetch all active courses for the sitemap
  const courses = await prisma.course.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, created_at: true }
  })
 
  const courseSitemaps = courses.map((course) => ({
    url: `${baseUrl}/course/${course.id}`,
    lastModified: course.created_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
 
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...courseSitemaps,
  ]
}
