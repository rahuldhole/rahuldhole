<script setup lang="ts">
const route = useRoute()

const items = computed(() => [{
  label: 'Home',
  icon: 'i-lucide-home',
  to: '/'
}, {
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
}])

const { open } = useContentSearch()

function openSearch() {
  open.value = true
}
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-2">
        <img src="/profile.jpeg" class="w-8 h-8 rounded-full object-cover" alt="Rahul Dhole">
        <span class="font-semibold text-sm hidden sm:inline">Rahul Dhole</span>
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
    />

    <template #right>
      <UColorModeButton />

      <UButton
        icon="i-lucide-search"
        color="neutral"
        variant="ghost"
        aria-label="Search"
        @click="openSearch"
      />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />

      <USeparator class="my-6" />

      <UButton
        label="Search"
        icon="i-lucide-search"
        color="neutral"
        variant="subtle"
        block
        class="mb-3"
        @click="openSearch"
      />
    </template>
  </UHeader>
</template>
