<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header class="title">{{ $t('common.action.filters') }}</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row class="align-center" dense>
          <v-col cols="12" md="3">
            <autocomplete-job v-model="filter.jobId" :label="$t('job.task.filter.job')" />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filter.progress"
              :items="taskProgresses"
              :label="$t('job.task.filter.status')"
              item-value="key"
              item-text="value"
              multiple
              small-chips
              hide-details
              dense
            />
          </v-col>
          <v-col v-if="$acl.can('Pages.Administration')" cols="12" md="6">
            <user-autocomplete
              v-model="filter.assigneeId"
              :label="$t('job.task.filter.assignee')"
              :outlined="false"
              multiple
            />
          </v-col>
          <v-col cols="12" md="3">
            <app-date-picker v-model="filter.date" :outlined="false" />
          </v-col>
          <v-col cols="12" md="3">
            <v-btn color="primary" @click="$emit('filter')">{{ $t('common.action.filter') }}</v-btn>
            <v-btn color="secondary" @click="$emit('reset')">{{ $t('common.action.reset') }}</v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { computed, defineComponent, reactive, toRef, useContext, useFetch } from '@nuxtjs/composition-api'
import AutocompleteJob from '~/components/workspace/atoms/AutocompleteJob'
import UserAutocomplete from '~/components/user/organisms/UserAutocomplete'
import AppDatePicker from '~/components/atoms/global/AppDatePicker'

export default defineComponent({
  name: 'ListFilter',
  components: {
    AppDatePicker,
    AutocompleteJob,
    UserAutocomplete
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const { $api } = useContext()
    const filter = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    const state = reactive({
      taskProgresses: []
    })

    useFetch(async () => {
      const response = await $api.task.getTaskEnums()
      const data = (response || {}).result || {}
      state.taskProgresses = data.taskProgress || []
    })

    return {
      filter,
      taskProgresses: toRef(state, 'taskProgresses')
    }
  }
})
</script>
