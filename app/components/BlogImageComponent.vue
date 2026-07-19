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

const typeAliases: Record<string, string> = {
  'Cloud': 'abstract',
  'Linux': 'editorial',
  'DevOps': 'code',
  'Postmortem': 'postmortem',
  'DX': 'abstract',
  'Journey': 'editorial',
  'Blooper': 'blooper',
  'Proxmox': 'abstract',
  'Git': 'code',
  'Network': 'default',
  'Networking': 'default',
  'Security': 'code',
  'Pro Tip': 'editorial'
}

const iconAliases: Record<string, string> = {
  'Cloud': 'i-lucide-cloud',
  'Linux': 'i-lucide-terminal',
  'DevOps': 'i-lucide-boxes',
  'Postmortem': 'i-lucide-activity',
  'DX': 'i-lucide-keyboard',
  'Journey': 'i-lucide-compass',
  'Blooper': 'i-lucide-bug',
  'Proxmox': 'i-lucide-server',
  'Git': 'i-lucide-git-branch',
  'Network': 'i-lucide-network',
  'Networking': 'i-lucide-network',
  'Security': 'i-lucide-shield-check',
  'Pro Tip': 'i-lucide-lightbulb'
}

const rawType = computed(() => props.imageComponent?.type || 'default')

const type = computed(() => {
  return typeAliases[rawType.value] || rawType.value
})

const icon = computed(() => props.imageComponent?.icon || iconAliases[rawType.value] || 'i-lucide-file-text')

const backgroundClass = computed(() => {
  if (props.imageComponent?.bgClass) return props.imageComponent.bgClass
  switch (type.value) {
    case 'blooper': return 'bg-orange-50 dark:bg-[#1a0f00] border-t-8 border-orange-500'
    case 'postmortem': return 'bg-slate-50 dark:bg-slate-950 border border-red-200 dark:border-red-900/50'
    case 'editorial': return 'bg-white dark:bg-[#111] border-l-[12px] border-primary'
    case 'code': return 'bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800'
    case 'abstract': return 'bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-teal-500/20 dark:from-cyan-500/30 dark:via-blue-500/10 dark:to-teal-500/30'
    default: return 'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/5 dark:to-transparent'
  }
})

const textClass = computed(() => {
  if (props.imageComponent?.textClass) return props.imageComponent.textClass
  switch (type.value) {
    case 'blooper': return 'text-orange-900 dark:text-orange-100'
    case 'postmortem': return 'text-slate-900 dark:text-slate-100 font-mono tracking-tight'
    case 'code': return 'text-green-600 dark:text-green-400 font-mono'
    case 'editorial': return 'text-gray-900 dark:text-gray-100 font-serif'
    default: return 'text-gray-900 dark:text-white'
  }
})

const iconClass = computed(() => {
  switch (type.value) {
    case 'blooper': return 'text-orange-500 drop-shadow-md'
    case 'postmortem': return 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]'
    case 'code': return 'text-gray-500'
    case 'editorial': return 'text-primary'
    case 'abstract': return 'text-teal-500 drop-shadow-md'
    default: return 'text-primary drop-shadow-md'
  }
})
</script>

