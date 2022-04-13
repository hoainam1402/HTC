import api from '@/services'

export default function ({ $axios }, inject) {
  inject('api', api($axios))
}
