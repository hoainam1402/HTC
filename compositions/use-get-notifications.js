import { reactive, useContext } from '@nuxtjs/composition-api'
import useQueryFetch from '~/compositions/use-query-fetch'

export default function useGetNotifications(params = {}) {
  const { $api } = useContext()
  const state = reactive({
    notification: {}
  })
  const { conditions, data, loading, refresh } = useQueryFetch({
    fetcher: (p) => $api.account.getUserNotifications(p),
    params,
    afterFetch: ({ result }) => {
      state.notification = result
    }
  })

  return {
    conditions,
    data,
    loading,
    refresh,
    state
  }
}
