<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()

const { data: featuredProjects } = await useAsyncData('featured-projects', () => {
  return queryCollection('projects').order('category_rank', 'ASC').order('rank', 'ASC').limit(6).all()
})
</script>

<template>
  <UPageSection
    v-if="page.projects && featuredProjects?.length"
    :title="page.projects.title"
    :description="page.projects.description"
    :ui="{
      container: '!p-0 gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'mt-2 text-left'
    }"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      <Motion
        v-for="(project, index) in featuredProjects"
        :key="project.id"
        :initial="{ opacity: 0, scale: 0.95 }"
        :while-in-view="{ opacity: 1, scale: 1 }"
        :transition="{ delay: 0.2 + 0.1 * index }"
        :in-view-options="{ once: true }"
      >
        <ULink
          :to="project.url"
          target="_blank"
          class="block h-full transition-transform hover:-translate-y-1"
        >
          <UPageCard
            :title="project.title"
            :description="project.description"
            variant="soft"
            class="h-full border border-[var(--ui-border)] hover:border-[var(--ui-border-hovered)] bg-[var(--ui-bg-elevated)]"
          >
            <template #header v-if="project.imageComponent || project.image">
              <div class="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-t-lg bg-gray-100 dark:bg-zinc-800">
                <ProjectImageComponent v-if="project.imageComponent" :imageComponent="project.imageComponent" :fallbackTitle="project.title" :fallbackDescription="project.description" class="w-full h-48" />
                <img v-else-if="project.image" :src="project.image" :alt="project.title" class="object-cover w-full h-48" />
              </div>
            </template>
          </UPageCard>
        </ULink>
      </Motion>
    </div>
    <div class="mt-8 flex justify-center">
      <UButton
        to="/projects"
        color="primary"
        variant="outline"
        size="lg"
        trailing-icon="i-lucide-arrow-right"
      >
        Show More
      </UButton>
    </div>
  </UPageSection>
</template>
