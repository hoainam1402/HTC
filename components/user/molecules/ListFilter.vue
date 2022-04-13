<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header class="title">Filters</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row class="align-center" dense>
          <v-col cols="12" sm="6" md="3">
            <role-autocomplete v-model="filter.role" label="Roles" :outlined="false" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <app-select v-model="filter.onlyLockedUsers" :items="items" label="Display only" :outlined="false" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-btn color="primary" @click="$emit('filter')">Filter</v-btn>
            <v-btn color="secondary" @click="$emit('reset')">Reset</v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { computed, defineComponent, reactive, toRef } from '@nuxtjs/composition-api'
import RoleAutocomplete from '~/components/user/organisms/RoleAutocomplete'
import AppSelect from '~/components/atoms/global/AppSelect'

export default defineComponent({
  name: 'ListFilter',
  components: {
    RoleAutocomplete,
    AppSelect
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
    const state = reactive({
      items: [
        { value: 'Active users', key: false },
        { value: 'Locked users', key: true }
      ]
    })

    return {
      filter,
      items: toRef(state, 'items')
    }
  }
})
</script>
