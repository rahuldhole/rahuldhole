---
title: "Postmortem: The Ghost in the Chrome Cache (Nuxt & Cloudflare Pages)"
authors:
  - name: Rahul Dhole
    to: /
    avatar:
      src: /profile.png
badge:
  label: Postmortem
date: 2026-08-06
description: How a routine Nuxt deployment led to a bizarre, Chrome-only "Failed to fetch dynamically imported module" crash—and the obscure Cloudflare caching quirk behind it.
imageComponent:
  title: "INCIDENT: Chunk Load Error"
  subtitle: "Failed to fetch dynamically imported module"
  type: Postmortem
seoImage:
  src: https://placehold.co/800x400/ef4444/ffffff?text=Nuxt+Chunk+Error+Postmortem
---

## The Incident

It was supposed to be a routine deployment. I wrote a new blog post, pushed it to `main`, and watched Cloudflare Pages build and deploy the Nuxt 3 site successfully. Everything looked green.

Then, I opened the site in Chrome, clicked a link, and the page crashed with this infamous error:

```text
[nuxt] error caught during app initialization
TypeError: Failed to fetch dynamically imported module: https://rahuldhole.com/_nuxt/Dg6KwZeV.js
```

"No problem," I thought. "Just a stale chunk. I'll do a hard reload."

I hit `Cmd+Shift+R`. **It still crashed.**
I opened an Incognito window. **It still crashed.** 

Then, out of sheer desperation, I opened the site in Firefox. **It worked perfectly.** 

Why would a missing JavaScript chunk error happen *only* in Chrome, survive a hard reload, and persist even in Incognito mode? 

---

## The Investigation

Initially, my thoughts went to the usual suspects:
1. **A rogue Service Worker?** I didn't have one installed.
2. **A corrupted Nuxt build?** A local build verified everything was compiling perfectly.
3. **A Chrome extension?** Incognito mode ruled that out.

The fact that Firefox was getting the fresh files while Chrome was getting an old `index.html` (which was asking for a deleted `.js` chunk) meant this had to be an edge caching issue. But why was Cloudflare treating Chrome differently than Firefox?

### The Culprit: Accept-Encoding

The breakthrough came when looking at how modern browsers request files, specifically the `Accept-Encoding` header.

*   **Chrome** (and most Chromium browsers) asks for: `gzip, deflate, br, zstd`
*   **Firefox** asks for: `gzip, deflate, br`

Cloudflare is smart. Too smart, sometimes. It caches responses *separately* based on the compression format. 

When my deployment finished, Cloudflare automatically purged its edge cache. However, due to an eventual consistency hiccup on the edge node nearest to me, the `br` (Brotli) cache key was successfully purged, while the `zstd` (Zstandard) cache key got stuck.

So when Firefox visited the site, Cloudflare saw a cache miss for `br`, fetched the fresh `index.html` from the origin, and loaded the site perfectly. 

But when Chrome visited the site, Cloudflare saw a cache hit for `zstd`, and happily served up the *old* `index.html` from before the deployment. That old HTML file told Chrome to download `Dg6KwZeV.js`—a file that had already been deleted from the server. Boom. Crash.

---

## The Solution

There are two steps to fixing this and ensuring it never impacts users again.

### 1. The Immediate Fix: Purge Everything

A hard reload in your browser doesn't change the `Accept-Encoding` header, so you just keep hitting the same stuck cache key on the edge node. 

The only way to forcefully break the cycle is to log into the Cloudflare Dashboard, go to **Caching > Configuration**, and hit **"Purge Everything"**. Within 60 seconds, Chrome was back to normal.

### 2. The Long-Term Fix: Nuxt's Built-in Safety Net

You can't expect your users to purge your Cloudflare cache for you. Thankfully, the Nuxt team is well aware of these SPA chunk loading errors and built a native safeguard directly into the framework.

By adding this to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  experimental: {
    emitRouteChunkError: 'automatic'
  }
})
```

Nuxt will intercept that `Failed to fetch dynamically imported module` error. Instead of throwing a fatal crash, it will automatically force a hard reload of the window, seamlessly fetching the fresh `index.html` and the correct chunks. Your users get the new site, and nobody even notices the deployment happened!
