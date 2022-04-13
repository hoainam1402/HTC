<template>
  <div>
    <v-row dense>
      <v-col cols="12">
        <select-invoice-method
          v-model="form.invoiceMethod"
          :label="$t('job.model.invoiceMethod')"
          vid="invoiceMethod"
          readonly
        />
      </v-col>
      <v-col cols="12" sm="6">
        <app-text-field
          :value="form.totalPrice | formatCurrency"
          :label="$t('job.model.contractPriceTotalPrice')"
          readonly
        >
          <template #append>
            <v-btn color="primary" icon small @click="openUpdatePriceDialog">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </app-text-field>
      </v-col>
      <v-col v-if="form.taxProfile" cols="12" sm="6">
        <app-text-field :value="form.taxProfile.name" :label="$t('job.model.taxProfileName')" readonly>
          <template #append>
            <v-btn color="primary" icon small @click="openUpdateTaxProfileDialog">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </app-text-field>
      </v-col>
    </v-row>
    <contract-price-dialog
      ref="editPriceDialog"
      :loading="loading"
      :tax-profile-items="(form.taxProfile || {}).taxItems || []"
      @submit="onRequestSubmitPrice"
    />
    <tax-profile-dialog ref="editTaxProfileDialog" @submit="onRequestSubmitTaxProfile" />
  </div>
</template>

<script>
import _ from 'lodash'
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import AppTextField from '../../atoms/global/AppTextField'
import SelectInvoiceMethod from '~/components/job/organisms/SelectInvoiceMethod'
import ContractPriceDialog from '~/components/job/molecules/ContractPriceDialog'
import TaxProfileDialog from '~/components/job/molecules/TaxProfileDialog'

export default defineComponent({
  components: {
    AppTextField,
    SelectInvoiceMethod,
    TaxProfileDialog,
    ContractPriceDialog
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    invoiceMethods: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    const editPriceDialog = ref(null)
    const openUpdatePriceDialog = () => {
      const cleanedForm = JSON.parse(JSON.stringify(form.value.contractPrice))
      if (!cleanedForm && typeof cleanedForm !== 'object') return
      editPriceDialog.value.openDialog(cleanedForm)
    }
    const onRequestSubmitPrice = (contractPrice) => {
      const cleanedPrice = _.cloneDeep(contractPrice)
      if (!cleanedPrice.markupPercent) cleanedPrice.markupPercent = 0
      form.value.contractPrice = cleanedPrice
      form.value.totalPrice = cleanedPrice.totalPrice
      emit('submit')
    }

    const editTaxProfileDialog = ref(null)
    const openUpdateTaxProfileDialog = () => {
      const cleanedForm = JSON.parse(JSON.stringify(form.value.taxProfile))
      if (!cleanedForm && typeof cleanedForm !== 'object') return
      editTaxProfileDialog.value.openDialog(cleanedForm)
    }
    const onRequestSubmitTaxProfile = (taxProfile) => {
      form.value.taxProfile = JSON.parse(JSON.stringify(taxProfile))
      emit('submit')
    }

    return {
      form,
      editPriceDialog,
      openUpdatePriceDialog,
      onRequestSubmitPrice,
      editTaxProfileDialog,
      openUpdateTaxProfileDialog,
      onRequestSubmitTaxProfile
    }
  }
})
</script>
