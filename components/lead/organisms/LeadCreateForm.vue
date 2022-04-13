<template>
  <v-row dense>
    <v-col cols="12" sm="6">
      <div class="font-weight-bold text--primary">{{ $t('lead.model.contactInformation') }}</div>
      <v-row dense>
        <v-col cols="12">
          <app-radio
            v-model="form.type"
            :items="leadTypes"
            :label="$t('lead.model.typeOfClient')"
            vid="type"
            rules="required"
            row
          />
        </v-col>
        <v-col cols="12">
          <client-combobox
            v-model="client"
            :default-params="{ type: clientType }"
            :label="clientTypeLocalized"
            :rules="`${isCreateClient ? '' : 'required|max:30'}`"
            allow-create
          />
        </v-col>
        <v-col v-if="isCreateClient" cols="12">
          <individual-form v-model="form.customer" from-lead />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" sm="6">
      <div class="font-weight-bold text--primary">{{ $t('lead.action.projectScope') }}</div>
      <v-row dense>
        <v-col cols="12">
          <select-source-type v-model="form.source" :label="$t('lead.model.source')" vid="source" rules="required" />
        </v-col>
        <v-col cols="12">
          <task-template-autocomplete
            v-model="form.taskTemplateId"
            :label="$t('lead.model.taskTemplate')"
            vid="taskTemplate"
            rules="required"
          />
        </v-col>
        <v-col cols="12">
          <app-currency v-model="form.budget" :label="$t('lead.model.budget')" vid="budget" />
        </v-col>
        <v-col cols="12">
          <app-date-picker v-model="form.startDate" :label="$t('lead.model.startDate')" vid="startDate" />
        </v-col>
      </v-row>
      <div class="font-weight-bold text--primary">{{ $t('common.model.address') }}</div>
      <v-row dense>
        <v-col cols="12">
          <app-text-field
            v-model="form.address.street"
            :label="$t('common.model.address')"
            vid="street"
            rules="required|max:255"
          />
        </v-col>
        <v-col cols="12">
          <app-text-field v-model="form.address.ward" :label="$t('common.model.ward')" vid="ward" rules="max:30" />
        </v-col>
        <v-col cols="12" sm="4">
          <select-state v-model="form.address.state" :label="$t('common.model.state')" vid="state" rules="max:150" />
        </v-col>
        <v-col cols="12" sm="4">
          <app-text-field
            v-model="form.address.postalCode"
            :label="$t('common.model.postalCode')"
            vid="postalCode"
            rules="max:30"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <app-text-field
            v-model="form.address.codeNumber"
            :label="$t('common.model.codeNumber')"
            vid="codeNumber"
            rules="required|max:30"
            disabled
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent, ref, useContext, useFetch, watch } from '@nuxtjs/composition-api'
import AppTextField from '~/components/atoms/global/AppTextField'
import AppCurrency from '~/components/atoms/global/AppCurrency'
import AppRadio from '~/components/atoms/global/AppRadio'
import AppDatePicker from '~/components/atoms/global/AppDatePicker'
import ClientCombobox from '~/components/client/organisms/ClientCombobox'
import IndividualForm from '~/components/client/molecules/IndividualForm'
import SelectSourceType from '~/components/lead/organisms/SelectSourceType'
import TaskTemplateAutocomplete from '~/components/lead/organisms/TaskTemplateAutocomplete'
import SelectState from '~/components/common/molecules/SelectState'
import { CLIENT_TYPE_BUSINESS, CLIENT_TYPE_PERSON, LEAD_TYPE_BUSINESS } from '~/utils/constants'

export default defineComponent({
  name: 'LeadForm',
  components: {
    AppTextField,
    AppCurrency,
    AppRadio,
    AppDatePicker,
    ClientCombobox,
    IndividualForm,
    SelectSourceType,
    TaskTemplateAutocomplete,
    SelectState
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit, root }) {
    const { $api } = useContext()

    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })
    const clientType = computed(() => {
      return props.value.type === LEAD_TYPE_BUSINESS ? CLIENT_TYPE_BUSINESS : CLIENT_TYPE_PERSON
    })
    const loading = ref(false)

    const leadTypes = ref([])
    useFetch(async () => {
      const { result } = await $api.lead.getLeadTypes()
      leadTypes.value = result
    })

    // locale enum values (eg 1 => 'Business name', 0 => 'Family name')
    const clientTypeLocalized = computed(() => {
      return root.$t(`lead.model.${props.value.type === LEAD_TYPE_BUSINESS ? 'business' : 'family'}Name`)
    })

    const isCreateClient = ref(false)
    const client = ref(null)
    watch(client, (val) => {
      if (val?.id) {
        isCreateClient.value = false
        form.value.customerId = val.id
      } else {
        isCreateClient.value = true
        form.value.customerId = null
        form.value.customer = {
          familyName: val,
          mobilePhone: null,
          phoneNumber: null,
          emailAddress: null
        }
        // fix generate code number
        // form.value.address = {
        //   street: null,
        //   ward: null,
        //   province: null,
        //   state: null,
        //   postalCode: null,
        //   codeNumber: null
        // }
      }
    })
    watch(
      () => form.value.type,
      () => {
        form.value.customerId = null
      }
    )

    return {
      form,
      clientType,
      loading,
      leadTypes,
      clientTypeLocalized,
      isCreateClient,
      client
    }
  },
  methods: {
    isLeadTypeBusiness(type) {
      return type === LEAD_TYPE_BUSINESS
    }
  }
})
</script>
