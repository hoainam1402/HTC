import Vue from 'vue'

Vue.filter('progressStatus', (value) => {
  let status
  switch (parseInt(value)) {
    case 0:
      status = 'To-do'
      break
    case 25:
    case 50:
    case 75:
      status = 'In-progress'
      break
    case 100:
      status = 'Done'
      break
    default:
      status = 'To-do'
      break
  }

  return status
})
