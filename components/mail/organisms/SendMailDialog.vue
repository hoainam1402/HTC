<template>
  <form-dialog v-model="visible" :loading="loading" title="Send Mail" width="600px" submit-text="Send" @submit="submit">
    <template slot="content">
      <send-mail-form v-model="model" :purchase-order="purchaseOrder" />
    </template>
  </form-dialog>
</template>

<script>
import { computed, defineComponent, reactive, ref, toRef, useContext, useStore, watch } from '@nuxtjs/composition-api'
import _ from 'lodash'
import FormDialog from '~/components/common/molecules/FormDialog'
import SendMailForm from '~/components/mail/organisms/SendMailForm'
import { convertModelToFormData } from '~/utils/convert-model-to-form-data'

export default defineComponent({
  name: 'SendMailDialog',
  components: {
    FormDialog,
    SendMailForm
  },
  setup(props, { emit }) {
    const initialState = () => ({
      purchaseOrder: null,
      model: {
        recipientIds: [],
        sendMeACopy: false,
        attachments: [],
        subject: null,
        body: null
      }
    })

    const { $api, $snackbar } = useContext()
    const store = useStore()
    const visible = ref(false)
    const loading = ref(false)
    const state = reactive(initialState())
    const job = computed(() => store.state.job.jobDetails)

    watch(visible, (isVisible) => {
      if (!isVisible) {
        Object.assign(state, initialState())
      }
    })

    const open = (purchaseOrder) => {
      state.purchaseOrder = purchaseOrder
      state.model.recipientIds = [purchaseOrder.supplier?.id]
      state.model.subject = `${job.value.refNo} - ${job.value.description} - Order #${purchaseOrder.orderNumber}`
      state.model.body = `Dear ${purchaseOrder.supplier?.displayName},`
      visible.value = true
    }

    const submit = async () => {
      const orderId = (state.purchaseOrder || {}).id
      if (typeof orderId !== 'string') return
      loading.value = true
      try {
        const cleanedForm = _.clone(state.model)
        const data = convertModelToFormData(cleanedForm)
        await $api.order.sendEmail(orderId, data)
        emit('success')
        $snackbar({
          message: 'Invoice has been updated successfully.',
          color: 'success'
        })
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
      open,
      submit
    }
  }
})
</script>
