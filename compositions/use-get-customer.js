import { reactive, useContext, useFetch } from '@nuxtjs/composition-api'

export default function useGetCustomer(params = {}) {
  const { $api } = useContext()
  const state = reactive({
    items: []
  })
  useFetch(async () => {
    const { result } = await $api.client.getClients()
    state.items = result.items
  })

  return {
    state
  }
}
