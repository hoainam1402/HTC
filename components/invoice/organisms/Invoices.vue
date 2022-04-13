<template>
  <v-card>
    <v-card-title>
      Invoices
      <v-spacer />
      <v-btn v-if="[1, 2].includes(purchaseOrder.status)" color="primary" @click="onAddInvoice">
        <v-icon>mdi-plus</v-icon>
        <span>Add Invoice</span>
      </v-btn>
    </v-card-title>
    <v-card-text class="pa-1">
      <v-data-table
        :headers="headers"
        :items="form.invoices"
        group-by="invoiceDate"
        show-group-by
        hide-default-header
        hide-default-footer
      >
        <template #group.header="{ group, items, isOpen, toggle }">
          <td :colspan="headers.length">
            <v-btn icon small @click="toggle">
              <v-icon v-if="isOpen">mdi-minus</v-icon>
              <v-icon v-else>mdi-plus</v-icon>
            </v-btn>
            <span class="font-weight-bold">{{ group | formatDate('DD/MM/YYYY') }} ({{ items.length }})</span>
          </td>
        </template>
        <template #item.referenceNumber="{ item }">
          <div>
            Invoice:
            <strong>{{ item.referenceNumber }}</strong>
          </div>
        </template>
        <template #item.total="{ item }">
          {{ item.total | formatCurrency }}
        </template>
        <template #item.actions="{ item }">
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn v-if="[2].includes(purchaseOrder.status)" v-bind="attrs" icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="onUpdateInvoice(item)">
                <v-list-item-title>
                  <v-icon class="mr-1" dense>mdi-pencil-outline</v-icon>
                  <span>{{ $t('common.action.update') }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="error--text" @click="onDeleteInvoice(item)">
                <v-list-item-title>
                  <v-icon class="mr-1" color="error" dense>mdi-delete-outline</v-icon>
                  <span>{{ $t('common.action.delete') }}</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card-text>
    <invoice-edit-dialog ref="invoiceEditDialog" @success="reloadInvoiceItems" />
  </v-card>
</template>

<script>
import { computed, defineComponent, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'
import InvoiceEditDialog from '~/components/invoice/organisms/InvoiceEditDialog'

export default defineComponent({
  components: {
    InvoiceEditDialog
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    purchaseOrder: {
      type: Object,
      required: true
    }
  },
  setup(props, { root, emit }) {
    const { $api, $dialog, $snackbar } = useContext()
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    const state = reactive({
      headers: [
        { text: '', value: 'referenceNumber', align: 'start', sortable: false, groupable: false },
        { text: '', value: 'invoiceDate', align: 'right', sortable: false },
        { text: '', value: 'total', align: 'right', sortable: false, groupable: false },
        { text: '', value: 'actions', align: 'right', sortable: false, groupable: false }
      ]
    })

    const invoiceEditDialog = ref(null)

    const reloadInvoiceItems = () => {
      const orderId = (props.purchaseOrder || {}).id
      if (typeof orderId !== 'string') return

      $api.order
        .getInvoices(orderId)
        .then(({ result }) => {
          form.value.invoices = result
        })
        .catch(() => {
          this.$snackbar({
            message: this.$t('common.message.somethingWentWrong'),
            color: 'error'
          })
        })
    }

    const onAddInvoice = () => {
      const orderId = (props.purchaseOrder || {}).id
      if (typeof orderId !== 'string') return

      invoiceEditDialog.value.open(props.purchaseOrder, null)
    }
    const onUpdateInvoice = (invoiceItem) => {
      const orderId = (props.purchaseOrder || {}).id
      if (typeof orderId !== 'string') return

      invoiceEditDialog.value.open(props.purchaseOrder, invoiceItem)
    }
    const onDeleteInvoice = (data) => {
      $dialog
        .confirm({
          text: root.$t('invoice.message.confirmDeletionMessage'),
          title: root.$t('common.message.confirmDeletionTitle')
        })
        .then((confirm) => {
          if (confirm) {
            $api.order
              .deleteInvoice(props.purchaseOrder.id, data)
              .then(() => {
                reloadInvoiceItems()
                $snackbar({
                  message: root.$t('invoice.message.successDelete'),
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

    reloadInvoiceItems()

    return {
      form,
      headers: toRef(state, 'headers'),
      invoiceEditDialog,
      reloadInvoiceItems,
      onAddInvoice,
      onUpdateInvoice,
      onDeleteInvoice
    }
  }
})
</script>
