export const state = () => ({
  jobDetails: {},
  orderMetadata: {},
  enums: {}
})

export const getters = {}

export const mutations = {
  JOB_DETAILS(state, payload) {
    state.jobDetails = payload
  },
  SET_ORDER_METADATA(state, payload) {
    state.orderMetadata = payload
  },
  SET_ENUMS(state, payload) {
    state.enums = payload
  }
}

export const actions = {
  async getOrderMetadata({ commit }) {
    const { result } = await this.$api.order.getMetadata()
    commit('SET_ORDER_METADATA', result)
  },
  async getEnums({ commit }) {
    const { result } = await this.$api.job.getEnums()
    commit('SET_ENUMS', result)
  }
}
