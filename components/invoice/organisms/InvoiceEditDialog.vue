<template>
  <form-dialog v-model="visible" :loading="loading" title="Invoice / Receipt" is-update @submit="submit">
    <template slot="content">
      <invoice-form v-model="model" :purchase-order="purchaseOrder" />
    </template>
  </form-dialog>
</template>

<script>
import _ from 'lodash'
import { v4 as uuid4 } from 'uuid'
import { defineComponent, nextTick, reactive, ref, toRef, useContext, useStore, watch } from '@nuxtjs/composition-api'
import FormDialog from '~/components/common/molecules/FormDialog'
import InvoiceForm from '~/components/invoice/organisms/InvoiceForm'

export default defineComponent({
  name: 'InvoiceEditDialog',
  components: {
    FormDialog,
    InvoiceForm
  },
  setup(props, { root, emit }) {
    const initialState = () => ({
      purchaseOrder: null,
      model: {
        id: null,
        deliveryFee: 0,
        roundingAdjustment: 0,
        referenceNumber: null,
        notes: null,
        invoiceDate: null,
        subTotal: 0,
        gst: 0,
        total: 0,
        invoiceItems: []
      }
    })

    const { $api, $snackbar } = useContext()
    const visible = ref(false)
    const loading = ref(false)
    const store = useStore()
    const state = reactive(initialState())

    watch(visible, (isVisible) => {
      if (!isVisible) {
        Object.assign(state, initialState())
      }
    })

    const open = (purchaseOrder, invoice) => {
      if (!store.state.job) return
      state.purchaseOrder = purchaseOrder
      if (invoice && typeof invoice === 'object') {
        visible.value = true
        nextTick(() => {
          state.model = _.clone(invoice)
        })
        return
      }

      root.$nuxt.$loading.start()
      $api.order
        .getOrder(purchaseOrder.id)
        .then(({ result }) => {
          const cleanedModel = _.clone(initialState().model)
          cleanedModel.invoiceItems = _.map(result.lineItems || [], (item) => {
            return {
              _id: uuid4(),
              orderItem: item,
              qty: 0,
              unitCost: 0,
              totalCost: 0
            }
          })
          visible.value = true
          nextTick(() => {
            state.model = cleanedModel
          })
        })
        .catch(() => {
          this.$snackbar({
            message: this.$t('common.message.somethingWentWrong'),
            color: 'error'
          })
        })
        .finally(() => root.$nuxt.$loading.finish())
    }

    const submit = async () => {
      const orderId = (state.purchaseOrder || {}).id
      if (typeof orderId !== 'string') return
      loading.value = true
      try {
        const cleanedForm = _.clone(state.model)
        const isUpdateExisting = typeof cleanedForm.id === 'string'
        if (isUpdateExisting) {
          await $api.order.updateInvoice(orderId, cleanedForm)
        } else {
          await $api.order.createInvoice(orderId, cleanedForm)
        }
        emit('success')
        if (isUpdateExisting) {
          $snackbar({
            message: 'Invoice has been created successfully.',
            color: 'success'
          })
        } else {
          $snackbar({
            message: 'Invoice has been updated successfully.',
            color: 'success'
          })
        }
        visible.value = false
      } catch (e) {
        window.console.error(e)
      } finally {
        loading.value = false
      }
    }

    return {
      visible,
      loading,
      model: toRef(state, 'model'),
      purchaseOrder: toRef(state, 'purchaseOrder'),
      jobDetails: toRef(state, 'jobDetails'),
      open,
      submit
    }
  }
})
</script>
