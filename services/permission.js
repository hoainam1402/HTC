export default ($axios) => ({
  async getAllPermissions(params) {
    return await $axios.$get('/api/services/app/Permission/GetAllPermissions', params)
  }
})
