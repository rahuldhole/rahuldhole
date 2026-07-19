---
title: "Blooper: The Disappearing Cloudflare Variables"
authors:
  - name: Rahul Dhole
    to: /
    avatar:
      src: /profile.png
badge:
  label: Blooper
date: 2026-06-24
description: "Why environment variables added via the Cloudflare dashboard kept vanishing after deployment."
image:
  src: https://placehold.co/800x400/0f172a/3b82f6?text=Disappearing+Cloudflare+Vars
pinned: false
---

## The Blunder 
I kept adding `MATRIX_URL` and `MATRIX_SERVER_NAME` to the Cloudflare dashboard as plain text environment variables. Every time I ran `wrangler deploy`, they vanished into the void.

## The "Duh" Moment 
Wrangler is a neat freak. If a plain text variable isn't explicitly written in the `wrangler.toml` file, Wrangler deletes it from Cloudflare during deployment to keep the deployed state perfectly synced with the repository configuration. (Secrets, thankfully, are spared from this purge). 

## The Fix 
Just hardcode the non-secret URLs in `wrangler.toml` under `[vars]`. Problem solved! 🤦‍♂️
