import Vue from 'vue'

Vue.filter('addressConverter', (value) => {
  if (typeof value !== 'object' || !value) {
    return ''
  }

  const street = (value || {}).street || ''
  const ward = (value || {}).ward || ''
  const province = (value || {}).province || ''
  const postalCode = (value || {}).postalCode || ''

  return [street, ward, province, postalCode].filter((item) => typeof item === 'string' && item.length > 0).join(', ')
})
