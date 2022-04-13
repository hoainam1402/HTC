<template>
  <v-select
    v-model="model"
    :items="items"
    :label="label"
    :item-text="itemText"
    :item-value="itemValue"
    v-bind="$attrs"
  />
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'SelectConstant',
  props: {
    value: {
      type: [String, Number, Array],
      default: ''
    },
    items: {
      type: Array,
      default: () => []
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
    }
  },
  setup(props, { emit }) {
    const model = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    return {
      model
    }
  }
})
</script>
