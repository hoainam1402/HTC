import Vue from 'vue'
import { find } from 'lodash'

Vue.filter('mapType', (value, arr) => {
  if (value === null) {
    return ''
  }

  const type = find(arr || [], (item) => item.key === value)
  if (type && type.constructor.name === 'Object') {
    return type.value
  }

  return value
})
