<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  imageComponent?: {
    title?: string
    subtitle?: string
    icon?: string
    type?: string
    bgClass?: string
    textClass?: string
  }
  fallbackTitle?: string
}>()

const title = computed(() => props.imageComponent?.title || props.fallbackTitle)
const icon = computed(() => props.imageComponent?.icon || 'i-lucide-rocket')

// Base style variations
const type = computed(() => props.imageComponent?.type || 'default')

const backgroundClass = computed(() => {
  if (props.imageComponent?.bgClass) return props.imageComponent.bgClass
  switch (type.value) {
    case 'minimal': return 'bg-gray-50 dark:bg-zinc-900 border-2 border-gray-100 dark:border-zinc-800'
    case 'vibrant': return 'bg-gradient-to-tr from-pink-500/20 via-rose-500/10 to-orange-500/20 dark:from-pink-500/30 dark:via-rose-500/10 dark:to-orange-500/30'
    case '3d': return 'bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 shadow-inner'
    default: return 'bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-500/20 dark:via-purple-500/5 dark:to-transparent border-b-4 border-indigo-500/20'
  }
})

const textClass = computed(() => {
  if (props.imageComponent?.textClass) return props.imageComponent.textClass
  switch (type.value) {
    case '3d': return 'text-white'
    default: return 'text-gray-900 dark:text-white'
  }
})

const iconClass = computed(() => {
  switch (type.value) {
    case '3d': return 'text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]'
    case 'vibrant': return 'text-rose-500 drop-shadow-md'
    case 'minimal': return 'text-gray-400 dark:text-zinc-500'
    default: return 'text-indigo-500 drop-shadow-sm'
  }
})
</script>

<template>
  <div
    class="w-full h-full relative overflow-hidden flex flex-col items-center justify-center p-6 text-center"
    :class="backgroundClass"
  >
    <!-- Visual Backdrops based on type -->
    <template v-if="type === 'default'">
      <div class="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      <div class="absolute -right-10 -top-10 size-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
      <div class="absolute left-10 -bottom-10 size-40 bg-purple-500/20 blur-3xl rounded-full"></div>
    </template>
    
    <template v-else-if="type === 'minimal'">
      <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style="background-image: radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -left-12 top-1/2 -translate-y-1/2 size-24 border border-gray-200 dark:border-zinc-700 rounded-full"></div>
    </template>

    <template v-else-if="type === 'vibrant'">
      <div class="absolute inset-0 bg-[url('/noise.png')] opacity-[0.15] mix-blend-overlay pointer-events-none"></div>
      <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/20 to-transparent mix-blend-overlay transform skew-x-12"></div>
      <div class="absolute -bottom-8 -left-8 size-32 bg-orange-500/40 blur-2xl rounded-full mix-blend-multiply dark:mix-blend-screen"></div>
    </template>

    <template v-else-if="type === '3d'">
      <!-- Large typographic background -->
      <div class="absolute -right-4 -bottom-8 text-[120px] font-black leading-none text-black/10 select-none pointer-events-none transform -rotate-12">
        {{ title?.[0] }}
      </div>
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent"></div>
    </template>
    
    <!-- Content Foreground -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full gap-3">
      <div 
        class="p-3 mb-2 flex items-center justify-center transition-transform group-hover:scale-110 duration-500"
        :class="{
          'bg-white/50 dark:bg-zinc-800/50 rounded-2xl backdrop-blur-md border border-white/20 dark:border-white/5': type === 'default',
          'bg-gray-100 dark:bg-zinc-800 rounded-full': type === 'minimal',
          'bg-white/20 rounded-[2rem] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] backdrop-blur-sm border border-white/30': type === 'vibrant' || type === '3d'
        }"
      >
        <UIcon
          :name="icon"
          class="size-8"
          :class="iconClass"
        />
      </div>
      <h3
        class="text-2xl lg:text-3xl font-black tracking-tight drop-shadow-sm line-clamp-2 px-4"
        :class="textClass"
      >
        {{ title }}
      </h3>
      <p
        v-if="imageComponent?.subtitle"
        class="text-xs font-bold tracking-widest uppercase mt-1 px-3 py-1 rounded-full"
        :class="{
          'text-indigo-500/90 bg-indigo-500/10': type === 'default',
          'text-gray-500 dark:text-zinc-400 bg-gray-200/50 dark:bg-zinc-800/50': type === 'minimal',
          'text-rose-600 bg-rose-500/10': type === 'vibrant',
          'text-white/80 bg-black/20 backdrop-blur-sm': type === '3d'
        }"
      >
        {{ imageComponent.subtitle }}
      </p>
    </div>
  </div>
</template>
