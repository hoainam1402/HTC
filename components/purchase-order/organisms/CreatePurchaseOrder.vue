<template>
  <v-navigation-drawer v-model="visible" width="80vw" app stateless temporary right>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          New Purchase Order
          <span v-if="model.relatedTask">for task {{ model.relatedTask.name }}</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <app-form v-if="visible" v-slot="{ handleSubmit }">
      <v-card flat>
        <v-card-text>
          <purchase-order-form v-model="model" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="loading" class="px-2 mr-1" text @click="close">
            {{ $t('common.action.discard') }}
          </v-btn>
          <v-btn :loading="loading" color="primary" class="px-2" @click="handleSubmit(submit)">
            {{ $t('common.action.create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </app-form>
  </v-navigation-drawer>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, watch } from '@nuxtjs/composition-api'
import AppForm from '~/components/atoms/global/AppForm'
import PurchaseOrderForm from '~/components/purchase-order/molecules/PurchaseOrderForm'

export default defineComponent({
  name: 'CreatePurchaseOrder',
  components: {
    AppForm,
    PurchaseOrderForm
  },
  setup(props, { emit }) {
    const initialState = () => ({
      model: {
        jobId: params.value.id,
        description: '',
        status: 0,
        instruction: '',
        supplierId: null,
        supplier: null,
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

    watch(visible, (val) => {
      if (!val) {
        Object.assign(state, initialState())
      }
    })

    const open = (task = null) => {
      if (task) {
        state.model.relatedTaskId = task.id
        state.model.relatedTask = task
      }
      visible.value = true
    }
    const close = () => {
      visible.value = false
    }
    const submit = () => {
      loading.value = true
      $api.order
        .createOrder(state.model)
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

    return {
      visible,
      loading,
      model: toRef(state, 'model'),
      open,
      close,
      submit
    }
  }
})
</script>
