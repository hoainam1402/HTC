export default ($axios) => ({
  async sendEmailActivationLink(data) {
    return await $axios.$post('/api/services/app/Account/SendEmailActivationLink', data)
  },
  async getUserNotifications(params) {
    return await $axios.$get('/api/services/app/Notification/GetUserNotifications', {
      params
    })
  },
  async setNotificationAsRead(data) {
    return await $axios.$post('/api/services/app/Notification/SetNotificationAsRead', data)
  }
})
