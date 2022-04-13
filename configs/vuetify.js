import en from '@/locales/en'
import theme from '@/configs/theme'

export default {
  lang: {
    locales: {
      en: en.vuetify
    },
    current: 'en'
  },
  theme: {
    dark: theme.globalTheme === 'dark',
    options: {
      customProperties: true
    },
    themes: {
      dark: theme.dark,
      light: theme.light
    }
  }
}
