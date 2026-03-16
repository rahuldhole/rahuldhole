// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', '@nuxt/content', '@vueuse/nuxt', 'nuxt-og-image', '@nuxtjs/sitemap', '@nuxtjs/robots', 'nuxt-studio', 'motion-v/nuxt'],

  build: {
    transpile: ['motion-v']
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'giscus-widget'
    }
  },

  site: {
    url: 'https://rahuldhole.com',
    name: 'Rahul Dhole',
    description: 'Full-Stack Engineer based in Paris specializing in Ruby on Rails, Vue.js, and Cloud DevOps.'
  },

  robots: {
    disallow: ['/login', '/signup', '/_studio'],
    allow: '/'
  },

  sitemap: {
    exclude: ['/login', '/signup', '/_studio']
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
      autoSubfolderIndex: false,
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
  },

  studio: {
    // Studio admin login route
    route: '/_studio', // default

    // Git repository configuration
    repository: {
      provider: 'github', // 'github' or 'gitlab' (default: 'github')
      owner: 'rahuldhole', // your GitHub/GitLab owner (required)
      repo: 'rahuldhole', // your repository name (required)
      branch: 'main', // branch to commit to (default: 'main')
      rootDir: '', // subdirectory for monorepos (default: '')
      // private: true, // request access to private repos (default: true)
    }
  },
  // disabled for faster dev cold start
  // typescript: {
  //   typeCheck: true,
  //   strict: true,
  // },
})