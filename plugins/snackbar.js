export default function ({ store }, inject) {
  inject('snackbar', ({ message = '', color = '' }) => {
    store.commit('app/SHOW_SNACKBAR', { message, color })
  })
}
