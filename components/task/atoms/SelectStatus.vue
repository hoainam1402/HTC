<template>
  <v-select
    v-model="model"
    v-bind="$attrs"
    :items="items"
    :label="label"
    :item-text="itemText"
    :item-value="itemValue"
    :multiple="multiple"
    :menu-props="{ maxHeight: '300' }"
  />
</template>

<script>
import { computed, defineComponent, toRef } from '@nuxtjs/composition-api'
import { useGetStages } from '@/compositions'

export default defineComponent({
  name: 'SelectStatus',
  props: {
    value: {
      type: [String, Number, Array],
      default: ''
    },
    label: {
      type: String,
      default: 'Select'
    },
    itemText: {
      type: String,
      default: 'value'
    },
    itemValue: {
      type: String,
      default: 'key'
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const model = computed({
      get: () => props.value,
      set: (val) => {
        return emit('input', val)
      }
    })
    const { state: listState } = useGetStages()

    return {
      model,
      items: toRef(listState, 'items')
    }
  }
})
</script>
