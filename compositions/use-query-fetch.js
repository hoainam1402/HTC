import { provide, useRouter } from '@nuxtjs/composition-api'
import { useConditionWatcher } from 'vue-condition-watcher'

export default function ({ fetcher, params, defaultParams, beforeFetch, afterFetch, ignore = [] }) {
  provide('router', useRouter())

  const config = {
    fetcher,
    conditions: {
      ...params
    },
    defaultParams,
    beforeFetch,
    afterFetch
  }
  const { conditions, data, error, loading, refresh } = useConditionWatcher(config, {
    sync: 'router',
    navigation: 'replace',
    ignore
  })

  return {
    conditions,
    data,
    error,
    loading,
    refresh
  }
}
