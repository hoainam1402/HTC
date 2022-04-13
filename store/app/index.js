export const state = () => ({
  snackbar: {
    message: '',
    color: ''
  },
  rightMenu: {
    visible: false,
    width: 400
  }
})

export const getters = {}

export const mutations = {
  SHOW_SNACKBAR(state, payload) {
    state.snackbar.message = payload.message
    state.snackbar.color = payload.color
  },
  SHOW_RIGHT_MENU(state, payload) {
    state.rightMenu.visible = true
    state.rightMenu.width = payload?.width
  },
  HIDE_RIGHT_MENU(state) {
    state.rightMenu.visible = false
  }
}

export const actions = {}
