---
title: "Blooper: The Invisible SEO"
authors:
  - name: Rahul Dhole
    to: /
    avatar:
      src: /profile.png
badge:
  label: Blooper
date: 2026-06-25
description: "How missing production environment variables caused our app to aggressively de-index itself."
image:
  src: https://placehold.co/800x400/0f172a/3b82f6?text=The+Invisible+SEO
pinned: false
---

## The Blunder 
Google Search Console kept marking pages as "Excluded" with `noindex`. We tried fixing it by shuffling `NUXT_SITE_ENV` and `NUXT_PUBLIC_SITE_URL` around local `.env` files, expecting the deployment to pick them up.

## The "Duh" Moment 
Cloudflare Pages ignores local `.env` files during deployment unless explicitly configured. Without those variables explicitly set in production, the SEO module assumed it was running a preview build and aggressively injected a `noindex` tag to prevent accidental indexing of a staging site.

## The Fix 
Added `NUXT_SITE_ENV` and `NUXT_PUBLIC_SITE_URL` directly to `wrangler.toml` under `[vars]`. Problem solved! 🤦‍♂️
