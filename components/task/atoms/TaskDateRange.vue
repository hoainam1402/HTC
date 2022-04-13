<template>
  <v-menu
    v-model="isMenuOpen"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        :value="displayDate"
        :label="$t('job.task.filter.dateRange')"
        dense
        clearable
        readonly
        hide-details
        v-bind="attrs"
        v-on="on"
      >
        <template slot="append">
          <v-icon v-on="on">mdi-calendar</v-icon>
        </template>
      </v-text-field>
    </template>
    <v-card flat class="pa-0">
      <v-date-picker v-model="pickerDate" no-title style="border: none" />
      <v-card-actions>
        <v-btn color="error" outlined @click="clearSelections">Clear</v-btn>
        <v-spacer />
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-icon color="secondary" dark v-bind="attrs" v-on="on">mdi-help-circle-outline</v-icon>
          </template>
          <div v-html="$t('job.task.message.dateRangeHelp')" />
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import _ from 'lodash'
import { computed, defineComponent, reactive, toRef, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'TaskDateRange',
  props: {
    value: {
      type: String,
      default: null
    }
  },
  setup(props, { emit, root }) {
    const { $moment } = useContext()
    const model = computed({
      get: () => {
        if (props.value && typeof props.value === 'string') {
          return props.value.split('|').map((date) => {
            return $moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM-DD')
          })
        }
        return []
      },
      set: (val) => {
        const dates = _.cloneDeep(val || [])
          .map((date) => `${date}T00:00:00.00000`)
          .join('|')
        return emit('input', dates)
      }
    })
    const state = reactive({
      isMenuOpen: false
    })
    const displayDate = computed(() => {
      return _.cloneDeep(model.value || [])
        .map((item) => {
          try {
            return $moment(`${item}`).format('DD/MM/YYYY')
          } catch (e) {
            window.console.error(e)
            return item
          }
        })
        .join(' → ')
    })

    const clearSelections = () => {
      model.value = ''
    }

    return {
      isMenuOpen: toRef(state, 'isMenuOpen'),
      pickerDate: model,
      displayDate,
      clearSelections
    }
  }
})
</script>
