// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'giscus-widget'
    }
  },

  site: {
    url: 'https://rahuldhole.com',
    name: 'Rahul Dhole'
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      script: [
        { src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-placeholder', async: true, crossorigin: 'anonymous' }
      ]
    }
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    preset: 'cloudflare_pages',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    },
    prerender: {
      routes: [
        '/'
      ],
      ignore: ['/api/**'],
      crawlLinks: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
