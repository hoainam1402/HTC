import Vue from 'vue'
import numeral from 'numeral'

Vue.filter('formatCurrency', (value, pattern) => {
  if (typeof value === 'number') {
    return numeral(value).format(pattern || '$0,0.00')
  }
  if (typeof value === 'string') {
    const floatValue = parseFloat(value || '0.0')
    if (floatValue >= 0) {
      return numeral(value).format(pattern || '$0,0.00')
    }
  }
  return value
})
