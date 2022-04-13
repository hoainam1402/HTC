<template>
  <v-row dense>
    <v-col v-if="purchaseOrder" cols="12" class="text--secondary">
      <div v-if="purchaseOrder.supplier">{{ purchaseOrder.supplier.displayName }}</div>
      <div v-if="purchaseOrder.description">{{ purchaseOrder.description }}</div>
    </v-col>
    <v-col cols="12" md="6">
      <app-text-field v-model="form.referenceNumber" label="Reference #" vid="referenceNumber" rules="required" />
    </v-col>
    <v-col cols="12" md="6">
      <app-date-picker v-model="form.invoiceDate" label="Invoice date" vid="invoiceDate" rules="required" />
    </v-col>
    <v-col cols="12">
      <app-textarea v-model="form.notes" label="Notes" vid="notes" rows="2" />
    </v-col>
    <v-col cols="12">
      <invoice-item v-model="form" :purchase-order="purchaseOrder" />
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import AppTextField from '~/components/atoms/global/AppTextField'
import AppTextarea from '~/components/atoms/global/AppTextarea'
import AppDatePicker from '~/components/atoms/global/AppDatePicker'
import InvoiceItem from '~/components/invoice/organisms/form/InvoiceItem'

export default defineComponent({
  name: 'InvoiceForm',
  components: {
    AppTextField,
    AppTextarea,
    AppDatePicker,
    InvoiceItem
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    purchaseOrder: {
      type: Object,
      default: () => null
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
