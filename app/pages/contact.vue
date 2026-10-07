<script setup lang="ts">
useSeoMeta({
  title: 'Contact Me | Rahul Dhole - Full-Stack Engineer',
  description: 'Get in touch with Rahul Dhole for business inquiries, collaborations, or freelance opportunities. Full-Stack Engineer based in Paris.',
  keywords: 'contact Rahul Dhole, hire full-stack engineer, freelance Ruby on Rails, hire Vue developer Paris'
})
</script>

<template>
  <UPage>
    <UPageHero
      title="Get in Touch"
      description="I'm currently available for freelance work and new opportunities. If you have a project that you want to get started, think you need my help with something or just fancy saying hey, then get in touch."
      align="center"
      :ui="{ container: '!pb-8 sm:!pb-12 lg:!pb-16' }"
    />
    
    <UPageBody>
      <UPageSection :ui="{ container: '!pt-0' }">
        <div class="max-w-4xl mx-auto">
          <div class="grid sm:grid-cols-2 gap-6">
            <UPageCard icon="i-lucide-mail" title="Email" description="mail@rahuldhole.com" to="mailto:mail@rahuldhole.com" class="hover:border-primary/50 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1" />
            <UPageCard icon="i-lucide-calendar" title="Meeting" description="Schedule a Call" to="https://calendly.com/rahuldhole/rdv" target="_blank" class="hover:border-primary/50 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1" />
            <UPageCard icon="i-simple-icons-linkedin" title="LinkedIn" description="Let's connect" to="https://linkedin.com/in/dholerahul" target="_blank" class="hover:border-primary/50 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1" />
            <UPageCard icon="i-simple-icons-github" title="GitHub" description="View my code" to="https://github.com/rahuldhole" target="_blank" class="hover:border-primary/50 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1" />
          </div>
        </div>
      </UPageSection>
    </UPageBody>
  </UPage>
</template>
