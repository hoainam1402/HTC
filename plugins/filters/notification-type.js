import Vue from 'vue'

Vue.filter('notificationType', (value) => {
  let icon
  switch (value) {
    case 'Htc.eBuilding.Clients.Jobs.SampleNotificationData':
      icon = 'mdi-calendar-check-outline'
      break
    default:
      icon = 'mdi-email-outline'
      break
  }

  return icon
})
