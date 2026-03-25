<script setup lang="ts">
useSeoMeta({
  title: 'Contact Me | Rahul Dhole - Full-Stack Engineer',
  description: 'Get in touch with Rahul Dhole for business inquiries, collaborations, or freelance opportunities. Full-Stack Engineer based in Paris.',
  keywords: 'contact Rahul Dhole, hire full-stack engineer, freelance Ruby on Rails, hire Vue developer Paris'
})
</script>

<template>
  <UPage>
    <UPageHeader title="Contact Me" description="Have a question or want to work together?" />
    <UPageBody>
      <UPageSection>
        <div class="max-w-xl mx-auto text-center">
          <p class="text-lg text-muted mb-8">
            I'm currently available for freelance work and new opportunities. If you have a project that you want to get
            started, think you need my help with something or just fancy saying hey, then get in touch.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <UButton
              size="xl"
              icon="i-lucide-mail"
              label="Email Me: mail@rahuldhole.com"
              to="mailto:mail@rahuldhole.com"
              color="primary"
              variant="solid"
            />
            <UButton
              size="xl"
              icon="i-lucide-calendar"
              label="Schedule a Call"
              to="https://calendly.com/rahuldhole/rdv"
              target="_blank"
              color="neutral"
              variant="outline"
            />
          </div>

          <p class="text-sm text-muted">
            You can also find me on <ULink to="https://linkedin.com/in/dholerahul" target="_blank"
              class="text-primary hover:underline">LinkedIn</ULink>, <ULink to="https://github.com/rahuldhole"
              target="_blank" class="text-primary hover:underline">GitHub</ULink> or <ULink to="https://calendly.com/rahuldhole/rdv" target="_blank"
              class="text-primary hover:underline">Calendly</ULink>.
          </p>
        </div>
      </UPageSection>
    </UPageBody>
  </UPage>
</template>
