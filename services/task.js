export default ($axios) => ({
  async getTasks(params) {
    return await $axios.$get('/api/services/app/tasks/', {
      params
    })
  },
  async searchTasks(params) {
    return await $axios.$post('/api/services/app/tasks/search/', params)
  },
  async workspace(params) {
    return await $axios.$get('/api/services/app/tasks/workspace/', {
      params
    })
  },
  async getCalendar(params) {
    return await $axios.$get('/api/services/app/tasks/calendar/', {
      params
    })
  },
  async getTaskEnums(params = {}) {
    return await $axios.$get('/api/services/app/tasks/metadata/enums', {
      params
    })
  },
  async getParentTask(params) {
    return await $axios.$get('/api/services/app/tasks', {
      params
    })
  },
  async getTask(id) {
    return await $axios.$get(`/api/services/app/tasks/${id}/`)
  },
  async createTask(params) {
    return await $axios.$post('/api/services/app/tasks', params)
  },
  async updateTask(id, data) {
    return await $axios.$put(`/api/services/app/tasks/${id}/`, data)
  },
  async getTemplates(params) {
    return await $axios.$get('/api/services/app/tasks/metadata/templates', params)
  },
  async deleteTask(id) {
    return await $axios.$delete(`/api/services/app/tasks/${id}/`)
  }
})
