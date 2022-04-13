<template>
  <v-row dense>
    <v-col cols="12" sm="6">
      <task-template-autocomplete
        v-model="form.taskTemplate.id"
        :label="$t('lead.model.taskTemplate')"
        vid="taskTemplate"
        rules="required"
        :disabled="disableTaskTemplate"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <app-currency v-model="form.budget" :label="$t('lead.model.budget')" vid="budget" />
    </v-col>
    <v-col cols="12">
      <app-text-field
        v-model="form.address.street"
        :label="$t('contact.model.address')"
        vid="address.street"
        rules="required"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <app-text-field
        v-model="form.address.ward"
        :label="$t('common.model.ward')"
        vid="address.ward"
        rules="required"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <app-date-picker v-model="form.startDate" :label="$t('lead.model.startDate')" vid="startDate" />
    </v-col>
    <v-col cols="12" sm="4">
      <select-state
        v-model="form.address.state"
        :label="$t('common.model.state')"
        vid="address.state"
        rules="required"
      />
    </v-col>
    <v-col cols="12" sm="4">
      <app-text-field
        v-model="form.address.postalCode"
        :label="$t('common.model.postalCode')"
        vid="address.postalCode"
      />
    </v-col>
    <v-col cols="12" sm="4">
      <app-text-field
        v-model="form.address.codeNumber"
        :label="$t('common.model.codeNumber')"
        vid="address.codeNumber"
        disabled
      />
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import AppTextField from '~/components/atoms/global/AppTextField'
import AppCurrency from '~/components/atoms/global/AppCurrency'
import AppDatePicker from '~/components/atoms/global/AppDatePicker'
import TaskTemplateAutocomplete from '~/components/lead/organisms/TaskTemplateAutocomplete'
import SelectState from '~/components/common/molecules/SelectState'

export default defineComponent({
  name: 'ProjectScope',
  components: {
    AppTextField,
    AppCurrency,
    AppDatePicker,
    TaskTemplateAutocomplete,
    SelectState
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


    const disableTaskTemplate = ref(props.value.stage === 3)

    return {
      form,
      disableTaskTemplate
    }
  }
})
</script>
