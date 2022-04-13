<template>
  <v-card>
    <v-card-title>
      <strong>Invoice items</strong>
      <v-spacer />
      <v-btn color="primary" @click="onAddNewItem">
        <v-icon>mdi-plus</v-icon>
        <span>Add Item</span>
      </v-btn>
    </v-card-title>
    <v-card-text class="pa-1">
      <v-row dense>
        <v-col cols="12">
          <ag-gird-table ref="agGridTable" :columns="columns" :rows="form.invoiceItems" single-click-edit />
        </v-col>
      </v-row>
      <v-divider />
      <v-row dense>
        <v-spacer />
        <v-col cols="12" md="6">
          <v-simple-table>
            <template #default>
              <tbody>
                <tr>
                  <td class="text-right">Sub Total</td>
                  <td class="text-right">
                    {{ subTotalComputed | formatCurrency }}
                  </td>
                </tr>
                <tr v-if="purchaseOrder && !purchaseOrder.pickUp">
                  <td class="d-flex justify-end align-center text-right">
                    <span class="mr-1">Delivery/Freight</span>
                  </td>
                  <td class="text-right">
                    <app-text-field
                      v-model="form.deliveryFee"
                      type="number"
                      vid="deliveryFee"
                      class="cost-input"
                      single-line
                      solo
                      flat
                    />
                  </td>
                </tr>
                <tr>
                  <td class="text-right">GST</td>
                  <td class="text-right">
                    {{ orderTaxComputed | formatCurrency }}
                  </td>
                </tr>
                <tr>
                  <td class="text-right">Rounding Adjustment</td>
                  <td class="text-right">
                    <app-text-field
                      v-model="form.roundingAdjustment"
                      type="number"
                      vid="roundingAdjustment"
                      class="cost-input"
                      single-line
                      solo
                      flat
                    >
                      <template #prepend-inner>
                        <v-btn icon @click="roundingAdjust(true)">
                          <v-icon small>mdi-minus</v-icon>
                        </v-btn>
                      </template>
                      <template #append>
                        <v-btn icon @click="roundingAdjust(false)">
                          <v-icon small>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                    </app-text-field>
                  </td>
                </tr>
                <tr>
                  <td class="text-right">Order Total (Inc)</td>
                  <td class="text-right">{{ orderTotalComputed | formatCurrency }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { computed, defineComponent, reactive, ref, toRef, useStore } from '@nuxtjs/composition-api'
import numeral from 'numeral'
import { v4 as uuid4 } from 'uuid'
import _ from 'lodash'
import AppTextField from '~/components/atoms/global/AppTextField'
import AgGirdTable from '~/components/global/molecules/AgGirdTable'

const createNewInvoiceItem = (overrideIndex, overrideAppliedTaxId) => ({
  _id: uuid4(),
  orderItem: {
    _id: uuid4(),
    index: overrideIndex || 1,
    description: null,
    type: 0,
    qty: 0,
    unitCost: 0,
    uom: 'Ea',
    totalCost: 0,
    appliedTaxId: overrideAppliedTaxId || null,
    actualCategory: null
  },
  qty: 0,
  unitCost: 0,
  totalCost: 0
})

const calculateItemTotalCost = (quantity, unitCost, taxPercent) => {
  const qty = parseFloat(quantity)
  const unit = parseFloat(unitCost)
  const percent = parseFloat(taxPercent)
  if (isNaN(qty) || isNaN(unit) || isNaN(percent)) return null

  const total = qty * unit
  const tax = total * (percent / 100.0)
  return total + tax
}

export default defineComponent({
  name: 'InvoiceItem',
  components: {
    AppTextField,
    AgGirdTable
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
        return emit('input', val)
      }
    })
    const store = useStore()
    const agGridTable = ref(null)
    const taxProfile = computed(() => {
      const cleanedTaxProfile = _.clone((store.state.job.jobDetails || {}).taxProfile || {})
      cleanedTaxProfile.taxItems = _.filter(cleanedTaxProfile.taxItems || [], (item) => {
        return (item.typeName || '').toUpperCase() === 'EXPENSE'
      })
      return cleanedTaxProfile
    })
    const state = reactive({
      columns: [
        {
          headerName: 'Item description',
          editable: (params) => {
            // auto generated item is not able to edit this field
            return typeof params.data.orderItem._id === 'string'
          },
          valueGetter: (params) => {
            return params.data.orderItem.description
          },
          valueSetter: (params) => {
            params.data.orderItem.description = params.newValue
            return true
          }
        },
        {
          headerName: 'Type',
          editable: (params) => {
            // auto generated item is not able to edit this field
            return typeof params.data.orderItem._id === 'string'
          },
          width: 100,
          cellEditor: 'agSelectEditor',
          cellEditorParams: {
            values: store.state.job.orderMetadata.orderLineItemTypes
          },
          valueGetter: (params) => {
            return params.data.orderItem.type
          },
          valueSetter: (params) => {
            params.data.orderItem.type = params.newValue
            return true
          },
          valueFormatter: (params) => {
            const type = _.find(store.state.job.orderMetadata.orderLineItemTypes, { key: params.data.orderItem.type })
            if (!type) return params.data.orderItem.type
            return type.value
          }
        },
        {
          headerName: 'Original qty',
          editable: false,
          width: 100,
          valueGetter: (params) => {
            return params.data.orderItem.qty
          }
        },
        {
          field: 'qty',
          headerName: 'Invoice qty',
          editable: true,
          width: 90,
          valueSetter(params) {
            const floatValue = parseFloat(params.newValue)
            if (isNaN(floatValue)) return false

            params.data.qty = floatValue
            const totalCost = calculateItemTotalCost(params.data.qty, params.data.unitCost, 0)
            if (typeof totalCost === 'number') {
              params.data.totalCost = totalCost
            }
            return true
          }
        },
        {
          field: 'unitCost',
          headerName: 'Unit cost',
          editable: true,
          width: 100,
          valueFormatter: (params) => {
            const amount = parseFloat(params.value || '0.0')
            return numeral(amount).format('$0,0.00')
          },
          valueSetter(params) {
            const floatValue = parseFloat(params.newValue)
            if (isNaN(floatValue)) return false

            params.data.unitCost = floatValue
            const totalCost = calculateItemTotalCost(params.data.qty, params.data.unitCost, 0)
            if (typeof totalCost === 'number') {
              params.data.totalCost = totalCost
            }
            return true
          }
        },
        {
          field: 'totalCost',
          headerName: 'Total cost',
          editable: false,
          width: 100,
          valueFormatter: (params) => {
            const amount = parseFloat(params.value || '0.0')
            return numeral(amount).format('$0,0.00')
          }
        },
        {
          headerName: 'GST',
          editable: false,
          minWidth: 86,
          maxWidth: 86,
          cellRendererFramework: 'agTaxEditor',
          cellRendererParams: {
            value: (params) => params.data.orderItem.appliedTaxId,
            taxProfile: taxProfile.value || {},
            onChange: (params, newValue) => {
              params.data.orderItem.appliedTaxId = newValue
              params.node.data.orderItem.appliedTaxId = newValue
            }
          },
          valueGetter: (params) => params.data.orderItem.appliedTaxId
        },
        {
          headerName: 'Actual category',
          editable: true,
          width: 100,
          valueGetter: (params) => {
            return params.data.orderItem.actualCategory
          },
          valueSetter: (params) => {
            params.data.orderItem.actualCategory = params.newValue
            return true
          }
        },
        {
          headerName: '',
          field: '_actions',
          width: 40,
          cellRenderer: 'agActionCellRenderer',
          cellRendererParams: (params) => {
            // user only interact with items which creating manually
            // auto generated items is not able to delete
            if (params.data.id !== '_BOTTOM_DATA' && params.data.orderItem._id) {
              const actions = [
                {
                  iconName: 'mdi-trash-can-outline',
                  tintColor: 'error',
                  action: () => {
                    const currentItems = _.cloneDeep(form.value.invoiceItems || [])
                    form.value.invoiceItems = _.filter(currentItems, (item) => item._id !== params.data._id)
                  }
                }
              ]
              return { actions }
            }
          }
        }
      ]
    })

    const subTotalComputed = computed(() => {
      let totalAmount = 0.0
      _.forEach(
        _.filter(
          _.map(form.value.invoiceItems, (invoiceItem) => {
            return parseFloat(invoiceItem.totalCost || '0.0')
          }),
          (amountItem) => amountItem >= 0.0
        ),
        (amountItem) => {
          totalAmount += amountItem
        }
      )
      return totalAmount
    })

    const orderTaxComputed = computed(() => {
      let totalTax = 0.0
      _.forEach(
        _.filter(
          _.map(form.value.invoiceItems, (invoiceItem) => {
            const itemCost = parseFloat(invoiceItem.totalCost || '0.0')
            const tax = _.find(
              taxProfile.value.taxItems || [],
              (item) => item.id === invoiceItem.orderItem.appliedTaxId
            )
            const itemTax = parseFloat((tax || {}).rate || '0.0')
            if (itemCost >= 0.0 && itemTax >= 0.0) {
              return itemCost * (itemTax / 100.0)
            }
            return -1
          }),
          (amountItem) => amountItem >= 0.0
        ),
        (amountItem) => {
          totalTax += amountItem
        }
      )
      return totalTax
    })

    const orderTotalComputed = computed(() => {
      let totalInc = 0.0
      totalInc += subTotalComputed.value || 0.0
      totalInc += orderTaxComputed.value || 0.0

      const rounding = parseFloat(form.value.roundingAdjustment)
      if (!isNaN(rounding)) {
        totalInc += rounding
      }

      const deliveryFee = parseFloat(form.value.deliveryFee || '0.0')
      if (!isNaN(deliveryFee) && deliveryFee >= 0) {
        totalInc += deliveryFee
      }
      return totalInc
    })

    const onAddNewItem = () => {
      const currentItems = _.cloneDeep(form.value.invoiceItems || [])
      form.value.invoiceItems = [...currentItems, createNewInvoiceItem(currentItems.length + 1)]
    }

    return {
      form,
      taxProfile,
      agGridTable,
      columns: toRef(state, 'columns'),
      subTotalComputed,
      orderTaxComputed,
      orderTotalComputed,
      onAddNewItem
    }
  },
  methods: {
    roundingAdjust(isMinus) {
      if (typeof isMinus !== 'boolean') return
      const floatValue = parseFloat(this.form.roundingAdjustment)
      if (isNaN(floatValue)) return
      if (isMinus) {
        this.form.roundingAdjustment = (floatValue - 0.01).toFixed(2)
        return
      }
      this.form.roundingAdjustment = (floatValue + 0.01).toFixed(2)
    }
  }
})
</script>

<style lang="scss">
.cost-input {
  .v-input__control {
    .v-input__slot {
      min-height: 32px;

      .v-text-field__slot {
        input {
          text-align: right;
          -moz-appearance: textfield;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          margin: 0;
          -webkit-appearance: none;
        }
      }
    }
  }
}
</style>
