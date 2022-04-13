import configs from '@/configs'

const { product, theme } = configs

const { globalTheme, toolbarTheme, menuTheme, isToolbarDetached, isContentBoxed } = theme

// state initial values
const state = () => ({
  product,

  // themes and layout configurations
  globalTheme,
  toolbarTheme,
  menuTheme,
  isToolbarDetached,
  isContentBoxed
})

export default {
  state
}
