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
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <UPageCard icon="i-lucide-mail" title="Email" description="mail@rahuldhole.com" to="mailto:mail@rahuldhole.com" class="hover:border-primary/50 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1" />
            <UPageCard icon="i-lucide-calendar" title="Meeting" description="Schedule a Call" to="https://calendly.com/rahuldhole/rdv" target="_blank" class="hover:border-primary/50 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1" />
            <UPageCard icon="i-simple-icons-linkedin" title="LinkedIn" description="Let's connect" to="https://linkedin.com/in/dholerahul" target="_blank" class="hover:border-primary/50 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1" />
            <UPageCard icon="i-simple-icons-github" title="GitHub" description="View my code" to="https://github.com/rahuldhole" target="_blank" class="hover:border-primary/50 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1" />
            <UPageCard icon="i-simple-icons-instagram" title="Instagram" description="@rahul_dhole_" to="https://www.instagram.com/rahul_dhole_/" target="_blank" class="hover:border-primary/50 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1" />
            <UPageCard icon="i-simple-icons-facebook" title="Facebook" description="rahuldhole.official" to="https://www.facebook.com/rahuldhole.official" target="_blank" class="hover:border-primary/50 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1" />
            <UPageCard icon="i-simple-icons-tiktok" title="TikTok" description="@rahul_dhole_" to="https://www.tiktok.com/@rahul_dhole_" target="_blank" class="hover:border-primary/50 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1" />
            <UPageCard icon="i-simple-icons-threads" title="Threads" description="@rahul_dhole_" to="https://www.threads.com/@rahul_dhole_" target="_blank" class="hover:border-primary/50 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1" />
            <UPageCard icon="i-simple-icons-x" title="X" description="@rahul_dhole_" to="https://x.com/rahul_dhole_" target="_blank" class="hover:border-primary/50 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1" />
            <UPageCard icon="i-simple-icons-youtube" title="YouTube" description="@rahuldhole-official" to="https://www.youtube.com/@rahuldhole-official" target="_blank" class="hover:border-primary/50 transition-colors shadow-md hover:shadow-xl hover:-translate-y-1" />
          </div>
        </div>
      </UPageSection>
    </UPageBody>
  </UPage>
</template>
