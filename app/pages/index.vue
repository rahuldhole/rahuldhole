<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description
const keywords = page.value?.seo?.keywords

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  keywords
})
</script>

<template>
  <div v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :links="page.hero?.links"
    >
      <template #top>
        <HeroBackground />
      </template>

      <template #title>
        <span class="text-primary">{{ page.title.split(' - ')[0] }}</span><br>
        <span class="text-3xl text-muted font-light">{{ page.title.split(' - ')[1] }}</span>
      </template>

      <img src="/profile.jpeg" class="w-48 h-48 rounded-full mx-auto my-8 object-cover shadow-2xl border-4 border-[var(--ui-border)] ring-4 ring-primary/20 transition-transform duration-500 hover:scale-105" alt="Rahul Dhole" />
    </UPageHero>

    <UPageSection
      :ui="{ container: '!pt-0 lg:grid lg:grid-cols-2 lg:gap-8 max-w-[800px] mx-auto' }"
    >
      <LandingAbout :page="page" />
      <LandingWorkExperience :page="page" />
    </UPageSection>

    <LandingProjects :page="page" class="max-w-[800px] mx-auto mb-24" />
  </div>
</template>
