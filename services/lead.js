export default ($axios) => ({
  async getLeadTypes() {
    return await $axios.$get('/api/services/app/leads/types')
  },
  async getLeadStages() {
    return await $axios.$get('/api/services/app/leads/stages')
  },
  async getProjectTypes() {
    return await $axios.$get('/api/services/app/leads/project-types')
  },
  async getSourceTypes() {
    return await $axios.$get('/api/services/app/leads/source-types')
  },
  async getLeads(params) {
    return await $axios.$post('/api/services/app/leads/search', params)
  },
  async getLead(id) {
    return await $axios.$get(`/api/services/app/leads/${id}`)
  },
  async createLead(data) {
    return await $axios.$post('/api/services/app/leads', data)
  },
  async updateLead(data) {
    return await $axios.$put(`/api/services/app/leads/${data.id}`, data)
  },
  async deleteLead(id) {
    return await $axios.$delete(`/api/services/app/leads/${id}`)
  },
  async publishProject(id) {
    return await $axios.$post(`/api/services/app/leads/${id}/publish`)
  },
  async createNote(id, data) {
    return await $axios.$post(`/api/services/app/leads/${id}/notes`, data)
  },
  async deleteNote(id) {
    return await $axios.$delete(`/api/services/app/notes/${id}`)
  },
  async createAttachment(id, data) {
    return await $axios.$post(`/api/services/app/leads/${id}/attachments`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  async deleteAttachment(id) {
    return await $axios.$delete(`/api/services/app/attachments/${id}`)
  }
})
