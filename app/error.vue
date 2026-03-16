<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true
  }
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: 'Page not found - Rahul Dhole',
  description: 'We are sorry but this page could not be found.',
  robots: 'noindex, follow'
})

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('posts'))
const { data: files } = useLazyAsyncData('search', () => Promise.all([
  queryCollectionSearchSections('posts'),
  queryCollectionSearchSections('index'),
  queryCollectionSearchSections('about'),
  queryCollectionSearchSections('blog'),
  queryCollectionSearchSections('projectsPage')
]).then(r => r.flat()), {
  server: false
})

const links = [{
  label: 'Docs',
  icon: 'i-lucide-book',
  to: '/docs/getting-started'
}, {
  label: 'Pricing',
  icon: 'i-lucide-credit-card',
  to: '/pricing'
}, {
  label: 'Blog',
  icon: 'i-lucide-pencil',
  to: '/blog'
}]
</script>

<template>
  <div>
    <AppHeader />

    <UMain>
      <UContainer>
        <UPage>
          <UError :error="error" />
        </UPage>
      </UContainer>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch :files="files" shortcut="meta_k" :navigation="navigation" :links="links"
        :fuse="{ resultLimit: 42 }" />
    </ClientOnly>

    <UToaster />
  </div>
</template>
