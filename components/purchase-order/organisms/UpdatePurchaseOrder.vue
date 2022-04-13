<template>
  <v-navigation-drawer v-model="visible" width="80vw" app stateless temporary right>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6">Purchase Order Details</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <app-form v-if="visible" v-slot="{ handleSubmit }">
      <v-card flat>
        <v-card-text>
          <purchase-order-form v-model="model" />
          <div class="mt-2">
            <invoices v-model="model" :purchase-order="model" />
          </div>
          <div class="mt-3">
            <documents
              v-model="model"
              :change-handler="documentChangeHandler"
              :delete-handler="documentDeleteHandler"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="loading" class="px-2 mr-1" text @click="close">
            {{ $t('common.action.discard') }}
          </v-btn>
          <v-btn :loading="loading" color="primary" class="px-2" @click="handleSubmit(submit)">
            {{ $t('common.action.update') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </app-form>
  </v-navigation-drawer>
</template>

<script>
import { defineComponent, nextTick, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'
import AppForm from '~/components/atoms/global/AppForm'
import PurchaseOrderForm from '~/components/purchase-order/molecules/PurchaseOrderForm'
import Invoices from '~/components/invoice/organisms/Invoices'
import Documents from '~/components/common/organisms/Documents'

export default defineComponent({
  name: 'UpdatePurchaseOrder',
  components: {
    AppForm,
    PurchaseOrderForm,
    Invoices,
    Documents
  },
  setup(props, { root, emit }) {
    const initialState = () => ({
      model: {
        jobId: params.value.id,
        description: '',
        status: 0,
        instruction: '',
        supplierId: null,
        attentionName: '',
        dateRequired: null,
        pickUp: false,
        deliveryAddress: {
          street: '',
          province: '',
          state: '',
          postalCode: ''
        },
        lineItems: [],
        isShowCostsWhenPrinting: false,
        deliveryTaxId: null,
        deliveryFee: '0.0'
      }
    })

    const { $api, $snackbar, params } = useContext()
    const visible = ref(false)
    const loading = ref(false)
    const state = reactive(initialState())

    const open = (data) => {
      root.$nuxt.$loading.start()
      $api.order
        .getOrder(data.id)
        .then(({ result }) => {
          visible.value = true
          nextTick(() => {
            state.model = result
            state.model.jobId = result.job.id
            state.model.supplierId = result.supplier.id
            state.model.deliveryAddress = result.deliveryAddress || {
              street: '',
              province: '',
              state: '',
              postalCode: ''
            }
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
    const close = () => {
      visible.value = false
    }
    const submit = () => {
      loading.value = true
      $api.order
        .updateOrder(state.model)
        .then(() => {
          visible.value = false
          emit('success')
          $snackbar({
            message: 'Success',
            color: 'success'
          })
        })
        .catch(() => {
          this.$snackbar({
            message: this.$t('common.message.somethingWentWrong'),
            color: 'error'
          })
        })
        .finally(() => {
          loading.value = false
        })
    }

    const documentChangeHandler = async (data) => {
      return await $api.order.createAttachment(state.model.id, data)
    }
    const documentDeleteHandler = async (data) => {
      return await $api.order.deleteAttachment(data.id)
    }

    return {
      visible,
      loading,
      model: toRef(state, 'model'),
      open,
      close,
      submit,
      documentChangeHandler,
      documentDeleteHandler
    }
  }
})
</script>
