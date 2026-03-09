# Giscus Setup Guide

This guide explains how to set up Giscus comments in your Nuxt application.

## Prerequisites

1.  A public GitHub repository.
2.  The [giscus](https://github.com/apps/giscus) GitHub App installed on your repository.
3.  Discussions enabled in your repository.

## Configuration

Go to [giscus.app](https://giscus.app/) and follow the instructions to get your configuration. You'll need:

- `repo`: Your repository (e.g., `username/repo`).
- `repoId`: Your repository ID.
- `category`: The Discussion category to use (e.g., `Announcements`).
- `categoryId`: The ID of the discussion category.

## Usage

You can use the `<Giscus />` component in any of your pages or components.

```vue
<template>
  <Giscus
    repo="rahuldhole/rahuldhole"
    repo-id="MDEwOlJlcG9zaXRvcnkzNTY4NDAyMDM="
    category="rahuldhole.com"
    category-id="DIC_kwDOFUTzC84C4BDB"
    mapping="pathname"
    strict="0"
    reactions-enabled="1"
    emit-metadata="1"
    input-position="top"
    theme="preferred_color_scheme"
    lang="en"
    loading="lazy"
  />
</template>
```

### Props

The component accepts the following props:

| Prop | Type | Description |
| :--- | :--- | :--- |
| `repo` | `Repo` | Your repository (e.g., `username/repo`). |
| `repoId` | `string` | Your repository ID. |
| `category` | `string` | The Discussion category to use. |
| `categoryId` | `string` | The ID of the discussion category. |
| `mapping` | `Mapping` | The mapping between the page and the discussion (e.g., `pathname`, `url`, `title`). |
| `term` | `string` | The term to use for mapping (if applicable). |
| `theme` | `Theme` | The theme to use (e.g., `light`, `dark`, `preferred_color_scheme`). |
| `strict` | `BooleanString` | Whether to use strict mapping (`0` or `1`). |
| `reactionsEnabled` | `BooleanString` | Whether to enable reactions (`0` or `1`). |
| `emitMetadata` | `BooleanString` | Whether to emit metadata (`0` or `1`). |
| `inputPosition` | `InputPosition` | The position of the input box (`top` or `bottom`). |
| `lang` | `AvailableLanguage` | The language to use (e.g., `en`, `fr`). |
| `loading` | `Loading` | The loading strategy (`lazy` or `eager`). |

## Internal Implementation Details

The component is located at `app/components/Giscus.vue`. It uses the `giscus` library and wraps the `<giscus-widget>` custom element.

The `nuxt.config.ts` is configured to recognize the custom element:

```typescript
export default defineNuxtConfig({
  // ...
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'giscus-widget'
    }
  }
})
```
