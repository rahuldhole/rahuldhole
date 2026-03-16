<script setup lang="ts">
const { data: page } = await useAsyncData('about', () => {
  return queryCollection('about').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description,
  keywords: page.value?.seo?.keywords
})
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      orientation="horizontal"
      :ui="{
        container: 'lg:flex sm:flex-row items-center',
        title: '!mx-0 text-left',
        description: '!mx-0 text-left',
        links: 'justify-start'
      }"
    >
      <img
        src="/profile.jpeg"
        alt="Rahul Dhole"
        class="sm:rotate-4 size-36 rounded-lg ring ring-default ring-offset-3 ring-offset-(--ui-bg) object-cover"
      />
    </UPageHero>
    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <MDC
        :value="page.content"
        unwrap="p"
      />
      <div class="flex flex-row justify-center items-center py-10 space-x-[-2rem]">
        <Motion
          v-for="(image, index) in page.images"
          :key="index"
          :initial="{ opacity: 0, scale: 0.9, rotate: (index % 2 === 0 ? -6 : 6) }"
          :while-in-view="{ opacity: 1, scale: 1, rotate: (index % 2 === 0 ? -3 : 3) }"
          :transition="{ delay: 0.2 * index }"
          :in-view-options="{ once: true }"
        >
          <img
            :src="image.src"
            :alt="image.alt"
            class="w-48 h-32 object-cover rounded-lg shadow-lg border-2 border-white dark:border-gray-700"
          />
        </Motion>
      </div>
    </UPageSection>
  </UPage>
</template>
