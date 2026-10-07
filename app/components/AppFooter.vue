<script setup lang="ts">
</script>

<template>
  <USeparator class="h-px" />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="[{
          label: 'Navigate',
          children: [{
            label: 'Home',
            to: '/'
          }, {
            label: 'Projects',
            to: '/projects'
          }, {
            label: 'Blog',
            to: '/blog'
          }, {
            label: 'About',
            to: '/about'
          }]
        }, {
          label: 'Connect',
          children: [{
            label: 'LinkedIn',
            to: 'https://linkedin.com/in/dholerahul',
            target: '_blank'
          }, {
            label: 'X',
            to: 'https://x.com/rahul_dhole_',
            target: '_blank'
          }, {
            label: 'Instagram',
            to: 'https://www.instagram.com/rahul_dhole_/',
            target: '_blank'
          }, {
            label: 'YouTube',
            to: 'https://www.youtube.com/@rahuldhole-official',
            target: '_blank'
          }]
        }, {
          label: 'Projects',
          children: [{
            label: 'PrepaJS',
            to: 'https://prepajs.rahuldhole.com/',
            target: '_blank'
          }, {
            label: 'HTML Playground',
            to: 'https://html-playground.rahuldhole.com',
            target: '_blank'
          }, {
            label: 'Untangled HTML',
            to: 'https://marketplace.visualstudio.com/items?itemName=RahulDhole.untangled-html',
            target: '_blank'
          }, {
            label: 'Quizya',
            to: 'https://quizya.rahuldhole.com/',
            target: '_blank'
          }]
        }, {
          label: 'Legal',
          children: [{
            label: 'Privacy Policy',
            to: '/privacy'
          }, {
            label: 'Terms of Service',
            to: '/terms'
          }, {
            label: 'Contact',
            to: '/contact'
          }]
        }]" />
      </UContainer>
    </template>

    <template #left>
      <p class="text-muted text-sm">
        © {{ new Date().getFullYear() }} Rahul Dhole.
      </p>
    </template>

    <template #right>
      <UButton to="https://github.com/rahuldhole" target="_blank" icon="i-simple-icons-github"
        aria-label="Rahul on GitHub" color="neutral" variant="ghost" />
      <UButton to="https://linkedin.com/in/dholerahul" target="_blank" icon="i-simple-icons-linkedin"
        aria-label="Rahul on LinkedIn" color="neutral" variant="ghost" />
      <UButton to="https://dev.to/rahuldhole" target="_blank" icon="i-simple-icons-devdotto"
        aria-label="Rahul on Dev.to" color="neutral" variant="ghost" />
      <UButton to="/rss.xml" target="_blank" icon="i-lucide-rss"
        aria-label="RSS Feed" color="neutral" variant="ghost" />
      <UButton to="https://x.com/rahul_dhole_" target="_blank" icon="i-simple-icons-x"
        aria-label="Rahul on X" color="neutral" variant="ghost" />
      <UButton to="https://www.instagram.com/rahul_dhole_/" target="_blank" icon="i-simple-icons-instagram"
        aria-label="Rahul on Instagram" color="neutral" variant="ghost" />
      <UButton to="https://www.youtube.com/@rahuldhole-official" target="_blank" icon="i-simple-icons-youtube"
        aria-label="Rahul on YouTube" color="neutral" variant="ghost" />
      <UButton to="https://www.facebook.com/rahuldhole.official" target="_blank" icon="i-simple-icons-facebook"
        aria-label="Rahul on Facebook" color="neutral" variant="ghost" />
      <UButton to="https://www.tiktok.com/@rahul_dhole_" target="_blank" icon="i-simple-icons-tiktok"
        aria-label="Rahul on TikTok" color="neutral" variant="ghost" />
      <UButton to="https://www.threads.com/@rahul_dhole_" target="_blank" icon="i-simple-icons-threads"
        aria-label="Rahul on Threads" color="neutral" variant="ghost" />
    </template>
  </UFooter>
</template>
