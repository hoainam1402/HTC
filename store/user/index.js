export const state = () => ({
  grantedPermissions: {}
})

export const getters = {
  grantedPermissions(state) {
    return Object.keys(state.grantedPermissions)
  }
}

export const mutations = {
  GRANTED_PERMISSIONS(state, payload) {
    state.grantedPermissions = payload
  }
}

export const actions = {}
