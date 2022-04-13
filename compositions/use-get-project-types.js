import { reactive, useContext, useFetch } from '@nuxtjs/composition-api'

export default function useGetProjectTypes(params = {}) {
  const { $api } = useContext()
  const state = reactive({
    items: []
  })
  useFetch(async () => {
    const { result } = await $api.lead.getProjectTypes()
    state.items = result
  })

  return {
    state
  }
}
