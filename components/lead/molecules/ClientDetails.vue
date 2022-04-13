<template>
  <v-row dense>
    <v-col cols="12">
      <app-text-field :value="form.type | mapType(leadTypes)" :label="$t('lead.model.typeOfClient')" readonly />
    </v-col>
    <v-col cols="12">
      <app-text-field v-model="form.customer.name" :label="$t('lead.model.contactName')" readonly />
    </v-col>
    <v-col cols="12">
      <app-text-field v-model="form.customer.emailAddress" :label="$t('common.model.email')" readonly />
    </v-col>
    <v-col cols="12">
      <app-text-field v-model="form.customer.mobilePhone" :label="$t('common.model.mobilePhone')" readonly />
    </v-col>
    <v-col cols="12">
      <app-text-field v-model="form.customer.phoneNumber" :label="$t('common.model.phone')" readonly />
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import AppTextField from '~/components/atoms/global/AppTextField'
import { LEAD_TYPE_BUSINESS } from '~/utils/constants'

export default defineComponent({
  name: 'LeadDetails',
  components: {
    AppTextField
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const { $api } = useContext()
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    const leadTypes = ref([])
    useFetch(async () => {
      const { result } = await $api.lead.getLeadTypes()
      leadTypes.value = result
    })

    return {
      form,
      leadTypes
    }
  },
  methods: {
    isLeadTypeBusiness(type) {
      return type === LEAD_TYPE_BUSINESS
    }
  }
})
</script>
