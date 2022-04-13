import { reactive, useContext } from '@nuxtjs/composition-api'
import useQueryFetch from '@/compositions/use-query-fetch'

export default function useGetOrder(params = {}) {
  const { $api } = useContext()
  const state = reactive({
    items: [],
    totalCount: 0
  })
  const { conditions, data, loading, refresh } = useQueryFetch({
    fetcher: (p) => {
      if (typeof p.status === 'string') {
        p.status = p.status.split(',')
      }
      return $api.order.getOrders(p)
    },
    params: {
      ...params
    },
    afterFetch: ({ result }) => {
      state.items = result.items
      state.totalCount = result.totalCount
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
