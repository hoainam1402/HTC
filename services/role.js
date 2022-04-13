export default ($axios) => ({
  async getRoles(params) {
    return await $axios.$post('/api/services/app/Role/GetRoles', params)
  },
  async getRoleForEdit(id) {
    return await $axios.$get('/api/services/app/Role/GetRoleForEdit', {
      params: {
        id
      }
    })
  },
  async createOrUpdateRole(data) {
    return await $axios.$post('/api/services/app/Role/CreateOrUpdateRole', data)
  },
  async deleteRole(id) {
    return await $axios.$delete('/api/services/app/Role/DeleteRole', {
      params: {
        id
      }
    })
  }
})
