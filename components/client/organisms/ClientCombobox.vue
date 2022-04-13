<template>
  <app-combobox
    v-model="innerValue"
    v-bind="$attrs"
    :items="items"
    :search-input.sync="searchInput"
    :multiple="multiple"
    :menu-props="{ closeOnContentClick: true, maxHeight: '300' }"
    @search-input="handleSearchInput"
  >
    <template v-if="allowCreate" #no-data>
      <v-list-item @click="$emit('create', searchInput)">
        <v-list-item-icon>
          <v-icon>mdi-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t('common.action.create') }}
          <strong>{{ searchInput }}</strong>
        </v-list-item-title>
      </v-list-item>
    </template>
  </app-combobox>
</template>

<script>
import { computed, defineComponent, onMounted, ref, useContext, watch } from '@nuxtjs/composition-api'
import { cloneDeep, debounce, isEmpty } from 'lodash'
import AppCombobox from '~/components/atoms/global/AppCombobox'

export default defineComponent({
  name: 'ClientCombobox',
  components: {
    AppCombobox
  },
  props: {
    value: {
      type: [String, Number, Array, Object],
      default: null
    },
    defaultParams: {
      type: Object,
      default: () => ({})
    },
    multiple: {
      type: Boolean,
      default: false
    },
    allowCreate: {
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
    const fetchData = async (keyword = '') => {
      try {
        const { result } = await $api.client.getClients({
          filter: keyword,
          ...props.defaultParams
        })
        items.value = result.items
      } catch (e) {
        window.console.error(e)
      }
    }

    const searchInput = ref(null)
    const handleSearchInput = debounce(function (keyword) {
      fetchData(keyword)
    }, 250)

    watch(
      () => props.defaultParams,
      () => {
        fetchData()
      },
      {
        deep: true
      }
    )

    onMounted(() => {
      if (!isEmpty(props.value)) {
        items.value = [cloneDeep(props.value)]
      }
      fetchData()
    })

    return {
      innerValue,
      items,
      searchInput,
      handleSearchInput
    }
  }
})
</script>
