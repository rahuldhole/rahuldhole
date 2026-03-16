<script setup lang="ts">
const route = useRoute()
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
  twitterCard: 'summary_large_image',
  author: 'Rahul Dhole',
  ogType: 'website',
  ogSiteName: 'Rahul Dhole',
  twitterCreator: '@dholerahul',
  twitterSite: '@dholerahul'
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://rahuldhole.com' + route.path }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': 'Rahul Dhole',
        'url': 'https://rahuldhole.com',
        'jobTitle': 'Full-Stack Engineer',
        'sameAs': [
          'https://linkedin.com/in/dholerahul',
          'https://github.com/rahuldhole'
        ],
        'image': 'https://rahuldhole.com/profile.jpeg'
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Rahul Dhole',
        'url': 'https://rahuldhole.com',
        'author': 'Rahul Dhole',
        'description': 'Portfolio of Rahul Dhole, showcasing modern web applications and tools.'
      })
    }
  ]
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
