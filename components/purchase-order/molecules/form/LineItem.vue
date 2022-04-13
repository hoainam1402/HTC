<template>
  <v-card>
    <v-card-title>
      <div>
        <span>Total (Inc):</span>
        <strong>{{ orderTotalComputed | formatCurrency }}</strong>
        <span class="text--secondary" style="font-size: 16px">
          <span>/</span>
          <span>{{ itemsCountComputed }}</span>
        </span>
      </div>
      <v-spacer />
      <v-btn v-if="[0].includes(form.status)" color="primary" @click="onAddNewItem">
        <v-icon>mdi-plus</v-icon>
        <span>Add Item</span>
      </v-btn>
    </v-card-title>
    <v-card-text class="pa-1">
      <v-row dense>
        <v-col cols="12">
          <ag-gird-table
            ref="agGridTable"
            :columns="columns"
            :rows="form.lineItems"
            :on-cell-update="onItemUpdated"
            single-click-edit
          />
        </v-col>
      </v-row>
      <v-divider />
      <v-row dense>
        <v-col cols="12" md="6">
          <v-checkbox v-model="form.isShowCostsWhenPrinting" label="Show costs when printing" hide-details dense />
        </v-col>
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
                <tr v-if="!form.pickUp">
                  <td class="d-flex justify-end align-center text-right">
                    <span class="mr-1">Delivery/Freight</span>
                    <tax-profile v-model="form.deliveryTaxId" :tax-profile="taxProfile" />
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
import { v4 as uuid } from 'uuid'
import _, { maxBy } from 'lodash'
import AppTextField from '~/components/atoms/global/AppTextField'
import AgGirdTable from '~/components/global/molecules/AgGirdTable'
import TaxProfile from '~/components/job/atoms/TaxProfile'

