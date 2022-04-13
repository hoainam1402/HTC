<template>
  <v-select
    v-model="model"
    v-bind="$attrs"
    :items="items.invoiceMethod"
    :label="label"
    :item-text="itemText"
    :item-value="itemValue"
    :item-disabled="itemDisabled"
    :multiple="multiple"
    :menu-props="{ maxHeight: '300' }"
    @change="(val) => $emit('change', val)"
  />
</template>

<script>
import { computed, defineComponent, toRef } from '@nuxtjs/composition-api'
import { useGetTypes } from '@/compositions'

export default defineComponent({
  name: 'SelectInvoiceMethod',
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
    const { state: listState } = useGetTypes()
    const itemDisabled = (item) => item.key === 2

    return {
      model,
      items: toRef(listState, 'items'),
      itemDisabled
    }
  }
})
</script>
