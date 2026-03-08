<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageSection
    v-if="page.projects"
    :title="page.projects.title"
    :description="page.projects.description"
    :ui="{
      container: '!p-0 gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'mt-2 text-left'
    }"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      <Motion
        v-for="(project, index) in page.projects.items"
        :key="index"
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
          />
        </ULink>
      </Motion>
    </div>
  </UPageSection>
</template>
