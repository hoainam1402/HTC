export default ($axios) => ({
  async userConfiguration() {
    return await $axios.$get('/AbpUserConfiguration/GetAll')
  },
  async getCurrentUserProfileForEdit(data) {
    return await $axios.$get('/api/services/app/Profile/GetCurrentUserProfileForEdit', data)
  },
  async updateCurrentUserProfile(data) {
    return await $axios.$put('/api/services/app/Profile/UpdateCurrentUserProfile', data)
  },
  async changePassword(data) {
    return await $axios.$post('/api/services/app/Profile/ChangePassword', data)
  }
})
