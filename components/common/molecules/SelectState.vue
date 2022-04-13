<template>
  <app-select v-model="province" v-bind="$attrs" :items="optionProvince" item-value="value" />
</template>

<script>
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import AppSelect from '~/components/atoms/global/AppSelect'

export default defineComponent({
  name: 'SelectState',
  components: {
    AppSelect
  },
  props: {
    value: {
      type: [String, Number],
      default: null
    }
  },
  setup(props, { emit }) {
    const province = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })
    const optionProvince = ref([
      {
        value: 'ACT',
        key: 0
      },
      {
        value: 'NSW',
        key: 1
      },
      {
        value: 'NT',
        key: 2
      },
      {
        value: 'QLD',
        key: 3
      },
      {
        value: 'SA',
        key: 4
      },
      {
        value: 'TAS',
        key: 5
      },
      {
        value: 'VIC',
        key: 6
      },
      {
        value: 'WA',
        key: 7
      }
    ])

    return {
      province,
      optionProvince
    }
  }
})
</script>
