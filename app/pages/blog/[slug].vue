<script setup lang="ts">
const route = useRoute()
const colorMode = useColorMode()

const giscusTheme = computed(() => colorMode.value === 'dark' ? 'dark' : 'light')

const { data: post } = await useAsyncData(route.path, () => queryCollection('posts').path(route.path).first())
if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('posts', route.path, {
    fields: ['description']
  })
})

const title = post.value.seo?.title || post.value.title
const description = post.value.seo?.description || post.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  keywords: post.value.seo?.keywords || post.value.keywords || post.value.badge?.label
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': title,
        'description': description,
        'image': post.value.image?.src || 'https://rahuldhole.com/profile.jpeg',
        'datePublished': post.value.date,
        'author': {
          '@type': 'Person',
          'name': post.value.authors?.[0]?.name || 'Rahul Dhole'
        }
      })
    }
  ]
})

if (post.value.image?.src) {
  defineOgImage({
    url: post.value.image.src
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

        <UContentSurround :surround="surround" />
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
</style>
