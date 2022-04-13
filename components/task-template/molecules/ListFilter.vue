<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header class="title">{{ $t('common.action.filters') }}</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row class="align-center" dense>
          <v-col cols="12" sm="6" md="3">
            <select-building-type v-model="filter.buildingType" :label="$t('job.model.types')" :outlined="false" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-btn color="primary" @click="$emit('filter')">{{ $t('common.action.filter') }}</v-btn>
            <v-btn color="secondary" @click="$emit('reset')">{{ $t('common.action.reset') }}</v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import SelectBuildingType from '~/components/job/organisms/SelectBuildingType'

export default defineComponent({
  name: 'ListFilter',
  components: {
    SelectBuildingType
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const filter = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    return {
      filter
    }
  }
})
</script>
