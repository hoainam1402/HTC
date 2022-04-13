<template>
  <app-select
    v-model="innerValue"
    v-bind="$attrs"
    :items="items"
    :item-disabled="itemDisabled"
    :label="label"
    :multiple="multiple"
    :menu-props="{ maxHeight: '300' }"
  />
</template>

<script>
import { computed, defineComponent, ref, useContext, useFetch, useStore } from '@nuxtjs/composition-api'
import AppSelect from '~/components/atoms/global/AppSelect'

export default defineComponent({
  name: 'SelectInvoiceMethod',
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
    const invoiceMethod = computed(() => store.state.job.enums.invoiceMethod)
    if (invoiceMethod.value.length === 0) {
      useFetch(async () => {
        const { result } = await $api.job.getEnums()
        items.value = result.invoiceMethod
      })
    } else {
      items.value = invoiceMethod.value
    }

    const itemDisabled = (item) => item.key === 2

    return {
      innerValue,
      items,
      itemDisabled
    }
  }
})
</script>
