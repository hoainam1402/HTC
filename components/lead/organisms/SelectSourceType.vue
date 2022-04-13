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
import { computed, defineComponent, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import AppSelect from '~/components/atoms/global/AppSelect'

export default defineComponent({
  name: 'SelectSourceType',
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

    const innerValue = computed({
      get: () => props.value,
      set: (val) => {
        return emit('input', val)
      }
    })

    const items = ref([])
    useFetch(async () => {
      const { result } = await $api.lead.getSourceTypes()
      items.value = result
    })

    return {
      innerValue,
      items
    }
  }
})
</script>
