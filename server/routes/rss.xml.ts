import { Feed } from 'feed'
import { defineEventHandler, setResponseHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const siteUrl = 'https://rahuldhole.com'
  
  // Fetch blog posts using Nuxt Content v3 API
  // @ts-ignore - queryCollection in Nitro routes takes event as first arg, but types are slightly misaligned
  const posts = await queryCollection(event, 'posts')
    .order('date' as any, 'DESC')
    .all()

  const feed = new Feed({
    title: 'Rahul Dhole',
    description: 'Full-Stack Engineer based in Paris specializing in Ruby on Rails, Vue.js, and Cloud DevOps.',
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    favicon: `${siteUrl}/favicon.ico`,
    copyright: 'All rights reserved, Rahul Dhole',
    feedLinks: {
      rss: `${siteUrl}/rss.xml`,
    },
  })

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${siteUrl}${(post as any).path}`,
      link: `${siteUrl}${(post as any).path}`,
      description: post.description,
      date: new Date((post as any).date),
      // If you want to include image
      // image: post.image?.src ? `${siteUrl}${post.image.src}` : undefined,
    })
  })

  setResponseHeader(event, 'Content-Type', 'text/xml')
  
  return feed.rss2()
})
