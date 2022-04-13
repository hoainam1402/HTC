<template>
  <v-row dense>
    <v-col cols="12" sm="6">
      <v-row dense>
        <v-col cols="12">
          <client-combobox
            v-model="client"
            :label="$t('job.model.customerName')"
            vid="customerId"
            rules="required"
            allow-create
          />
        </v-col>
        <v-col cols="12">
          <select-building-type
            v-model="form.buildingType"
            :label="$t('job.model.buildingType')"
            vid="buildingType"
            rules="required"
          />
        </v-col>
        <v-col cols="12">
          <app-text-field v-model="form.description" :label="$t('job.model.description')" vid="description" />
        </v-col>
        <v-col cols="12" sm="6">
          <app-date-picker
            v-model="form.expectedStart"
            :label="$t('job.model.expectedStart')"
            vid="expectedStart"
            rules="required"
          />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12" sm="6">
          <select-invoice-method
            v-model="form.invoiceMethod"
            :label="$t('job.model.invoiceMethod')"
            vid="invoiceMethod"
            @change="handleChangeInvoiceMethod"
          />
        </v-col>
        <template v-if="form.invoiceMethod === 0">
          <v-col cols="12" sm="6">
            <app-currency v-model="form.contractTotal" :label="$t('job.model.contractTotal')" vid="contractTotal">
              <template #append-outer>
                <tax-profile v-model="form.appliedTaxId" :tax-profile="taxProfile" />
              </template>
            </app-currency>
          </v-col>
          <v-col cols="12" sm="6" />
          <v-col cols="12" sm="6">
            <app-text-field
              v-model="form.markupPercent"
              type="number"
              :label="$t('job.model.markupPercent')"
              vid="markupPercent"
              rules="required|min_value:0|max_value:100"
              suffix="%"
            />
          </v-col>
        </template>
        <template v-if="form.invoiceMethod === 1">
          <v-col cols="12" sm="6">
            <app-text-field
              v-model="form.costPlusPercent"
              type="number"
              :label="$t('job.model.costPlusPercent')"
              vid="costPlusPercent"
              rules="required|min_value:0|max_value:100"
              suffix="%"
            />
          </v-col>
        </template>
        <v-col cols="12">
          <app-checkbox v-model="form.createDefaultTasks" :label="$t('job.model.defaultTasks')" />
          <app-checkbox
            v-if="form.invoiceMethod === 0"
            v-model="form.createDefaultInvoices"
            :label="$t('job.model.defaultInvoices')"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent, ref, watch } from '@nuxtjs/composition-api'
import AppTextField from '~/components/atoms/global/AppTextField'
import AppCurrency from '~/components/atoms/global/AppCurrency'
import AppCheckbox from '~/components/atoms/global/AppCheckbox'
import AppDatePicker from '~/components/atoms/global/AppDatePicker'
import ClientCombobox from '~/components/client/organisms/ClientCombobox'
import SelectBuildingType from '~/components/job/organisms/SelectBuildingType'
import SelectInvoiceMethod from '~/components/job/organisms/SelectInvoiceMethod'
import TaxProfile from '~/components/job/atoms/TaxProfile'

export default defineComponent({
  name: 'JobCreateForm',
  components: {
    AppTextField,
    AppCurrency,
    AppCheckbox,
    AppDatePicker,
    ClientCombobox,
    SelectBuildingType,
    SelectInvoiceMethod,
    TaxProfile
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    taxProfile: {
      type: Object,
      default: null
    }
  },
  setup(props, { emit }) {
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })
    const client = ref(null)
    watch(client, (val) => {
      if (val?.id) {
        form.value.customerId = val.id
        form.value.customerName = null
      } else {
        form.value.customerId = null
        form.value.customerName = val
      }
    })

    const handleChangeInvoiceMethod = (val) => {
      if (val === 0) {
        form.value.costPlusPercent = null
      } else if (val === 1) {
        form.value.contractTotal = null
        form.value.markupPercent = null
      }
    }

    return {
      form,
      client,
      handleChangeInvoiceMethod
    }
  }
})
</script>
