import Vue from 'vue'
import moment from 'moment-timezone'

Vue.filter('formatDate', (value, filterFormat) => {
  if (value) {
    return moment(value).format(filterFormat || 'LL' || 'lll')
  }

  return ''
})
