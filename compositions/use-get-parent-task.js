import { reactive, useContext, useFetch } from '@nuxtjs/composition-api'

export default function useGetParentTask(params = {}) {
  const { $api } = useContext()
  const state = reactive({
    items: []
  })
  useFetch(async () => {
    const { result } = await $api.task.getParentTask(params)
    state.items = result
  })

  return {
    state
  }
}
