import { reactive, useContext, useFetch } from '@nuxtjs/composition-api'

export default function useGetInvoices(id) {
  const { $api } = useContext()
  const state = reactive({
    items: []
  })
  useFetch(async () => {
    const { result } = await $api.invoices.getInvoices(id)
    state.items = result
  })

  return {
    state
  }
}
