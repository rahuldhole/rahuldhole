---
title: "Blooper: PWA Redirecting SPA Routes"
authors:
  - name: Rahul Dhole
    to: /
    avatar:
      src: /profile.png
badge:
  label: Blooper
date: 2026-06-23
description: "How Vite PWA intercepted navigation requests in production and caused redirect loops."
image:
  src: https://placehold.co/800x400/0f172a/3b82f6?text=PWA+Redirecting+SPA+Routes
pinned: false
---

## Issue
Reloading SPA pages (like a `/dashboard` or `/profile` route) in production unexpectedly redirected the user back to the home page `/`. Local development worked perfectly fine without any redirects.

## Root Cause
Vite PWA intercepted the navigation requests in production and fell back to serving the cached `/` HTML. Since the framework hydrated with the root page's state on a different URL, the router detected a state mismatch and forcefully redirected the user back to `/`.

## Resolution
Disabled the PWA navigation fallback in the configuration:
```ts
pwa: { workbox: { navigateFallback: null } }
```
This lets the server environment handle navigations naturally and generate SPA shells for client-side only routes.
