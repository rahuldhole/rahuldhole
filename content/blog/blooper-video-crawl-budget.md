---
title: "Blooper: The YouTube Crawl Budget Killer"
authors:
  - name: Rahul Dhole
    to: /
    avatar:
      src: /profile.png
badge:
  label: Blooper
date: 2026-06-27
description: "How server-rendered YouTube iframes destroyed our SEO crawl budget."
seoImage:
  src: https://placehold.co/800x400/0f172a/3b82f6?text=Crawl+Budget+Killer
pinned: false
imageComponent:
  type: Blooper
---

## The Blunder
Google Search Console started treating our application like a media hosting platform, throwing bizarre Video Indexing errors. Regular page indexing ground to a halt.

## The "Duh" Moment
We were server-side rendering heavy YouTube `iframe` embeds in our blog posts. Because our new domain has a tiny "crawl budget", Googlebot spent all its time trying to parse heavy media wrappers, hit its timeout, and gave up on reading our actual text content.

## The Fix
Wrapped the entire YouTube component template in `<ClientOnly>` tags with a lightweight HTML placeholder. Now the server sends a fast skeleton, Googlebot reads the text immediately, and the heavy video only loads on the client side. Problem solved! 🤦‍♂️ (See [Figure 1](#fig-1))

<a id="fig-1"></a>
```mermaid
sequenceDiagram
    participant Bot as Googlebot
    participant Server as SSR Server
    participant Client as Browser

    Note over Bot,Server: Before `<ClientOnly>`
    Bot->>Server: GET /blog/post
    Server->>Server: Render Heavy iframe
    Server-->>Bot: Massive HTML response
    Bot->>Bot: Parse timeout / Budget exhausted

    Note over Bot,Server: After `<ClientOnly>`
    Bot->>Server: GET /blog/post
    Server->>Server: Render Skeleton & Text
    Server-->>Bot: Fast, small HTML
    Bot->>Bot: Parses text successfully!
    Client->>Server: GET /blog/post
    Server-->>Client: Fast HTML
    Client->>Client: Hydrate & Load iframe
```
*Figure 1: Search engine parsing timeout vs success with ClientOnly skeleton*
