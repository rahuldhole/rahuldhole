---
title: "Blooper: The SSR Crash of Doom"
authors:
  - name: Rahul Dhole
    to: /
    avatar:
      src: /profile.png
badge:
  label: Blooper
date: 2026-06-26
description: "How importing a client-side SDK crashed our Server-Side Rendering edge workers."
seoImage:
  src: https://placehold.co/800x400/0f172a/3b82f6?text=SSR+Crash+of+Doom
pinned: false
imageComponent:
  type: Blooper
---

## The Blunder 
The support and blog pages started crashing with 500 Server Errors during Server-Side Rendering (SSR). It was a stubborn bug that seemed to appear out of nowhere after some dependency updates.

## The "Duh" Moment 
The actual culprit was a feedback form component being rendered on the server. The form utilized client-side SDKs which imported `axios` at the module level. This is perfectly fine on the client, but when the framework evaluated it within the Cloudflare Worker during SSR, the worker crashed spectacularly because Node-specific configurations or APIs within `axios` aren't fully compatible with edge runtimes.

## The Fix 
We simply wrapped the feedback form component in `<ClientOnly>` tags within the page templates. This prevents the server from attempting to render the component and initialize the problematic SDK, offloading the form rendering entirely to the client side. Sometimes the simplest fix is the one we overlook! 🤦‍♂️
