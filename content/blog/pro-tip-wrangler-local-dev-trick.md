---
title: "Pro Tip: Sandboxing Cloudflare Workers for AI Agents"
authors:
  - name: Rahul Dhole
    to: /
    avatar:
      src: /profile.png
badge:
  label: Pro Tip
date: 2026-06-29
description: "How to safely sandbox your Cloudflare Workers environment when working with AI coding agents."
image:
  src: https://placehold.co/800x400/0f172a/3b82f6?text=Sandboxing+Cloudflare+Workers
pinned: false
---

When giving AI agents access to your development environment, you want to ensure they can't accidentally deploy broken code or leak secrets to your production Cloudflare account. 

Here is a simple trick to sandbox them:

1. **Clone your account:** Create a completely separate, free-tier Cloudflare account specifically for your AI agent.
2. **Override the Account ID:** Set a different `CLOUDFLARE_ACCOUNT_ID` in your local environment variables (`.env`).
3. **Login:** Run `npx wrangler login` and authenticate with the sandboxed account.

This completely isolates the agent's actions from your production infrastructure. 

> [!WARNING]
> Keep in mind that local `.env` variables can override `wrangler.toml` variables. Always double check your generated `worker-configuration.d.ts` file to ensure the agent hasn't accidentally wiped out your production bindings when generating types.
