import { reactive, useContext } from '@nuxtjs/composition-api'
import useQueryFetch from '@/compositions/use-query-fetch'
import configs from '@/configs'

export default function useGetTasks(params = {}) {
  const { $api } = useContext()
  const { pagination } = configs
  const state = reactive({
    items: [],
    totalCount: 0
  })
  const { conditions, data, loading, refresh } = useQueryFetch({
    fetcher: (p) => $api.task.searchTasks(p),
    params: {
      skipCount: params.skipCount || 0,
      maxResultCount: params.maxResultCount || pagination.itemsPerPage,
      ...params
    },
    beforeFetch: (conditions) => {
      for (const [key, value] of Object.entries(conditions)) {
        if (value === 'true') {
          conditions[key] = value === 'true'
        }
      }
      return conditions
    },
    afterFetch: (data) => {
      const result = (data || {}).result || {}
      state.items = result.items || []
      state.totalCount = result.totalCount || 0
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
