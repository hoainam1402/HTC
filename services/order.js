export default ($axios) => ({
  async getOrders(params) {
    return await $axios.$get('/api/services/app/orders', {
      params
    })
  },
  async getOrder(id) {
    return await $axios.$get(`/api/services/app/orders/${id}`)
  },
  async createOrder(data) {
    return await $axios.$post('/api/services/app/orders', data)
  },
  async updateOrder(data) {
    return await $axios.$put(`/api/services/app/orders/${data.id}`, data)
  },
  async deleteOrder(id) {
    return await $axios.$delete(`/api/services/app/orders/${id}`)
  },
  async sendEmail(id, data) {
    return await $axios.$post(`/api/services/app/orders/${id}/email`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  async createAttachment(id, data) {
    return await $axios.$post(`/api/services/app/orders/${id}/attachments`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  async deleteAttachment(id) {
    return await $axios.$delete(`/api/services/app/attachments/${id}`)
  },
  async getMetadata() {
    return await $axios.$get('/api/services/app/orders/metadata')
  },
  async getInvoices(orderId) {
    return await $axios.$get(`/api/services/app/orders/${orderId}/invoices/`)
  },
  async createInvoice(orderId, data) {
    return await $axios.$post(`/api/services/app/orders/${orderId}/invoices/`, data)
  },
  async updateInvoice(orderId, data) {
    return await $axios.$put(`/api/services/app/orders/${orderId}/invoices/${data.id}/`, data)
  },
  async deleteInvoice(orderId, data) {
    return await $axios.$delete(`/api/services/app/orders/${orderId}/invoices/${data.id}/`)
  }
})
