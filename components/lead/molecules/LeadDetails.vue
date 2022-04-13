<template>
  <v-row dense>
    <v-col cols="12" sm="6">
      <app-text-field v-model="form.ref" :label="$t('lead.model.ref')" readonly />
    </v-col>
    <v-col cols="12" sm="6">
      <app-text-field
        :value="form.creationTime | formatDate('DD/MM/YYYY')"
        :label="$t('common.model.creationDate')"
        readonly
      />
    </v-col>
    <v-col cols="12" sm="12">
      <select-stage v-model="form.stage" :label="$t('lead.model.stage')" vid="stage" rules="required" />
    </v-col>
    <v-col cols="12" sm="12">
      <select-source-type v-model="form.source" :label="$t('lead.model.source')" vid="source" rules="required" />
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import AppTextField from '~/components/atoms/global/AppTextField'
import SelectStage from '~/components/lead/organisms/SelectStage'
import SelectSourceType from '~/components/lead/organisms/SelectSourceType'

export default defineComponent({
  name: 'LeadDetails',
  components: {
    AppTextField,
    SelectStage,
    SelectSourceType
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
