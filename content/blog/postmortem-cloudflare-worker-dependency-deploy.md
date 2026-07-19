---
title: "Postmortem: Cloudflare Worker Missing Dependency on Deploy"
authors:
  - name: Rahul Dhole
    to: /
    avatar:
      src: /profile.png
badge:
  label: Postmortem
date: 2026-06-08
description: "How to fix missing dependencies when deploying Cloudflare Workers from within a monorepo workspace."
seoImage:
  src: https://placehold.co/800x400/0f172a/3b82f6?text=Cloudflare+Worker+Dependencies
pinned: false
imageComponent:
  type: Postmortem
---

## 1. The Issue
- **Symptom:** The Cloudflare CI/CD pipeline failed to build a worker service with a missing dependency error: `✘ [ERROR] Could not resolve "@cloudflare/containers"`.
- **Impact:** We were unable to deploy updates to the staging or production environments for the worker.

## 2. Root Cause
- **Monorepo / Package Manager Quirks:** The issue stemmed from an unintended interaction between Cloudflare's auto-detected build steps and `pnpm` workspaces.
- Cloudflare's build system auto-detected `pnpm` from our lockfiles and automatically ran `pnpm install --frozen-lockfile`.
- Because the worker directory (`apps/core/workers/service/`) is inside our project but isn't explicitly configured as a workspace member, `pnpm` traversed upwards until it found the `pnpm-workspace.yaml` in the core directory.
- `pnpm` then executed the install for the core application, placing dependencies in `apps/core/node_modules/`.
- Since `@cloudflare/containers` was only listed in the worker's local `package.json`, it was entirely skipped by this workspace-level `pnpm install`.
- When `npx wrangler deploy` subsequently ran, Wrangler's `esbuild` bundler couldn't find the dependency anywhere in the tree.

## 3. The Resolution
- **Using npm for Isolation:** The fix was to switch the deploy script in the worker's `package.json` to explicitly use `npm` instead of relying on the environment's default `pnpm` command:
  ```json
  "scripts": {
    "deploy:staging": "npm install && npx wrangler deploy --env staging"
  }
  ```
- **Why this works:** `npm` ignores `pnpm-workspace.yaml` and `pnpm-lock.yaml`. When `npm install` is explicitly invoked within the worker directory, it successfully parses the local `package.json`, creating a local `node_modules` folder with the necessary dependencies. Wrangler then successfully resolves and bundles the code.
