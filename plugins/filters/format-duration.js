import Vue from 'vue'

Vue.filter('formatDuration', (value) => {
  if (typeof value === 'number') {
    if (value > 1) {
      return `${value} days`
    }
    return `${value} day`
  }

  return value
})
