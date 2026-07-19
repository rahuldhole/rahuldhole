---
title: "Blooper: Hardcoded Content Links cause 404s"
authors:
  - name: Rahul Dhole
    to: /
    avatar:
      src: /profile.png
badge:
  label: Blooper
date: 2026-06-28
description: "Why you should never hardcode UI navigation links to specific markdown file paths."
seoImage:
  src: https://placehold.co/800x400/0f172a/3b82f6?text=Hardcoded+Links+404s
imageComponent:
  type: Blooper
pinned: false
---

## The Bug
UI navigation links were hardcoded to specific content markdown file paths. When those markdown files were later renamed or reorganized, the hardcoded links silently broke, resulting in 404 errors.

## The Fix
Instead of hardcoding static paths, resolve links dynamically. Load the content structure using a query collection, and use `.find()` with partial substring matching to auto-detect the current valid path for the intended page.

## The Rule
Never hardcode internal content paths in UI components. Always derive them dynamically from the content source of truth to ensure resilience against file renaming.
