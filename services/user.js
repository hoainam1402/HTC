export default ($axios) => ({
  async getUsers(params = {}) {
    return await $axios.$post('/api/services/app/User/GetUsers', params)
  },
  async getUserForEdit(id) {
    return await $axios.$get('/api/services/app/User/GetUserForEdit', {
      params: {
        id
      }
    })
  },
  async createOrUpdateUser(data) {
    return await $axios.$post('/api/services/app/User/CreateOrUpdateUser', data)
  },
  async deleteUser(id) {
    return await $axios.$delete('/api/services/app/User/DeleteUser', {
      params: {
        id
      }
    })
  }
})
