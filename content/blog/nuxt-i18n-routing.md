---
title: "4 Common Routing Traps When Migrating to Nuxt i18n"
authors:
  - name: Rahul Dhole
    to: /
    avatar:
      src: /profile.png
badge:
  label: Nuxt
date: 2026-09-28
description: "How to fix broken navigation, missing widgets, and active links when migrating a NuxtJS app to @nuxtjs/i18n."
seoImage:
  src: https://placehold.co/800x400/0f172a/3b82f6?text=Nuxt+i18n+Routing
pinned: false
---

If you're adding translations to your NuxtJS app using `@nuxtjs/i18n`, you probably expect it to be a simple config change. But there is a massive gotcha that caught me totally off guard while translating [neoncv.ai](https://neoncv.ai): your URLs are no longer static.

Depending on your i18n routing strategy (like `prefix_except_default` or `prefix`), that predictable `/dashboard` route dynamically shifts to `/fr/dashboard`, `/ja/dashboard`, or `/es/dashboard`. 

This one detail shatters standard Vue routing logic relying on exact path strings. After untangling broken links and missing transitions, I realized most tutorials skip the painful part: retrofitting a large, existing codebase.

Here are 4 architectural traps you will hit, and the senior-level patterns you should use instead.

---

## Trap 1: Brittle Path Checking 

It's common to check if a user is inside a specific section of the app to trigger middleware, animations, or load third-party scripts (like a support chat widget only on marketing pages).

**The Mistake:**
```javascript
const route = useRoute()

// ❌ Breaks instantly on localized paths like /fr/tracker
const isTrackerChild = route.path.startsWith('/tracker/')

// ❌ A fragile string-sniffing workaround
const routeName = String(route.name || '')
const isTrackerChildWorkaround = routeName.startsWith('tracker-')
```

Relying on `route.path` fails because the path changes with locales. Switching to `route.name.startsWith()` is slightly better, but replaces one brittle hack with another. What if someone renames `tracker/[id].vue` to `tracker/detail-[id].vue`? Or what if `tracker-settings.vue` accidentally triggers it?

**The Senior Fix: Route Meta**

Use Vue Router's native `route.meta`. It's immune to locale prefixes, renaming, and string sniffing.

Define it in your pages:
```javascript
// pages/tracker/[id].vue
definePageMeta({
  section: 'tracker',
  requiresAuth: true,
  loadSupportChat: false
})
```

Check it in your middleware or computed properties:
```javascript
// middleware/auth.ts or chat widget logic
const route = useRoute()
const isTrackerChild = route.meta.section === 'tracker'
```

---

## Trap 2: Context-Blind Navigation

If you have custom "go back" buttons or logic that redirects users, you likely have navigation calls scattered everywhere. 

**The Mistake:**
```javascript
const router = useRouter()

// ❌ Kicks the user out of their localized environment
function goBack() {
  router.push('/pricing')
}
```

If a user from Japan reading your pricing page triggers this, they are instantly kicked back to the default English route. 

**The Fix: `navigateTo` and `<NuxtLinkLocale>`**

For programmatic navigation, wrap the path in `useLocalePath()` and use Nuxt's `navigateTo` (which safely handles SSR context and cross-environment navigation, unlike raw `router.push`).

```javascript
const localePath = useLocalePath()

// ✅ Safely navigates while preserving locale and SSR context
async function goBack() {
  await navigateTo(localePath('/pricing'))
}
```

For template navigation, stop hardcoding `<NuxtLink to="/pricing">`. Use the built-in `<NuxtLinkLocale>` component instead. It automatically wraps your paths in `localePath()` under the hood.

```vue
<!-- ✅ Automatically resolves to /fr/pricing for French users -->
<NuxtLinkLocale to="/pricing">Pricing</NuxtLinkLocale>
```

---

## Trap 3: Reinventing Active Link States

When building a custom sidebar or navigation menu, you need to highlight the active route.

**The Mistake:**
Manually hacking active link detection by comparing strings. 

```javascript
// ❌ Custom logic that fails on nested routes and edge cases
const isActive = (path) => route.path.startsWith(localePath(path))
```

This gets messy incredibly fast, and edge cases (like `/tracker` matching `/tracker-archive` due to `.startsWith()`) will inevitably cause bugs.

**The Fix: Native Router Link Resolution**

Don't reinvent the wheel. `<NuxtLinkLocale>` natively applies standard `router-link-active` and `router-link-exact-active` classes automatically. 

If you *must* build a highly custom wrapper component that can't use `<NuxtLinkLocale>` directly, leverage Vue Router's `useLink` with the localized path to tap into its robust resolution engine.

```javascript
const localePath = useLocalePath()

// Leverage Vue Router's bulletproof logic
const { isActive, isExactActive } = useLink({ to: localePath('/dashboard') })
```

---

## Trap 4: Locale Switching & Query Preservation

Adding a language toggle seems easy until your users try it mid-session on a dynamic route or a page with active filters.

**The Mistake:**
```vue
<!-- ❌ Loses route parameters and query strings -->
<a href="/fr/search">Français</a>
```

If a user is on `/search?q=nuxt` and clicks your language toggle, redirecting them strictly to `/fr/search` wipes out their search query. The same happens on dynamic routes like `/users/123`.

**The Fix: `switchLocalePath()`**

`@nuxtjs/i18n` provides a `switchLocalePath()` composable specifically for this. It takes the current route context (including dynamic parameters and query strings) and safely translates it to the target language.

```vue
<script setup>
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <div>
    <!-- ✅ Preserves /search?q=nuxt -> /fr/search?q=nuxt -->
    <NuxtLink :to="switchLocalePath('fr')">
      Français
    </NuxtLink>
  </div>
</template>
```

## Wrapping up

Integrating `@nuxtjs/i18n` into a production codebase taught me these vital rules:

1. Ditch `route.path` checking in favor of `route.meta`.
2. Replace hardcoded `router.push()` with `navigateTo(localePath())` and `<NuxtLinkLocale>`.
3. Let Vue Router handle active link states.
4. Always use `switchLocalePath()` for language toggles.

Adopt these architectural patterns early, and you'll save yourself massive headaches taking your app global.

---

### Bonus: The AI Refactoring Prompt

If you are retrofitting a large, existing codebase and don't want to hunt down every single `router.push` and `route.path` manually, drop this prompt into your AI coding assistant (like GitHub Copilot, Cursor, or Gemini):

> "I am migrating my Nuxt 3 application to `@nuxtjs/i18n`. Scan my `pages`, `components`, and `middleware` directories for Nuxt routing anti-patterns. 
> 
> Specifically, look for:
> 1. Hardcoded string checks against `route.path` or `route.name`.
> 2. Direct usage of `router.push()` or `navigateTo()` with static strings.
> 3. Standard `<NuxtLink>` components or manual active link logic.
> 
> Refactor them using Nuxt i18n best practices:
> - Replace route path checking with `route.meta`.
> - Wrap programmatic navigation paths in `localePath()`.
> - Replace standard `<NuxtLink>` with `<NuxtLinkLocale>`.
> - Use `switchLocalePath()` for language toggles."

Let the AI do the heavy lifting, and enjoy your newly localized app!
