<script setup lang="ts">
const route = useRoute()
const colorMode = useColorMode()

const giscusTheme = computed(() => colorMode.value === 'dark' ? 'dark' : 'light')

const { data: post } = await useAsyncData(route.path, () => queryCollection('posts').path(route.path).first())
if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const { data: surround } = await useAsyncData(`surround-${route.params.slug}`, () => {
  return queryCollectionItemSurroundings('posts', route.path, {
    fields: ['description', 'imageComponent', 'seoImage']
  })
})

const title = post.value.seo?.title || post.value.title
const description = post.value.seo?.description || post.value.description

const seoImageUrl = (typeof post.value.seoImage === 'string' ? post.value.seoImage : post.value.seoImage?.src) as string | undefined
const imageUrl = (typeof post.value.image === 'string' ? post.value.image : post.value.image?.src) as string | undefined


useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  keywords: (post.value.seo as any)?.keywords || post.value.badge?.label,
  ogImage: seoImageUrl || imageUrl || 'https://rahuldhole.com/profile.png',
  twitterImage: seoImageUrl || imageUrl || 'https://rahuldhole.com/profile.png'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': title,
        'description': description,
        'image': seoImageUrl || imageUrl || 'https://rahuldhole.com/profile.png',
        'datePublished': post.value.date,
        'author': {
          '@type': 'Person',
          'name': post.value.authors?.[0]?.name || 'Rahul Dhole'
        }
      })
    }
  ]
})

if (seoImageUrl) {
  defineOgImage({
    url: seoImageUrl
  })
} else if (imageUrl) {
  defineOgImage({
    url: imageUrl
  })
} else {
  defineOgImageComponent('Saas', {
    headline: 'Blog'
  })
}
</script>

<template>
  <UContainer v-if="post">
    <UPageHeader :title="post.title" :description="post.description">
      <template #headline>
        <UBadge v-bind="post.badge" variant="subtle" />
        <span class="text-muted">&middot;</span>
        <time class="text-muted">{{ new Date(post.date).toLocaleDateString('en', {
          year: 'numeric', month: 'short', day:
            'numeric'
        }) }}</time>
      </template>

      <div class="flex flex-wrap items-center gap-3 mt-4">
        <UButton v-for="(author, index) in post.authors" :key="index" :to="author.to" color="neutral" variant="subtle"
          target="_blank" size="sm">
          <UAvatar v-bind="author.avatar" alt="Author avatar" size="2xs" />

          {{ author.name }}
        </UButton>
      </div>
    </UPageHeader>

    <UPage>
      <UPageBody>
        <ContentRenderer v-if="post" :value="post" />

        <section class="giscus-section">
          <h2 class="giscus-heading">
            <UIcon name="i-lucide-message-circle" class="giscus-heading-icon" />
            Comments
          </h2>
          <Giscus repo="rahuldhole/rahuldhole" repo-id="MDEwOlJlcG9zaXRvcnkzNTY4NDAyMDM=" category="rahuldhole.com"
            category-id="DIC_kwDOFUTzC84C4BDB" mapping="pathname" strict="0" reactions-enabled="1" emit-metadata="1"
            input-position="top" :theme="giscusTheme" lang="en" loading="lazy" />
        </section>

        <USeparator v-if="surround?.length" />

        <div v-if="surround?.length" class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-8">
          <template v-for="(link, index) in surround" :key="index">
            <NuxtLink v-if="link" :to="link.path" class="group relative bg-white dark:bg-zinc-900 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-zinc-800 hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
              <div class="aspect-[16/9] overflow-hidden relative border-b border-gray-100 dark:border-zinc-800">
                <BlogImageComponent v-if="(link as any).imageComponent" :imageComponent="(link as any).imageComponent" :fallbackTitle="link.title" :fallbackDescription="link.description" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <img v-else-if="(link as any).seoImage" :src="(link as any).seoImage?.src || (link as any).seoImage" :alt="link.title" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <img v-else-if="link.image" :src="(link as any).image?.src || link.image" :alt="link.title" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
              <div class="p-5 md:p-6 flex flex-col gap-2 flex-1 justify-center">
                <div class="flex items-center gap-2 text-gray-400" :class="index === 0 ? '' : 'justify-end'">
                  <UIcon v-if="index === 0" name="i-lucide-arrow-left" class="size-4" />
                  <span class="text-[10px] font-bold uppercase tracking-widest">{{ index === 0 ? 'Previous' : 'Next' }}</span>
                  <UIcon v-if="index === 1" name="i-lucide-arrow-right" class="size-4" />
                </div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2" :class="index === 0 ? '' : 'text-right'">{{ link.title }}</h3>
                <p class="text-sm text-gray-500 line-clamp-2" :class="index === 0 ? '' : 'text-right'">{{ link.description }}</p>
              </div>
            </NuxtLink>
            <div v-else class="hidden sm:block"></div>
          </template>
        </div>
      </UPageBody>

      <template v-if="post?.body?.toc?.links?.length" #right>
        <UContentToc :links="post.body.toc.links" />
      </template>
    </UPage>
  </UContainer>
</template>

<style scoped>
.giscus-section {
  margin-top: 3rem;
  margin-bottom: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--ui-border);
}

.giscus-heading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--ui-text-highlighted);
}

.giscus-heading-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--ui-primary);
}

:deep(a code) {
  color: var(--ui-primary);
  background-color: color-mix(in srgb, var(--ui-primary) 10%, transparent);
  border: 1px dashed color-mix(in srgb, var(--ui-primary) 40%, transparent);
  border-radius: 0.375rem;
  padding: 0.125rem 0.375rem;
  transition: all 0.2s ease;
}

:deep(a:hover code) {
  background-color: var(--ui-primary);
  color: white;
  border-style: solid;
}
</style>
