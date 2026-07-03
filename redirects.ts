import type { NitroRouteRules } from 'nitropack'

/**
 * Route Rules (Redirects)
 * 
 * Why this is necessary for SEO:
 * When you change a URL slug (e.g., renaming a blog post file), any existing inbound 
 * links from other websites, social media, or Google's index will break (returning a 404). 
 * 
 * Using a 301 (permanent) redirect tells search engines that the page has moved permanently. 
 * This preserves your "link equity" (SEO ranking power) and seamlessly forwards users 
 * and bots to the new URL without losing traffic.
 */
export const redirects: Record<string, NitroRouteRules> = {
  '/blog/devtools': { redirect: '/blog/docker-devtools' }
  // Add future redirects here. Example:
  // '/old-path': { redirect: '/new-path' }
}
