export default ($axios) => ({
  async getJobs(params) {
    return await $axios.$post('/api/services/app/jobs/search', params)
  },
  async getJob(id) {
    return await $axios.$get(`/api/services/app/jobs/${id}`)
  },
  async getJobRoles(id) {
    return await $axios.$get(`/api/services/app/jobs/${id}/users`)
  },
  async createJobRoles(id, data) {
    return await $axios.$put(`/api/services/app/jobs/${id}/users/${data.user}`, data)
  },
  async deleteJobRoles(id, userId) {
    return await $axios.$delete(`/api/services/app/jobs/${id}/users/${userId}`)
  },
  async getTask(jobId, params = {}) {
    return await $axios.$get('/api/services/app/tasks', {
      params: {
        jobId,
        ...params
      }
    })
  },
  async createJob(data) {
    return await $axios.$post('/api/services/app/jobs', data)
  },
  async updateJob(id, data) {
    return await $axios.$put(`/api/services/app/jobs/${id}`, data)
  },
  async deleteJob(id) {
    return await $axios.$delete(`/api/services/app/jobs/${id}`)
  },
  async getEnums(params = {}) {
    return await $axios.$get('/api/services/app/jobs/metadata/enums', {
      params
    })
  },
  async getTaxProfiles(params = {}) {
    return await $axios.$get('/api/services/app/jobs/metadata/tax-profiles', {
      params
    })
  },
  async createNote(id, data) {
    return await $axios.$post(`/api/services/app/jobs/${id}/notes`, data)
  },
  async deleteNote(id) {
    return await $axios.$delete(`/api/services/app/notes/${id}`)
  },
  async createAttachment(id, data) {
    return await $axios.$post(`/api/services/app/jobs/${id}/attachments`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  async deleteAttachment(id) {
    return await $axios.$delete(`/api/services/app/attachments/${id}`)
  },
  async getAssignee(jobId, params) {
    return await $axios.$get(`/api/services/app/jobs/${jobId}/users`, {
      params
    })
  },
  async getWorkspaceAssignees(params) {
    return await $axios.$get('/api/services/app/jobs/users', {
      params
    })
  }
})
