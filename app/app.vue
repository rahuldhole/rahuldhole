<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#020618' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/profile.jpeg' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: '%s - Rahul Dhole',
  ogImage: '/profile.jpeg',
  twitterImage: '/profile.jpeg',
  twitterCard: 'summary_large_image'
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
  label: 'Projects',
  icon: 'i-lucide-folder',
  to: '/projects'
}, {
  label: 'Blog',
  icon: 'i-lucide-pencil',
  to: '/blog'
}, {
  label: 'About',
  icon: 'i-lucide-user',
  to: '/about'
}]

const { open } = useContentSearch()

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <LazyUContentSearch
        v-model:open="open"
        :files="files"
        shortcut="meta_k"
        :navigation="navigation"
        :links="links"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
