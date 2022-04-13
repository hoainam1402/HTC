<template>
  <v-autocomplete
    v-model="model"
    v-bind="$attrs"
    :search-input.sync="search"
    :loading="loading"
    :items="items"
    :label="label"
    :item-text="itemText"
    :item-value="itemValue"
    :multiple="multiple"
    :menu-props="{ maxHeight: '300' }"
    hide-no-data
    hide-details
    persistent-hint
    clearable
    dense
  />
</template>

<script>
import _ from 'lodash'
import { computed, defineComponent, ref, useContext, watch } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'AutocompleteAssignee',
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
      default: 'name'
    },
    itemValue: {
      type: String,
      default: 'id'
    },
    multiple: {
      type: Boolean,
      default: false
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
    const isLoading = ref(false)
    const searchKeywords = ref('')
    const items = ref([])

    const fetchUsers = _.debounce(async (keywords) => {
      try {
        const filter = keywords || searchKeywords.value || ''
        isLoading.value = true
        const result = await $api.job.getWorkspaceAssignees({ name: filter })
        items.value = (result || {}).result || []
      } catch (e) {
        window.console.error(e)
      } finally {
        isLoading.value = false
      }
    }, 300)

    watch(searchKeywords, (value) => {
      fetchUsers(value)
    })

    return {
      model,
      search: searchKeywords,
      items,
      loading: isLoading
    }
  }
})
</script>
