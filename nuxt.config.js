import config from './configs'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: `%s - ${process.env.APP_NAME}`,
    title: process.env.APP_DESCRIPTION,
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900'
      },
      ...config.icons.map((href) => ({ rel: 'stylesheet', href }))
    ]
  },

  // Customize the progress-bar color
  loading: '~/components/global/atoms/Loading',

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/scss/theme.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios',
    '@/plugins/api',
    '@/plugins/clipboard',
    '@/plugins/snackbar',
    '@/plugins/vee-validate',
    '@/plugins/vue-masonry',
    '@/plugins/vue-simple-acl',
    // filters
    '@/plugins/filters/address-converter',
    '@/plugins/filters/capitalize',
    '@/plugins/filters/format-date',
    '@/plugins/filters/format-duration',
    '@/plugins/filters/format-currency',
    '@/plugins/filters/lowercase',
    '@/plugins/filters/map-type',
    '@/plugins/filters/notification-type',
    '@/plugins/filters/order-color',
    '@/plugins/filters/progress-color',
    '@/plugins/filters/progress-status',
    '@/plugins/filters/uppercase'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Router configuration: https://nuxtjs.org/api/configuration-router
  router: {
    middleware: ['auth', 'authority']
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/composition
    '@nuxt/typescript-build',
    // https://composition-api.nuxtjs.org
    '@nuxtjs/composition-api/module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // https://github.com/nuxt-community/moment-module
    '@nuxtjs/moment'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://auth.nuxtjs.org
    '@nuxtjs/auth-next',
    // https://i18n.nuxtjs.org
    '@nuxtjs/i18n',
    'vuetify-dialog/nuxt',
    'portal-vue/nuxt',
    'vue-currency-input/nuxt'
  ],

  // TailwindCSS module configuration: https://tailwindcss.nuxtjs.org/options
  tailwindcss: {
    configPath: '@/configs/tailwind.js'
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['@/assets/scss/vuetify/variables/_index.scss'],
    optionsPath: '@/configs/vuetify.js',
    treeShake: true,
    defaultAssets: {
      font: false
    }
  },

  // Moment module configuration: https://github.com/nuxt-community/moment-module
  moment: {
    defaultLocale: 'en'
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  publicRuntimeConfig: {
    apiURL: process.env.API_URL
  },

  // Auth module configuration: https://auth.nuxtjs.org/guide/scheme
  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      callback: false,
      home: false
    },
    strategies: {
      local: {
        token: {
          property: 'result.accessToken'
        },
        user: {
          property: 'result.user'
        },
        endpoints: {
          login: { url: '/api/TokenAuth/Authenticate', method: 'post' },
          logout: { url: '/api/TokenAuth/LogOut', method: 'get' },
          user: { url: '/api/services/app/Session/GetCurrentLoginInformations', method: 'get' }
        }
      }
    },
    plugins: ['@/plugins/signalr']
  },

  // I18n module configuration: https://i18n.nuxtjs.org/options-reference
  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.js'
      }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    lazy: true,
    langDir: 'locales/'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      vue: {
        compiler: require('vue-template-babel-compiler')
      }
    }
  }
}
