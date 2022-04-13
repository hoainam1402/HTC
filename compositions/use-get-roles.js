import { reactive, useContext } from '@nuxtjs/composition-api'
import useQueryFetch from '~/compositions/use-query-fetch'

export default function useGetRoles(params = {}) {
  const { $api } = useContext()
  const state = reactive({
    items: []
  })
  const { conditions, data, loading, refresh } = useQueryFetch({
    fetcher: (p) => $api.role.getRoles(p),
    params,
    beforeFetch: (conditions) => {
      for (const [key, value] of Object.entries(conditions)) {
        if (value === 'true') {
          conditions[key] = value === 'true'
        }
      }
      return conditions
    },
    afterFetch: ({ result }) => {
      state.items = result.items
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
