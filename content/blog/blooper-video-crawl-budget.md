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
image:
  src: https://placehold.co/800x400/0f172a/3b82f6?text=Crawl+Budget+Killer
pinned: false
---

## The Blunder
Google Search Console started treating our application like a media hosting platform, throwing bizarre Video Indexing errors. Regular page indexing ground to a halt.

## The "Duh" Moment
We were server-side rendering heavy YouTube `iframe` embeds in our blog posts. Because our new domain has a tiny "crawl budget", Googlebot spent all its time trying to parse heavy media wrappers, hit its timeout, and gave up on reading our actual text content.

## The Fix
Wrapped the entire YouTube component template in `<ClientOnly>` tags with a lightweight HTML placeholder. Now the server sends a fast skeleton, Googlebot reads the text immediately, and the heavy video only loads on the client side. Problem solved! 🤦‍♂️
