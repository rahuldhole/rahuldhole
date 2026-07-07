<script setup lang="ts">
const { data: page } = await useAsyncData('projects-page', () => {
  return queryCollection('projectsPage').path('/projects').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects').all()
})

const categories = [
  'Commercial Products',
  'Actively Maintained',
  'Maintenance Mode',
  'Archived'
]

const groupedProjects = computed(() => {
  const currentProjects = projects.value
  if (!currentProjects) return []
  
  return categories.map(cat => {
    return {
      name: cat,
      items: currentProjects
        .filter(p => p.category === cat)
        .sort((a, b) => (a.rank || 99) - (b.rank || 99))
    }
  }).filter(c => c.items.length > 0)
})

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description,
  keywords: page.value?.seo?.keywords as string | undefined
})
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :links="page.links"
      :ui="{
        title: '!mx-0 text-left',
        description: '!mx-0 text-left',
        links: 'justify-start'
      }"
    />
    <UPageSection
      :ui="{
        container: '!pt-0 pb-24 max-w-7xl mx-auto'
      }"
    >
      <div v-if="projects" class="space-y-16 md:space-y-24">
        <div v-for="category in groupedProjects" :key="category.name" class="flex flex-col gap-6 md:gap-8">
          
          <div class="flex items-center gap-4">
            <h2 class="text-2xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
              {{ category.name }}
            </h2>
            <div class="h-[1px] flex-1 bg-gray-200 dark:bg-zinc-800"></div>
          </div>

          <div v-if="category.name === 'Commercial Products'" class="grid grid-cols-1 gap-6">
            <div v-for="project in category.items" :key="project.title" class="group relative bg-white dark:bg-zinc-900 rounded-[2rem] lg:rounded-[3rem] p-6 md:p-10 flex flex-col md:flex-row gap-8 border border-gray-100 dark:border-zinc-800 transition-all hover:shadow-2xl hover:border-primary/20 overflow-hidden">
              <div class="absolute -right-40 -top-40 size-96 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              
              <div class="flex-1 relative z-10 flex flex-col justify-center">
                <div class="flex items-center gap-4 mb-4">
                  <img v-if="project.image" :src="project.image" class="h-12 w-auto object-contain drop-shadow-md" alt="logo" />
                  <h3 v-else class="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">{{ project.title }}</h3>
                </div>
                
                <p class="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed mb-6">
                  {{ project.description }}
                </p>
                <div class="flex flex-wrap gap-2 mb-6">
                  <UBadge v-for="tag in project.tags?.slice(0, 4)" :key="tag" :label="tag" variant="subtle" class="rounded-full bg-gray-100 dark:bg-zinc-800" />
                </div>
                <div class="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-primary group-hover:gap-4 transition-all">
                  VISIT PRODUCT <UIcon name="i-lucide-arrow-right" class="size-4" />
                </div>
              </div>
              
              <NuxtLink :to="project.url" target="_blank" class="absolute inset-0 z-20" aria-label="View Project" />
            </div>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="project in category.items" :key="project.title" class="group relative bg-white dark:bg-zinc-900 rounded-[1.5rem] md:rounded-[2rem] p-6 border border-gray-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col min-h-[200px]">
              <div class="flex justify-between items-start mb-4">
                <h4 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors">{{ project.title }}</h4>
                <UIcon v-if="project.pinned" name="i-lucide-pin" class="text-primary size-4" />
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 flex-1 mb-6">{{ project.description }}</p>
              
              <div class="flex items-center justify-between mt-auto">
                <div class="flex flex-wrap gap-2">
                  <UBadge v-for="tag in project.tags?.slice(0, 2)" :key="tag" :label="tag" size="xs" variant="subtle" class="rounded-full" />
                </div>
                <UIcon name="i-lucide-external-link" class="size-4 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              
              <NuxtLink :to="project.url" target="_blank" class="absolute inset-0" aria-label="View Project" />
            </div>
          </div>

        </div>
      </div>
    </UPageSection>
  </UPage>
</template>
