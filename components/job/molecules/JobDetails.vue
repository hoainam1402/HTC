<template>
  <v-row dense>
    <v-col cols="12" sm="6">
      <app-text-field v-model="form.refNo" :label="$t('job.model.ref')" vid="refNo" rules="required" />
    </v-col>
    <v-col cols="12" sm="6">
      <task-template-autocomplete
        v-model="form.taskTemplate"
        :label="$t('lead.model.taskTemplate')"
        vid="taskTemplate"
        rules="required"
        disabled
      />
    </v-col>
    <v-col cols="12" sm="12">
      <app-text-field v-model="form.description" :label="$t('job.model.description')" vid="description" />
    </v-col>
    <v-col cols="12" sm="12">
      <app-text-field
        :value="form.expectedStart | formatDate('DD/MM/YYYY')"
        :label="$t('job.model.expectedStart')"
        readonly
      />
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import AppTextField from '~/components/atoms/global/AppTextField'
import TaskTemplateAutocomplete from '~/components/lead/organisms/TaskTemplateAutocomplete'

export default defineComponent({
  components: {
    AppTextField,
    TaskTemplateAutocomplete
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    return {
      form
    }
  }
})
</script>