export default defineComponent({
  name: 'PurchaseOrderLineItem',
  components: {
    AppTextField,
    AgGirdTable,
    TaxProfile
  },
  props: {
    value: {
      type: Object,
      required: true
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
      const result = store.state.job.jobDetails.taxProfile

      return {
        ...result,
        taxItems: result.taxItems.filter((e) => e.type === 1)
      }
    })
    const state = reactive({
      columns: [
        {
          headerName: 'Description',
          field: 'description',
          editable: true,
          cellRendererFramework: 'agTextRenderer',
          cellRendererParams: {
            vid: ['lineItems', 'Description']
          },
          cellEditor: 'agTextFieldEditor',
          cellEditorParams: {
            type: 'text'
          }
        },
        {
          headerName: 'Notes',
          field: 'note',
          width: 120,
          editable: true,
          cellRendererFramework: 'agTextRenderer',
          cellRendererParams: {
            vid: ['lineItems', 'note']
          },
          cellEditor: 'agTextFieldEditor',
          cellEditorParams: {
            type: 'text'
          }
        },
        {
          headerName: 'Type',
          field: 'type',
          width: 100,
          editable: true,
          cellEditor: 'agSelectEditor',
          cellEditorParams: {
            values: store.state.job.orderMetadata.orderLineItemTypes
          },
          valueFormatter: (params) => {
            const type = _.find(store.state.job.orderMetadata.orderLineItemTypes, { key: params.data.type })

            return type.value
          }
        },
        {
          headerName: 'Qty',
          field: 'qty',
          width: 80,
          editable: true,
          cellRendererFramework: 'agTextRenderer',
          cellRendererParams: {
            vid: ['lineItems', 'qty']
          },
          cellEditor: 'agTextFieldEditor',
          cellEditorParams: {
            type: 'number'
          }
        },
        {
          headerName: 'Unit cost',
          field: 'unitCost',
          width: 100,
          editable: true,
          cellRendererFramework: 'agTextRenderer',
          cellRendererParams: {
            vid: ['lineItems', 'unitCost']
          },
          cellEditor: 'agTextFieldEditor',
          cellEditorParams: {
            type: 'number'
          },
          valueFormatter: (params) => {
            const amount = parseFloat(params.value || '0.0')

            return numeral(amount).format('$0,0.00')
          }
        },
        {
          headerName: 'UOM',
          field: 'uom',
          width: 80,
          editable: true,
          cellRendererFramework: 'agTextRenderer',
          cellRendererParams: {
            vid: ['lineItems', 'uom']
          },
          cellEditor: 'agSelectEditor',
          cellEditorParams: {
            values: store.state.job.orderMetadata.uoms
          }
        },
        {
          headerName: 'Total cost',
          field: 'totalCost',
          width: 100,
          editable: false,
          valueFormatter: (params) => {
            const amount = parseFloat(params.value || '0.0')

            return numeral(amount).format('$0,0.00')
          }
        },
        {
          headerName: 'GST',
          field: 'appliedTaxId',
          width: 70,
          cellRendererFramework: 'agTaxEditor',
          cellRendererParams: {
            taxProfile: taxProfile.value
          }
        },
        {
          headerName: 'Category',
          field: 'actualCategory',
          width: 120,
          editable: true,
          cellRendererFramework: 'agTextRenderer',
          cellRendererParams: {
            vid: ['lineItems', 'actualCategory']
          },
          cellEditor: 'agTextFieldEditor',
          cellEditorParams: {
            type: 'text'
          }
        },
        {
          headerName: '',
          field: '_actions',
          width: 40,
          cellRenderer: 'agActionCellRenderer',
          cellRendererParams: (params) => {
            if ([0].includes(form.value.status)) {
              const actions = [
                {
                  iconName: 'mdi-trash-can-outline',
                  tintColor: 'error',
                  action: () => {
                    onDeleteItem(params.data)
                  }
                }
              ]
              return { actions }
            }
          }
        }
      ]
    })

    const generatePOItem = () => {
      return {
        _id: uuid(),
        index: form.value.lineItems.length ? maxBy(form.value.lineItems, 'index').index++ : 1,
        appliedTaxId: '',
        description: '',
        note: '',
        type: 0,
        qty: 1,
        unitCost: '0.0',
        totalCost: '0.0',
        uom: 'Ea',
        actualCategory: ''
      }
    }

    const itemsCountComputed = computed(() => {
      const count = form.value.lineItems.length
      if (count > 1) {
        return `${count} items`
      }
      return `${count} item`
    })

    const subTotalComputed = computed(() => {
      let totalAmount = 0.0
      _.forEach(
        _.filter(
          _.map(form.value.lineItems, (detailItem) => {
            return parseFloat(detailItem.totalCost || '0.0')
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
          _.map(form.value.lineItems, (detailItem) => {
            const itemCost = parseFloat(detailItem.totalCost || '0.0')
            const tax = _.find(taxProfile.value.taxItems || [], (item) => item.id === detailItem.appliedTaxId)
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
      const deliveryFee = parseFloat(form.value.deliveryFee || '0.0')
      if (deliveryFee >= 0 && !form.pickUp) {
        const deliveryTax = _.find(taxProfile.value.taxItems || [], (item) => item.id === form.value.deliveryTaxId)
        totalInc += deliveryFee
        if (deliveryTax) {
          totalInc += deliveryFee * ((deliveryTax || {}).rate / 100.0)
        }
      }
      return totalInc
    })

    const onAddNewItem = () => {
      const gridApi = agGridTable.value.getGridApi()
      if (gridApi) gridApi.stopEditing()
      if (gridApi) {
        form.value.lineItems.push(generatePOItem())
        setTimeout(() => {
          gridApi.startEditingCell({
            rowIndex: form.value.lineItems.length - 1,
            colKey: 'description'
          })
        }, 300)
      }
    }

    const onItemUpdated = (params, next) => {
      const computedData = _.cloneDeep(params.data)
      const qty = parseFloat(computedData.qty || '0')
      const unitCost = parseFloat(computedData.unitCost || '0.0')
      if (qty >= 0.0 && unitCost >= 0.0) {
        computedData.totalCost = qty * unitCost
      } else {
        computedData.totalCost = '0.0'
      }
      next(computedData)
    }

    const onDeleteItem = (params) => {
      const id = params.id ? 'id' : '_id'
      _.remove(form.value.lineItems, {
        [id]: params[id]
      })
      const gridApi = agGridTable.value.getGridApi()
      gridApi.applyTransaction({
        remove: [
          {
            [id]: params[id]
          }
        ]
      })
    }

    _.debounce(() => {
      onAddNewItem()
    }, 300)

    return {
      form,
      taxProfile,
      agGridTable,
      columns: toRef(state, 'columns'),
      itemsCountComputed,
      subTotalComputed,
      orderTaxComputed,
      orderTotalComputed,
      onAddNewItem,
      onItemUpdated
    }
  }
})
</script>

<style lang="scss" scoped>
.cost-input {
  .v-input__slot {
    min-height: 32px;
  }
}
</style>
