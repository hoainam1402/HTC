export default ($axios) => ({
  async getClients(params) {
    return await $axios.$get('/api/services/app/customers', {
      params
    })
  },
  async getClient(id) {
    return await $axios.$get(`/api/services/app/customers/${id}`)
  },
  async createClient(data) {
    return await $axios.$post('/api/services/app/customers', data)
  },
  async updateClient(data) {
    return await $axios.$put(`/api/services/app/customers/${data.id}`, data)
  },
  async deleteClient(id) {
    return await $axios.$delete(`/api/services/app/customers/${id}`)
  },
  async createContact(clientId, data) {
    return await $axios.$post(`/api/services/app/customers/${clientId}/contacts`, data)
  },
  async updateContact(clientId, data) {
    return await $axios.$put(`/api/services/app/customers/${clientId}/contacts/${data.id}`, data)
  },
  async deleteContact(clientId, id) {
    return await $axios.$delete(`/api/services/app/customers/${clientId}/contacts/${id}`)
  },
  async getClientTypes(params = {}) {
    return await $axios.$get('/api/services/app/customers/types', {
      params
    })
  }
})
