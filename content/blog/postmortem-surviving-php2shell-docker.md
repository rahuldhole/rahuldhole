---
title: "Patch the CVE, Don't Trigger an Accidental Refactor: Surviving PHP2Shell on Docker"
authors:
  - name: Rahul Dhole
    to: /
    avatar:
      src: /profile.png
badge:
  label: Postmortem
date: 2026-10-23
description: "How to survive PHP2Shell (CVE-2026-109618 & CVE-2026-109619) without breaking production. A guide to point patching and busting Docker layer caching."
seoImage:
  src: https://placehold.co/800x400/0f172a/3b82f6?text=Surviving+PHP2Shell+on+Docker
pinned: false
imageComponent:
  type: Postmortem
---

When a CVSS 9.2 unauthenticated Remote Code Execution drops in PHP core (PHP2Shell / CVE-2026-109618 & CVE-2026-109619), production Slack channels lose their minds.

The immediate knee-jerk reaction from most developers and ops teams is always identical:
> *"Drop everything. Upgrade all containers to PHP 8.5 right now."*

Don't do that.

Rushing a major runtime upgrade during an active vulnerability drill is how you cause the exact production downtime the attacker was hoping to achieve. You take down custom WordPress themes, break WooCommerce extensions, trigger fatal deprecation errors across payment gateways, and suddenly spend your night debugging runtime incompatibilities instead of patching a security hole.

Here is the reality of how point patches work, why your Docker layer caching is probably lying to you, and the deterministic way to patch containerized PHP stacks without breaking production.

---

## 1. Upstream Did the Heavy Lifting for You

Security releases do not force you across major version boundaries. The PHP maintainers backported fixes for both the out-of-memory memory corruption and the worker cross-request use-after-free bugs directly into active branches:

- **PHP 8.2** → `8.2.35`
- **PHP 8.3** → `8.3.36`
- **PHP 8.4** → `8.4.27`
- **PHP 8.5** → `8.5.12`

*(Note: If you are running PHP 8.1 or older, you are already past End-of-Life and on your own. You have no upstream patches and need extended vendor security repos or a scheduled upgrade window.)*

If your app is running on PHP 8.2 or 8.3, you **do not** need to move to 8.4 or 8.5 today. You only need to step to the patched point release on your existing branch. Zero syntax breaking changes, zero extension incompatibilities.

---

## 2. The Docker Tag Trap: Why "Rebuilding" Didn't Fix It

Most engineers maintain Dockerfiles that look something like this:

```dockerfile
FROM php:8.3-fpm-alpine
```

When news of the patch breaks, they run:

```bash
docker compose build
docker compose up -d
```

They think they are safe. **They are not.**

Docker tags are mutable aliases, but the Docker daemon’s caching engine is aggressively lazy:

1. Docker checks your local image cache.
2. It sees an image already tagged `php:8.3-fpm-alpine` from three weeks ago.
3. It assumes nothing has changed and builds your application container using the old, vulnerable base layer.

Unless you explicitly tell Docker to check the registry for a new manifest digest, it will happily serve cached, vulnerable binaries forever.

---

## 3. The Immutable Alternative: Pin Exact Subversions

Floating tags (`php:8.3-fpm`) are convenient for local sandbox playgrounds, but they hide state in production CI/CD pipelines.

If you pin your Dockerfile to the exact patched point release, you introduce deterministic traceability into Git version control:

```dockerfile
# Lock to the patched upstream release
FROM php:8.3.36-fpm-alpine
```

Now the Git diff explicitly documents that the security vulnerability was evaluated, addressed, and tracked.

---

## 4. The 3-Step Clean Rebuild Playbook

Whether you pin exact subversions or use floating branch tags, you must force Docker to pull upstream manifests and ignore local cached base layers.

### Step 1: Force Upstream Pull and Bypass Cache

Run your build with `--pull` (forces registry check for new tag digests) and `--no-cache`:

```bash
docker compose build --pull --no-cache php
```

### Step 2: Force Recreate the Service Container

Prevent Docker from reusing an existing container instance:

```bash
docker compose up -d --force-recreate php
```

### Step 3: Verify the Running Runtime

Never trust command output—trust the running process memory. Execute directly inside the active container:

```bash
docker compose exec php php -v
```

Look at the output:

* `PHP 8.3.36 (cli) ...` → **Patched.**
* `PHP 8.3.35` or lower → **Still vulnerable.** Investigate your registry pulls immediately.

---

## 5. Stopgap Protections While You Roll Out

If you operate multiple environments or orchestrate fleets that take time to redeploy, lock down the vector at your ingress layer:

1. **WAF Body Inspection:** Ensure your edge proxy (Cloudflare, AWS WAF) is active. Cloudflare has rolled out managed rule mitigations across all tiers targeting multipart/OOM fuzzing payloads.
2. **Cycle PHP-FPM Workers Aggressively:** In your pool configuration (`www.conf`), clamp `pm.max_requests = 100`. This destroys and respawns workers frequently, sharply limiting stale memory persistence across requests.
3. **Limit POST Body Sizes at the Reverse Proxy:** Clamp `client_max_body_size` in Nginx/Traefik down to what your app actually requires so large payload floods never reach PHP workers in the first place.

---

## Key Takeaway

A zero-day or critical CVE drill is not the time to modernize your runtime architecture.

Stay on your active minor branch, pull the exact upstream point release, force Docker to bust its layer cache, and verify the running process.

**Patch the vulnerability. Don't trigger an accidental refactor.**
