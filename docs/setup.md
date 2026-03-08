# Setup and Architecture

## Managing Subdomains

The goal for `rahuldhole.com` is to serve as the main portfolio and blog hub. Future apps or specific tools currently shown in the projects section (like PlayOnWeb IDE) will be migrated to subdomains like `ide.rahuldhole.com`.

### How to set up Subdomains:

1. **DNS Provider (e.g., Cloudflare)**:
   - Add a new `A` or `CNAME` record for your subdomain (e.g., `NAME: ide`, `TARGET: <your server IP or Vercel edge url>`).
2. **Hosting Platform (e.g., Vercel / Netlify / Self-hosted)**:
   - Go to your Project Settings.
   - Under Domains, add `ide.rahuldhole.com`.
   - The hosting platform will handle SSL certificate generation for you.

## Managing Content

This Nuxt Content site operates using local markdown and YAML files.

- **Blog Posts**: Place new blog posts in `content/blog`. Ensure they follow the Frontmatter schema defined in `content.config.ts`.
- **Landing Page Data**: Edit `content/0.index.yml` to change your "About", "Work Experience", and "Projects" sections without needing to write Vue code.

## Monetization (Google Adsense)

A placeholder script is added to `nuxt.config.ts`.
To activate it:
1. Go to Google Adsense and get your Client ID.
2. Open `nuxt.config.ts` and replace `ca-pub-placeholder` with your actual Client ID in the `app.head.script` injection.
