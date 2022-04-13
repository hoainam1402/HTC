import Vue from 'vue'

Vue.filter('progressColor', (value) => {
  let color
  switch (parseInt(value)) {
    case 0:
      color = 'pink'
      break
    case 25:
      color = 'primary'
      break
    case 50:
      color = 'primary'
      break
    case 75:
      color = 'amber'
      break
    case 100:
      color = 'success'
      break
    default:
      color = 'primary'
      break
  }

  return color
})
