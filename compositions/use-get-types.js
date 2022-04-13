import { reactive, useContext, useFetch } from '@nuxtjs/composition-api'

export default function useGetTypes(params = {}) {
  const { $api } = useContext()
  const state = reactive({
    items: []
  })
  useFetch(async () => {
    const { result } = await $api.job.getEnums(params)
    state.items = result
  })

  return {
    state
  }
}
