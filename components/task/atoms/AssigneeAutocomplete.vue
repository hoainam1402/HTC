<template>
  <v-autocomplete
    v-model="model"
    v-bind="$attrs"
    :items="items"
    :search-input.sync="search"
    :label="label"
    :item-text="itemText"
    :item-value="itemValue"
    hide-no-data
    return-object
  >
    <v-icon v-if="model" slot="append" small @click="model = null">mdi-close-circle-outline</v-icon>
  </v-autocomplete>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, ref, toRef, useContext, watch } from '@nuxtjs/composition-api'
import { cloneDeep, debounce, isEmpty } from 'lodash'

export default defineComponent({
  props: {
    value: {
      type: Object,
      default: null
    },
    jobId: {
      type: String,
      default: null
    },
    defaultParams: {
      type: Object,
      default: () => ({})
    },
    label: {
      type: String,
      default: 'Select'
    },
    itemText: {
      type: String,
      default: 'name'
    },
    itemValue: {
      type: String,
      default: 'id'
    }
  },
  setup(props, { emit }) {
    const { $api } = useContext()
    const model = computed({
      get: () => props.value,
      set: (val) => {
        return emit('input', val)
      }
    })
    const state = reactive({
      items: []
    })
    const search = ref(null)

    const fetchData = async (keyword = '') => {
      try {
        const { result } = await $api.job.getAssignee(props.jobId, {
          name: keyword,
          ...props.defaultParams
        })
        state.items = result
      } catch (e) {
        window.console.error(e)
      }
    }

    watch(
      search,
      debounce(function (keyword) {
        fetchData(keyword)
      }, 250)
    )

    onMounted(() => {
      if (!isEmpty(props.value)) {
        state.items = [cloneDeep(props.value)]
      }
      fetchData()
    })

    return {
      model,
      items: toRef(state, 'items'),
      search,
      fetchData
    }
  }
})
</script>
