import { reactive, useContext, useFetch } from '@nuxtjs/composition-api'

export default function useGetStages(params = {}) {
  const { $api } = useContext()
  const state = reactive({
    items: []
  })
  useFetch(async () => {
    const { result } = await $api.lead.getLeadStages()
    state.items = result
  })

  return {
    state
  }
}
