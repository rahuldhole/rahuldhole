<script setup lang="ts">
const { data: gistApps } = await useAsyncData('gist-apps', async () => {
  try {
    const apps = await $fetch<any[]>('https://gist.rahuldhole.com/apps.json', { timeout: 5000 })
    return Array.isArray(apps) ? apps : []
  } catch (error) {
    console.error('Failed to fetch gist apps:', error)
    return []
  }
})

const faToLucideOverrides: Record<string, string> = {
  'compress': 'archive',
  'tree': 'tree-deciduous',
  'robot': 'bot',
  'table-columns': 'columns-3'
}

function getLucideIcon(faClass: string) {
  if (!faClass) return 'i-lucide-rocket'
  
  const match = faClass.match(/fa-([a-z0-9-]+)/g)
  if (!match) return 'i-lucide-rocket'
  
  const iconPart = match.find(m => m !== 'fa-solid' && m !== 'fa-regular' && m !== 'fa-brands')
  if (!iconPart) return 'i-lucide-rocket'
  
  const iconName = iconPart.replace('fa-', '')
  const lucideName = faToLucideOverrides[iconName] || iconName
  
  return `i-lucide-${lucideName}`
}

const apps = computed(() => {
  if (!gistApps.value) return []
  return gistApps.value.map(app => {
    const icon = getLucideIcon(app.icon)
    return {
      title: app.title,
      description: app.description,
      icon,
      category: app.category || 'Gist Apps',
      url: `https://gist.rahuldhole.com/${app.path || ''}`
    }
  })
})
</script>

<template>
  <div v-if="apps.length > 0" class="mt-24 pt-16 border-t border-gray-100 dark:border-zinc-800">
    <div class="flex items-center gap-4 mb-8">
      <h2 class="text-lg md:text-xl font-bold tracking-tight text-gray-400 dark:text-zinc-500 uppercase">
        Experiments & Micro Apps
      </h2>
      <div class="h-[1px] flex-1 bg-gray-100 dark:bg-zinc-800/50"></div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <NuxtLink v-for="app in apps" :key="app.title" :to="app.url" target="_blank" class="group flex flex-col bg-gray-50/50 dark:bg-zinc-900/30 hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-2xl p-4 border border-gray-200/50 dark:border-zinc-800/30 transition-all shadow-sm hover:shadow-md">
        <div class="flex items-start gap-4">
          <div class="shrink-0 flex items-center justify-center size-12 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200/50 dark:border-zinc-700/30 group-hover:scale-105 transition-transform overflow-hidden shadow-sm">
            <UIcon :name="app.icon" class="size-5 text-gray-400 dark:text-zinc-500 group-hover:text-primary transition-colors" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors truncate">{{ app.title }}</h3>
            <p class="text-[11px] text-gray-500 dark:text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{{ app.description }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
