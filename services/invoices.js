export default ($axios) => ({
  async getInvoices(id) {
    return await $axios.$get(`/api/services/app/orders/${id}/invoices`)
  },
  async deleteInvoices(id, invoiceId) {
    return await $axios.$delete(`/api/services/app/orders/${id}/invoices/${invoiceId}`)
  }
})
