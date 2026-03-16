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
      <div v-if="projects" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-min">
        <!-- Slot 1: Large Typography / Intro Project -->
        <div v-if="projects[0]" class="col-span-12 md:col-span-12 lg:col-span-5 group relative bg-gray-50 dark:bg-zinc-900/50 rounded-[2.5rem] p-10 flex flex-col justify-between border border-transparent hover:border-primary/20 transition-all duration-500">
          <div class="flex justify-between items-start">
            <h3 class="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white uppercase leading-[0.9]">
              {{ projects[0].title.split(' ').slice(0, 2).join('\n') }}
              <span class="block text-primary mt-2">{{ projects[0].title.split(' ').slice(2).join(' ') }}</span>
            </h3>
            <div class="flex flex-col items-end gap-1 opacity-40">
              <span class="text-[10px] font-mono">SERVED BY</span>
              <span class="text-xs font-bold uppercase tracking-widest text-primary">RAHULDHOLE</span>
            </div>
          </div>
          <div class="mt-8">
            <p class="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-xs mb-6">
              {{ projects[0].description }}
            </p>
            <NuxtLink :to="projects[0].url" target="_blank" class="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary group-hover:gap-4 transition-all">
              EXPLORE CASE STUDY <UIcon name="i-lucide-arrow-right" class="size-4" />
            </NuxtLink>
          </div>
        </div>

        <!-- Slot 2: Featured Visual Small -->
        <div v-if="projects[1]" class="col-span-12 md:col-span-1 lg:col-span-3 group relative bg-white dark:bg-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col border border-gray-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-xl">
          <div class="p-8 pb-0">
            <h4 class="text-xl font-bold uppercase tracking-tighter mb-1">{{ projects[1].title }}</h4>
            <span class="text-[10px] font-bold text-primary tracking-widest uppercase">QUICK LOOK</span>
          </div>
          <div class="flex-1 flex items-center justify-center p-6 relative">
            <img :src="projects[1].image" :alt="projects[1].title + ' project preview'" class="w-full h-48 object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl" />
            <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="bg-primary text-white p-2 rounded-full shadow-lg">
                <UIcon name="i-lucide-external-link" class="size-4" />
              </div>
            </div>
          </div>
        </div>

        <!-- Slot 3: Tall Vertical Dark -->
        <div v-if="projects[2]" class="col-span-12 md:col-span-1 lg:col-span-4 lg:row-span-2 group relative bg-zinc-950 text-white rounded-[3rem] p-10 flex flex-col justify-between overflow-hidden">
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-primary/20 rounded-lg">
                <UIcon name="i-lucide-cpu" class="text-primary size-6" />
              </div>
              <span class="text-xs font-mono text-primary/80 tracking-widest">SYSTEM_VERSION_1.0</span>
            </div>
            <h3 class="text-3xl font-bold leading-tight mb-4">{{ projects[2].title }}</h3>
            <p class="text-zinc-400 text-sm leading-relaxed mb-6">{{ projects[2].description }}</p>
          </div>
          <div class="relative z-0 h-64 -mx-10 -mb-10 flex items-end justify-center">
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
            <img :src="projects[2].image" :alt="projects[2].title + ' system architecture'" class="w-full h-full object-cover opacity-50 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110" />
          </div>
          <NuxtLink :to="projects[2].url" target="_blank" class="absolute inset-0 z-20" aria-label="View Project" />
        </div>

        <!-- Slot 4: Statistics/Minimal (Project 4) -->
        <div v-if="projects[3]" class="col-span-12 md:col-span-1 lg:col-span-3 group relative bg-zinc-900 text-white rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center border border-zinc-800 transition-all hover:bg-zinc-800">
          <div class="mb-4">
             <span class="text-5xl font-bold tracking-tighter">98<span class="text-primary">%</span></span>
             <p class="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mt-2 font-bold">Optimization Rate</p>
          </div>
          <h4 class="text-sm font-bold opacity-60 uppercase tracking-widest mb-1">{{ projects[3].title }}</h4>
          <NuxtLink :to="projects[3].url" target="_blank" class="absolute inset-0" />
        </div>

        <!-- Slot 5: Large Technical Visual -->
        <div v-if="projects[4]" class="col-span-12 md:col-span-12 lg:col-span-5 group relative bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row transition-all hover:shadow-2xl">
          <div class="p-10 flex flex-col justify-center max-w-sm shrink-0 relative z-10">
            <span class="text-[10px] font-bold text-primary tracking-[0.2em] mb-4 uppercase">CORE DEVELOPMENT</span>
            <h3 class="text-3xl font-bold mb-4 tracking-tight leading-none">{{ projects[4].title }}</h3>
            <div class="flex gap-2">
              <UBadge v-for="tag in projects[4].tags.slice(0, 3)" :key="tag" :label="tag" variant="subtle" class="rounded-full bg-gray-100 dark:bg-zinc-800 text-[10px]" />
            </div>
          </div>
          <div class="relative flex-1 min-h-[300px] bg-gray-50 dark:bg-black/20">
            <img :src="projects[4].image" :alt="projects[4].title + ' development interface'" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
          </div>
          <NuxtLink :to="projects[4].url" target="_blank" class="absolute inset-0" />
        </div>

        <!-- Slot 6: Logo/Brand Oriented (Project 6) -->
        <div v-if="projects[5]" class="col-span-12 md:col-span-1 lg:col-span-4 group relative bg-gray-50 dark:bg-zinc-900 border border-transparent hover:border-primary/30 rounded-[2.5rem] p-8 flex items-center justify-center transition-all duration-500">
           <div class="text-center group-hover:scale-105 transition-transform duration-500">
             <div class="flex items-center justify-center gap-3 mb-4">
               <UIcon name="i-lucide-zap" class="size-8 text-primary shadow-lg shadow-primary/20" />
               <h4 class="text-2xl font-black italic tracking-tighter uppercase">{{ projects[5].title }}</h4>
             </div>
             <p class="text-xs font-mono text-gray-500 uppercase tracking-widest">{{ projects[5].date }} PREVIEW VERSION</p>
           </div>
           <NuxtLink :to="projects[5].url" target="_blank" class="absolute inset-0" />
        </div>

        <!-- Slot 7: Slim Vertical Detail -->
        <div v-if="projects[6]" class="col-span-12 md:col-span-1 lg:col-span-3 group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-gray-100 dark:border-neutral-800 p-6 overflow-hidden flex flex-col items-center transition-all">
          <div class="relative w-full aspect-[2/3] rounded-2xl overflow-hidden mb-4">
             <img :src="projects[6].image" :alt="projects[6].title + ' visual detail'" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" />
             <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
               <span class="text-white font-bold text-sm">{{ projects[6].title }}</span>
             </div>
          </div>
          <div class="w-full flex justify-between items-center px-2">
            <div class="flex gap-1">
              <div class="size-2 rounded-full bg-primary" />
              <div class="size-2 rounded-full bg-gray-300 dark:bg-zinc-700" />
            </div>
            <span class="text-[10px] font-bold text-gray-400 uppercase">INTERNAL_DATA</span>
          </div>
          <NuxtLink :to="projects[6].url" target="_blank" class="absolute inset-0" />
        </div>

        <!-- Slot 8: Aesthetic Filler / Social Stats -->
        <div class="col-span-12 md:col-span-12 lg:col-span-5 bg-[#F8FAFC] dark:bg-zinc-900/30 rounded-[2.5rem] p-10 flex flex-col justify-between border border-transparent">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Reach</span>
              <span class="text-4xl font-bold text-gray-900 dark:text-white mt-1">12<span class="text-primary italic">+</span></span>
            </div>
            <div class="flex -space-x-3">
               <div v-for="i in 3" :key="i" class="size-10 rounded-full border-2 border-white dark:border-zinc-900 bg-gray-200 dark:bg-zinc-800" />
               <div class="size-10 rounded-full border-2 border-white dark:border-zinc-900 bg-primary flex items-center justify-center text-[10px] font-bold text-white">+5</div>
            </div>
          </div>
          <div class="h-1 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-8">
            <div class="h-full bg-primary w-3/4 rounded-full" />
          </div>
          <div class="flex justify-between items-center mt-4">
            <span class="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-widest italic">Project Velocity Status</span>
            <span class="text-[10px] font-mono text-primary font-black uppercase tracking-widest italic">Stable</span>
          </div>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>
