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
            label: 'GitHub',
            to: 'https://github.com/rahuldhole',
            target: '_blank'
          }, {
            label: 'LinkedIn',
            to: 'https://linkedin.com/in/dholerahul',
            target: '_blank'
          }, {
            label: 'LeetCode',
            to: 'https://leetcode.com/u/rahuldhole',
            target: '_blank'
          }, {
            label: 'Dev.to',
            to: 'https://dev.to/rahuldhole',
            target: '_blank'
          }]
        }, {
          label: 'Projects',
          children: [{
            label: 'PrepaJS',
            to: 'https://prepajs.rahuldhole.com/',
            target: '_blank'
          }, {
            label: 'PlayOnWeb IDE',
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
        © {{ new Date().getFullYear() }} Rahul Dhole. Built with Nuxt.
      </p>
    </template>

    <template #right>
      <UButton to="https://github.com/rahuldhole" target="_blank" icon="i-simple-icons-github"
        aria-label="Rahul on GitHub" color="neutral" variant="ghost" />
      <UButton to="https://linkedin.com/in/dholerahul" target="_blank" icon="i-simple-icons-linkedin"
        aria-label="Rahul on LinkedIn" color="neutral" variant="ghost" />
      <UButton to="https://dev.to/rahuldhole" target="_blank" icon="i-simple-icons-devdotto"
        aria-label="Rahul on Dev.to" color="neutral" variant="ghost" />
    </template>
  </UFooter>
</template>
