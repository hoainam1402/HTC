import queryString from 'query-string'

export default function ({ $axios, app, redirect, store }) {
  $axios.onRequest((config) => {
    config.paramsSerializer = (params) => {
      return queryString.stringify(params, {
        arrayFormat: 'none'
      })
    }
  })

  $axios.onResponse((response) => {
    return response
  })

  $axios.onError((error) => {
    app.$snackbar({
      message: error.response.data.error?.message,
      color: 'error'
    })

    if (error.response?.data?.error?.validationErrors) {
      store.commit('form/VALIDATION_ERRORS', error.response?.data?.error?.validationErrors)
    }

    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      redirect('/login')
    }
  })
}
