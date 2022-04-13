import { reactive, useContext, useFetch } from '@nuxtjs/composition-api'

export default function useGetPermissions(params = {}) {
  const { $api } = useContext()
  const state = reactive({
    items: []
  })
  useFetch(async () => {
    const { result } = await $api.permission.getAllPermissions(params)
    state.items = result.items
  })

  return {
    state
  }
}
