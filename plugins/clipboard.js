export default function ({ store }, inject) {
  inject('clipboard', (text) => {
    const el = document.createElement('textarea')

    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  })
}
