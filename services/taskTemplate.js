export default ($axios) => ({
  async getTasksTemplate(params) {
    return await $axios.$get('/api/services/app/tasks/templates', {
      params
    })
  },
  async createTaskTemplate(data) {
    return await $axios.$post('/api/services/app/tasks/templates', data)
  },
  async getTaskTemplate(id) {
    return await $axios.$get(`/api/services/app/tasks/templates/${id}`)
  },
  async updateTaskTemplate(data) {
    return await $axios.$put(`/api/services/app/tasks/templates/${data.id}`, data)
  },
  async deleteTaskTemplate(id) {
    return await $axios.$delete(`/api/services/app/tasks/templates/${id}`)
  }
})
