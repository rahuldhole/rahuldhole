export default defineAppConfig({
  global: {
    picture: {
      dark: '/profile.jpeg',
      light: '/profile.jpeg',
      alt: 'Rahul Dhole'
    },
    email: 'mail@rahuldhole.com',
    available: true,
    meetingLink: 'https://cal.com/rahuldhole'
  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'slate'
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `© ${new Date().getFullYear()} Rahul Dhole. Built with Nuxt.`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/rahuldhole',
      'target': '_blank',
      'aria-label': 'Rahul on GitHub'
    }, {
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://linkedin.com/in/dholerahul',
      'target': '_blank',
      'aria-label': 'Rahul on LinkedIn'
    }, {
      'icon': 'i-simple-icons-devdotto',
      'to': 'https://dev.to/rahuldhole',
      'target': '_blank',
      'aria-label': 'Rahul on Dev.to'
    }]
  }
})
