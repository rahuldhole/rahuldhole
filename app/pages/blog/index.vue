<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('blog', () => queryCollection('blog').first())
const { data: posts } = await useAsyncData(route.path, () => queryCollection('posts').all(), {
  transform: (data) => {
    return data.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }
})

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  keywords: page.value?.seo?.keywords
})

defineOgImageComponent('Saas')
</script>

<template>
  <UContainer>
    <UPageHeader
      v-bind="page"
      class="py-[50px]"
    />

    <UPageBody>
      <div v-if="posts" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 auto-rows-min">
        <!-- Card 1: Main Feature (Posts[0]) -->
        <NuxtLink v-if="posts[0]" :to="posts[0].path" class="col-span-12 md:col-span-12 lg:col-span-8 group relative bg-[#F9F7F2] dark:bg-zinc-900 rounded-[2.5rem] p-10 lg:p-14 flex flex-col justify-between overflow-hidden border border-[#E9E4D9] dark:border-zinc-800 hover:shadow-2xl transition-all duration-500">
          <div class="relative z-10">
            <span class="text-[10px] font-black tracking-[0.3em] text-[#E6391E] uppercase mb-6 block">FEATURED ARTICLE</span>
            <h3 class="text-5xl md:text-7xl font-black text-[#1A3C34] dark:text-white leading-[0.95] tracking-tighter mb-8 group-hover:text-[#E6391E] transition-colors duration-300">
              {{ posts[0].title }}
            </h3>
            <p class="text-[#1A3C34]/70 dark:text-zinc-400 text-lg md:text-xl font-medium max-w-2xl line-clamp-3">
              {{ posts[0].description }}
            </p>
          </div>
          <div class="mt-12 flex items-center justify-between relative z-10">
            <div class="flex items-center gap-4">
              <UAvatar v-if="posts[0].authors?.[0]" :src="posts[0].authors[0].avatar?.src || posts[0].authors[0].avatar" size="lg" class="border-2 border-[#1A3C34] dark:border-primary" />
              <div class="flex flex-col">
                <span class="text-xs font-bold text-[#1A3C34] dark:text-white uppercase">{{ posts[0].authors?.[0]?.name || 'Rahul Dhole' }}</span>
                <span class="text-[10px] font-medium text-gray-500 uppercase tracking-widest">{{ new Date(posts[0].date).toLocaleDateString('en', { month: 'long', year: 'numeric' }) }}</span>
              </div>
            </div>
            <UIcon name="i-lucide-arrow-right" class="size-10 text-[#E6391E] opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
          </div>
          <!-- Abstract Pattern overlay for extra polish -->
          <div class="absolute top-0 right-0 p-8 opacity-5">
            <UIcon name="i-lucide-newspaper" class="size-48" />
          </div>
        </NuxtLink>

        <!-- Card 2: Visual Impact (Posts[1]) -->
        <NuxtLink v-if="posts[1]" :to="posts[1].path" class="col-span-12 md:col-span-12 lg:col-span-4 group relative bg-[#1A3C34] rounded-[2.5rem] overflow-hidden border border-[#1A3C34] hover:shadow-xl transition-all duration-500">
          <div class="relative h-full w-full p-10 flex flex-col justify-end min-h-[400px]">
            <img :src="posts[1].image?.src || posts[1].image" :alt="posts[1].title" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#1A3C34] via-[#1A3C34]/40 to-transparent z-10" />
            <div class="relative z-20">
              <span class="text-[10px] font-black tracking-widest text-[#A0D995] uppercase mb-3 block">LATEST INSIGHT</span>
              <h3 class="text-3xl font-bold text-white leading-tight mb-4">{{ posts[1].title }}</h3>
              <p class="text-white/60 text-sm line-clamp-2">{{ posts[1].description }}</p>
            </div>
          </div>
        </NuxtLink>

        <!-- Card 3: Deep Contrast (Posts[2]) -->
        <NuxtLink v-if="posts[2]" :to="posts[2].path" class="col-span-12 md:col-span-4 lg:col-span-3 group relative bg-[#E6391E] rounded-[2.5rem] p-8 aspect-square flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#E6391E]/20">
          <UIcon name="i-lucide-zap" class="size-12 text-white/40 mb-4" />
          <div>
            <span class="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2 block">
              {{ new Date(posts[2].date).toLocaleDateString('en', { day: 'numeric', month: 'long' }) }}
            </span>
            <h3 class="text-2xl font-black text-white leading-tight">{{ posts[2].title }}</h3>
          </div>
        </NuxtLink>

        <!-- Card 4: Minimal/Clean (Posts[3]) -->
        <NuxtLink v-if="posts[3]" :to="posts[3].path" class="col-span-12 md:col-span-4 lg:col-span-4 group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 flex flex-col justify-between border border-gray-100 dark:border-zinc-800 transition-all hover:bg-[#F9F7F2] dark:hover:bg-zinc-800">
          <div class="flex justify-between items-start">
            <div class="flex gap-1">
              <div v-for="i in 3" :key="i" class="size-2 rounded-full bg-[#E6391E]/20" />
            </div>
            <span class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{{ posts[3].authors?.[0]?.name || 'Rahul Dhole' }}</span>
          </div>
          <div>
            <h4 class="text-2xl font-black text-[#1A3C34] dark:text-white tracking-tighter mb-2 group-hover:text-[#E6391E] transition-colors line-clamp-2">
              {{ posts[3].title }}
            </h4>
            <p class="text-gray-500 text-xs line-clamp-2">{{ posts[3].description }}</p>
          </div>
        </NuxtLink>

        <!-- Card 5: Editorial Tall (Posts[4]) -->
        <NuxtLink v-if="posts[4]" :to="posts[4].path" class="col-span-12 md:col-span-4 lg:col-span-5 lg:row-span-2 group relative bg-[#F9F7F2] dark:bg-zinc-800/50 rounded-[3rem] p-10 lg:p-14 flex flex-col justify-between border border-[#E9E4D9] dark:border-zinc-800 hover:shadow-2xl transition-all">
          <div>
            <span class="text-[12px] font-black text-[#E6391E] opacity-60 uppercase tracking-[0.2em] mb-6 block">EDITORIAL SELECTION</span>
            <h3 class="text-4xl lg:text-5xl font-black text-[#1A3C34] dark:text-white leading-[0.9] tracking-tighter mb-8 group-hover:text-[#E6391E] transition-colors">
              {{ posts[4].title }}
            </h3>
            <p class="text-[#1A3C34]/70 dark:text-zinc-400 font-medium leading-relaxed">
              {{ posts[4].description }}
            </p>
          </div>
          <div class="mt-12 flex items-center justify-between">
            <div class="flex -space-x-3">
              <div v-for="i in 3" :key="i" class="size-12 rounded-full border-4 border-[#F9F7F2] dark:border-zinc-900 bg-gray-200 dark:bg-zinc-800" />
            </div>
            <div class="p-4 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm group-hover:shadow-md transition-all">
              <UIcon name="i-lucide-external-link" class="size-6 text-[#E6391E]" />
            </div>
          </div>
        </NuxtLink>

        <!-- Card 6: Interactive Preview (Posts[5]) -->
        <NuxtLink v-if="posts[5]" :to="posts[5].path" class="col-span-12 md:col-span-6 lg:col-span-4 group relative bg-[#1A3C34] rounded-[2.5rem] p-10 border border-[#1A3C34] hover:bg-[#152e28] transition-all overflow-hidden min-h-[250px] flex flex-col justify-between">
          <div class="flex justify-between items-start relative z-10">
            <UIcon name="i-lucide-messages-square" class="size-10 text-[#A0D995] opacity-50" />
            <span class="text-[10px] font-mono text-[#A0D995] uppercase tracking-[0.2em]">STORY_TRANSCRIPT_v2</span>
          </div>
          <div class="relative z-10">
            <h3 class="text-2xl font-bold text-white leading-tight mb-4">{{ posts[5].title }}</h3>
            <div class="flex items-center gap-2">
              <div class="size-2 rounded-full bg-[#A0D995] animate-pulse" />
              <span class="text-[10px] font-black text-[#A0D995] uppercase tracking-widest">Active Insight Available</span>
            </div>
          </div>
        </NuxtLink>

        <!-- Card 7: Minimal Branding (Posts[6]) -->
        <NuxtLink v-if="posts[6]" :to="posts[6].path" class="col-span-12 md:col-span-6 lg:col-span-3 group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-zinc-800 flex flex-col items-center justify-center text-center transition-all hover:border-[#E6391E]/30">
          <UIcon name="i-lucide-rocket" class="size-16 text-[#E6391E] mb-6 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12" />
          <h4 class="text-xl font-black text-[#1A3C34] dark:text-white uppercase tracking-tighter leading-none mb-2">{{ posts[6].title }}</h4>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PUBLISHED {{ new Date(posts[6].date).getFullYear() }}</p>
        </NuxtLink>

        <!-- Dynamic Grid for Remaining Posts -->
        <template v-for="(post, index) in posts.slice(7)" :key="index + 7">
          <NuxtLink :to="post.path" class="col-span-12 md:col-span-6 lg:col-span-4 group relative bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-zinc-800 hover:shadow-2xl transition-all duration-500">
            <div class="aspect-[16/10] overflow-hidden relative">
              <img :src="post.image?.src || post.image" :alt="post.title" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            <div class="p-8">
              <div class="flex items-center justify-between mb-4">
                <span class="text-[10px] font-bold text-[#E6391E] uppercase tracking-[0.2em]">
                  {{ new Date(post.date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) }}
                </span>
                <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-300 group-hover:text-[#E6391E] group-hover:translate-x-1 transition-all" />
              </div>
              <h3 class="text-xl font-black text-[#1A3C34] dark:text-white group-hover:text-[#E6391E] transition-colors leading-tight">{{ post.title }}</h3>
            </div>
          </NuxtLink>
        </template>
      </div>
    </UPageBody>
  </UContainer>
</template>
