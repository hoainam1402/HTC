import { reactive, useContext, useFetch } from '@nuxtjs/composition-api'

export default function useGetSourceTypes(params = {}) {
  const { $api } = useContext()
  const state = reactive({
    items: []
  })
  useFetch(async () => {
    const { result } = await $api.lead.getSourceTypes()
    state.items = result
  })

  return {
    state
  }
}
