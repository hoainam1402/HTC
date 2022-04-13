<template>
  <app-select
    v-model="innerValue"
    v-bind="$attrs"
    item-text="displayName"
    item-value="name"
    :items="items"
    :label="label"
    :multiple="multiple"
    :menu-props="{ maxHeight: '300' }"
  />
</template>

<script>
import { computed, defineComponent, toRef } from '@nuxtjs/composition-api'
import { useGetRoles } from '~/compositions'
import AppSelect from '~/components/atoms/global/AppSelect'

export default defineComponent({
  name: 'SelectRoles',
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
    const innerValue = computed({
      get: () => props.value,
      set: (val) => {
        return emit('input', val)
      }
    })

    const { state: listState } = useGetRoles()

    return {
      innerValue,
      items: toRef(listState, 'items')
    }
  }
})
</script>
