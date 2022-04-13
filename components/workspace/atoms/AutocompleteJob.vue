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
    :filter="itemsFilter"
    hide-no-data
    hide-details
    persistent-hint
    dense
    clearable
  >
    <template #selection="data">{{ data.item.refNo }} - {{ data.item.description }}</template>
    <template #item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-content>{{ data.item.refNo }} - {{ data.item.description }}</v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
import _ from 'lodash'
import { computed, defineComponent, ref, useContext, watch } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'AutocompleteJob',
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
      default: 'description'
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

    const fetchJobs = _.debounce(async (keywords) => {
      try {
        const filter = keywords || searchKeywords.value || ''
        isLoading.value = true
        const result = await $api.job.getJobs({ filter })
        items.value = ((result || {}).result || {}).items || []
      } catch (e) {
        window.console.error(e)
      } finally {
        isLoading.value = false
      }
    }, 300)

    watch(searchKeywords, (value) => {
      fetchJobs(value)
    })

    const itemsFilter = (item, queryText) => {
      return (item.refNo || '').includes(queryText) || (item.description || '').includes(queryText)
    }

    return {
      model,
      search: searchKeywords,
      items,
      itemsFilter,
      loading: isLoading
    }
  }
})
</script>
