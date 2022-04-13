<template>
  <app-select
    v-model="innerValue"
    v-bind="$attrs"
    :items="items"
    :label="label"
    :multiple="multiple"
    :menu-props="{ maxHeight: '300' }"
  />
</template>

<script>
import { computed, defineComponent, ref, useContext, useFetch, useStore } from '@nuxtjs/composition-api'
import AppSelect from '~/components/atoms/global/AppSelect'

export default defineComponent({
  name: 'SelectTaskProgress',
  components: {
    AppSelect
  },
  props: {
    value: {
      type: [String, Number, Array, Object],
      default: null
    },
    label: {
      type: String,
      default: 'Select'
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { $api } = useContext()
    const store = useStore()

    const innerValue = computed({
      get: () => props.value,
      set: (val) => {
        return emit('input', val)
      }
    })

    const items = ref([])
    const taskProgress = computed(() => store.state.job.enums.taskProgress)
    if (taskProgress.value.length === 0) {
      useFetch(async () => {
        const { result } = await $api.job.getEnums()
        items.value = result.taskProgress
      })
    } else {
      items.value = taskProgress.value
    }

    return {
      innerValue,
      items
    }
  }
})
</script>
