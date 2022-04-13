export default ($axios) => ({
  async getContacts(params) {
    return await $axios.$get('/api/services/app/contacts', {
      params
    })
  },
  async getContact(id) {
    return await $axios.$get(`/api/services/app/contacts/${id}`)
  },
  async createContact(data) {
    return await $axios.$post('/api/services/app/contacts', data)
  },
  async updateContact(data) {
    return await $axios.$put(`/api/services/app/contacts/${data.id}`, data)
  },
  async deleteContact(id) {
    return await $axios.$delete(`/api/services/app/contacts/${id}`)
  },
  async getContactTypes(params = {}) {
    return await $axios.$get('/api/services/app/contacts/types', {
      params
    })
  }
})
