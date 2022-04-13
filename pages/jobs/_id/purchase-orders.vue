<template>
  <v-row class="mt-2" dense>
    <v-col cols="12">
      <v-card>
        <v-card-title>
          {{ $t('task.purchaseOrders.title') }}
          <v-spacer />
          <v-btn color="primary" @click="handleAdd">{{ $t('task.purchaseOrders.addPurchaseOrder') }}</v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="py-0">
          <v-chip-group v-model="conditions.status" active-class="primary--text" multiple>
            <v-chip v-for="item in orderStatuses" :key="item.key" filter>
              {{ item.value }}
            </v-chip>
          </v-chip-group>
          <app-data-table
            :headers="headers"
            :items="items"
            :loading="loading"
            class="flex-grow-1"
            disable-pagination
            hide-default-footer
          >
            <template #item.orderNumber="{ item }">
              <a class="text-decoration-underline" @click="handleUpdate(item)">
                <span>{{ item.orderNumber }}</span>
              </a>
            </template>
            <template #item.creationTime="{ item }">
              <div>{{ item.creationTime | formatDate('DD/MM/YYYY') }}</div>
            </template>
            <template #item.dateRequired="{ item }">
              <div>{{ item.dateRequired | formatDate('DD/MM/YYYY') }}</div>
            </template>
            <template #item.status="{ value }">
              <v-chip :color="value | orderColor" label small>
                {{ value | mapType(orderStatuses) }}
              </v-chip>
            </template>
            <template #item.total="{ value }">
              {{ value | formatCurrency }}
            </template>
            <template #item.actions="{ item }">
              <v-menu offset-y>
                <template #activator="{ on, attrs }">
                  <v-btn v-bind="attrs" icon v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-if="[1, 2].includes(item.status)" dense @click="handleAddInvoiceReceipt(item)">
                    <v-list-item-title>
                      <v-icon dense>mdi-receipt</v-icon>
                      <span class="ml-1">Add Invoice / Receipt</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item dense @click="handleSendMail(item)">
                    <v-list-item-title>
                      <v-icon dense>mdi-email-send-outline</v-icon>
                      <span class="ml-1">Mail order</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item dense @click="handleUpdate(item)">
                    <v-list-item-title>
                      <v-icon dense>mdi-pencil-outline</v-icon>
                      <span class="ml-1">{{ $t('common.action.update') }}</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="[0].includes(item.status)" class="error--text" dense @click="handleDelete(item)">
                    <v-list-item-title>
                      <v-icon color="error" dense>mdi-delete-outline</v-icon>
                      <span class="ml-1">{{ $t('common.action.delete') }}</span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </app-data-table>
        </v-card-text>
        <create-purchase-order ref="createPurchaseOrder" @success="refresh" />
        <update-purchase-order ref="updatePurchaseOrder" @success="refresh" />
        <invoice-edit-dialog ref="invoiceEditDialog" @success="refresh" />
        <send-mail-dialog ref="sendMailDialog" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, useRoute } from '@nuxtjs/composition-api'
import { useGetOrder } from '@/compositions'
import CreatePurchaseOrder from '~/components/purchase-order/organisms/CreatePurchaseOrder'
import UpdatePurchaseOrder from '~/components/purchase-order/organisms/UpdatePurchaseOrder'
import InvoiceEditDialog from '~/components/invoice/organisms/InvoiceEditDialog'
import SendMailDialog from '~/components/mail/organisms/SendMailDialog'
import AppDataTable from '~/components/atoms/global/AppDataTable'

export default defineComponent({
  components: {
    AppDataTable,
    CreatePurchaseOrder,
    UpdatePurchaseOrder,
    InvoiceEditDialog,
    SendMailDialog
  },
  setup(props, { root }) {
    const { $api, params, $dialog, $snackbar } = useContext()
    const route = useRoute()
    const state = reactive({
      params: Object.assign(
        {
          filter: '',
          sorting: 'creationTime desc',
          status: [],
          jobId: params.value.id
        },
        {
          ...route.value.query,
          status: route.value.query.status ? route.value.query.status.split(',').map((e) => parseInt(e)) : []
        }
      ),
      sorting: {
        sortBy: ['creationTime'],
        sortDesc: [false]
      },
      headers: [
        { text: root.$t('task.purchaseOrders.order'), value: 'orderNumber' },
        { text: root.$t('task.purchaseOrders.description'), value: 'description' },
        { text: root.$t('task.purchaseOrders.supplier'), value: 'supplierRef' },
        { text: root.$t('task.purchaseOrders.supplierName'), value: 'supplier.displayName' },
        { text: root.$t('task.purchaseOrders.created'), value: 'creationTime' },
        { text: root.$t('task.purchaseOrders.required'), value: 'dateRequired' },
        { text: root.$t('task.purchaseOrders.total'), value: 'total' },
        { text: root.$t('task.purchaseOrders.status'), value: 'status' },
        { text: '', sortable: false, align: 'center', value: 'actions', width: '5%' }
      ]
    })
    const createPurchaseOrder = ref(null)
    const updatePurchaseOrder = ref(null)
    const invoiceEditDialog = ref(null)
    const sendMailDialog = ref(null)

    const { loading, conditions, refresh, state: listState } = useGetOrder(state.params)

    const handleAdd = () => {
      createPurchaseOrder.value.open()
    }

    const handleUpdate = (data) => {
      updatePurchaseOrder.value.open(data)
    }

    const handleDelete = (data) => {
      $dialog
        .confirm({
          text: root.$t('task.purchaseOrders.message.confirmDeletionMessage'),
          title: root.$t('common.message.confirmDeletionTitle')
        })
        .then((confirm) => {
          if (confirm) {
            $api.order
              .deleteOrder(data.id)
              .then(() => {
                refresh.value()
                $snackbar({
                  message: root.$t('task.purchaseOrders.message.successDelete'),
                  color: 'success'
                })
              })
              .catch(() => {
                this.$snackbar({
                  message: this.$t('common.message.somethingWentWrong'),
                  color: 'error'
                })
              })
          }
        })
    }

    const handleAddInvoiceReceipt = (purchaseOrder) => {
      invoiceEditDialog.value.open(purchaseOrder, null)
    }

    const handleSendMail = (purchaseOrder) => {
      sendMailDialog.value.open(purchaseOrder)
    }

    return {
      sorting: toRef(state, 'sorting'),
      headers: toRef(state, 'headers'),
      conditions,
      loading,
      refresh,
      items: toRef(listState, 'items'),
      createPurchaseOrder,
      updatePurchaseOrder,
      invoiceEditDialog,
      sendMailDialog,
      handleAdd,
      handleUpdate,
      handleDelete,
      handleAddInvoiceReceipt,
      handleSendMail
    }
  },
  async asyncData({ store }) {
    await store.dispatch('job/getOrderMetadata')
  },
  computed: {
    orderStatuses() {
      return this.$store.state.job.orderMetadata.orderStatuses
    }
  }
})
</script>