<template>
  <div
    class="w-full h-full relative overflow-hidden flex flex-col items-center justify-center p-6 text-center transition-all duration-500 group-hover:shadow-inner"
    :class="backgroundClass"
  >
    <!-- Visual Backdrops based on type -->
    <template v-if="type === 'default'">
      <div class="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      <div class="absolute -right-20 -top-20 size-40 bg-primary/20 blur-3xl rounded-full transition-transform duration-[2000ms] group-hover:translate-x-10 group-hover:-translate-y-10"></div>
      <div class="absolute -left-20 -bottom-20 size-40 bg-primary/10 blur-3xl rounded-full transition-transform duration-[2000ms] group-hover:-translate-x-10 group-hover:translate-y-10"></div>
    </template>
    
    <template v-else-if="type === 'editorial'">
      <div class="absolute inset-0 opacity-[0.05]" style="background-image: repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 10px);"></div>
      <div class="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-black/5 dark:from-white/5 to-transparent"></div>
    </template>

    <template v-else-if="type === 'code'">
      <div class="absolute inset-0 opacity-[0.05] dark:opacity-10 bg-[url('/noise.png')] mix-blend-overlay pointer-events-none"></div>
      <div class="absolute top-2 left-4 text-[10px] text-gray-500 dark:text-gray-700 font-mono opacity-50 flex flex-col gap-1 select-none transition-transform duration-1000 group-hover:-translate-y-1">
        <span>import { ref } from 'vue'</span>
        <span>const render = () => {</span>
        <span>  return h('div')</span>
        <span>}</span>
      </div>
      <div class="absolute -right-4 -bottom-4 text-[150px] font-black text-gray-200 dark:text-gray-800 leading-none select-none opacity-50 dark:opacity-20 transition-transform duration-1000 group-hover:scale-105">
        &lt;/&gt;
      </div>
    </template>

    <template v-else-if="type === 'blooper'">
      <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style="background-image: repeating-linear-gradient(45deg, currentColor 0, currentColor 10px, transparent 10px, transparent 20px);"></div>
      <div class="absolute -right-8 -top-8 size-32 bg-orange-500/20 blur-2xl rounded-full transition-transform duration-1000 group-hover:scale-150"></div>
      <div class="absolute bottom-4 left-4 rotate-12 opacity-10 transition-transform duration-700 group-hover:rotate-[24deg] group-hover:scale-110">
        <UIcon name="i-lucide-zap" class="size-24 text-orange-500" />
      </div>
    </template>

    <template v-else-if="type === 'postmortem'">
      <div class="absolute inset-0 opacity-[0.05] dark:opacity-10" style="background-image: linear-gradient(#ef4444 1px, transparent 1px), linear-gradient(90deg, #ef4444 1px, transparent 1px); background-size: 20px 20px;"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-slate-950 via-transparent to-transparent z-0"></div>
      <div class="absolute top-4 right-4 flex items-center gap-2 z-0">
        <div class="size-2 rounded-full bg-red-500 animate-pulse"></div>
        <span class="text-[8px] font-mono text-red-500 uppercase tracking-widest">INCIDENT_REPORT</span>
      </div>
      <div class="absolute -bottom-10 -left-10 opacity-5 transition-transform duration-1000 group-hover:-translate-y-5">
        <UIcon name="i-lucide-triangle-alert" class="size-48 text-red-500" />
      </div>
    </template>

    <template v-else-if="type === 'abstract'">
      <div class="absolute top-1/4 -left-10 size-48 bg-cyan-400/30 blur-[40px] rounded-full mix-blend-multiply dark:mix-blend-screen transition-transform duration-[3000ms] group-hover:translate-x-10 group-hover:translate-y-10 group-hover:scale-110"></div>
      <div class="absolute bottom-1/4 -right-10 size-48 bg-teal-400/30 blur-[40px] rounded-full mix-blend-multiply dark:mix-blend-screen transition-transform duration-[3000ms] group-hover:-translate-x-10 group-hover:-translate-y-10 group-hover:scale-110"></div>
    </template>
    
    <!-- Content Foreground -->
    <div class="relative z-10 flex flex-col items-center gap-4">
      <UIcon
        :name="icon"
        class="size-10 lg:size-14 transition-transform duration-500 group-hover:scale-110"
        :class="iconClass"
      />
      <h3
        class="text-xl lg:text-3xl font-black tracking-tight drop-shadow-sm line-clamp-4 px-2 break-words text-balance"
        :class="textClass"
      >
        {{ title }}
      </h3>
        <p
        v-if="imageComponent?.subtitle"
        class="text-xs lg:text-sm font-semibold tracking-wide uppercase mt-1 max-w-[90%] mx-auto line-clamp-2 break-words"
        :class="{
          'text-primary/80': type === 'default',
          'text-gray-500': type === 'editorial',
          'text-green-700/80 dark:text-green-400/80': type === 'code',
          'text-teal-700/80 dark:text-teal-400/80': type === 'abstract',
          'text-orange-700 dark:text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full': type === 'blooper',
          'text-red-500 dark:text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-md': type === 'postmortem'
        }"
      >
        {{ imageComponent.subtitle }}
      </p>
    </div>
  </div>
</template>
