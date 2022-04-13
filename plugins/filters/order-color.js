import Vue from 'vue'

Vue.filter('orderColor', (value) => {
  let color
  switch (parseInt(value)) {
    case 0:
      color = 'info'
      break
    case 1:
      color = 'primary'
      break
    case 2:
      color = 'warning'
      break
    case 3:
      color = 'success'
      break
    case 4:
      color = 'secondary'
      break
    default:
      color = 'primary'
      break
  }

  return color
})
