<script setup lang="ts">
useSeoMeta({
  title: 'Contact',
  description: 'Get in touch with Rahul Dhole for business inquiries and collaborations.'
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

          <UButton size="xl" icon="i-lucide-mail" label="Email Me: mail@rahuldhole.com" to="mailto:mail@rahuldhole.com"
            color="primary" variant="solid" class="mb-8" />

          <p class="text-sm text-muted">
            You can also find me on <ULink to="https://linkedin.com/in/dholerahul" target="_blank"
              class="text-primary hover:underline">LinkedIn</ULink> or <ULink to="https://github.com/rahuldhole"
              target="_blank" class="text-primary hover:underline">GitHub</ULink>.
          </p>
        </div>
      </UPageSection>
    </UPageBody>
  </UPage>
</template>
