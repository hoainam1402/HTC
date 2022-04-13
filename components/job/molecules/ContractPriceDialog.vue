<template>
  <v-dialog :value="dialog" max-width="400" persistent>
    <v-card>
      <v-card-title>{{ $t('job.action.updatePrice') }}</v-card-title>
      <v-card-text v-if="contractPriceForm">
        <v-row dense>
          <v-col cols="12" sm="12">
            <app-currency
              v-model="contractPriceForm.amount"
              :label="$t('job.model.contractPriceAmount')"
              vid="amount"
            />
          </v-col>
          <v-col cols="12" sm="12">
            <app-select
              v-model="contractPriceForm.appliedTaxId"
              :items="taxProfileItemsMapped"
              item-text="displayName"
              item-value="id"
              :label="$t('job.model.tax')"
              rules="required"
              vid="status"
            />
          </v-col>
          <v-col cols="12" sm="12">
            <app-text-field
              v-model="contractPriceForm.markupPercent"
              type="number"
              :label="$t('job.model.percent')"
              vid="markupPercent"
              rules="required|min_value:0|max_value:100"
              suffix="%"
            />
          </v-col>
          <v-col cols="12" sm="12">
            <table style="width: 100%">
              <tbody>
                <tr>
                  <td class="text-right pr-2">{{ $t('common.model.subtotal') }}</td>
                  <td class="text-right">{{ contractPriceForm.amount | formatCurrency }}</td>
                </tr>
                <tr>
                  <td class="text-right pr-2">{{ $t('common.model.tax') }}</td>
                  <td class="text-right">{{ taxRateComputed }}%</td>
                </tr>
                <tr>
                  <td class="text-right font-weight-bold pr-2">{{ $t('common.model.total') }}</td>
                  <td class="text-right font-weight-bold text--primary">
                    {{ contractPriceForm.totalPrice | formatCurrency }}
                  </td>
                </tr>
              </tbody>
            </table>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dismissUpdatePriceDialog(false)">{{ $t('common.action.discard') }}</v-btn>
        <v-btn color="primary" @click="dismissUpdatePriceDialog(true)">{{ $t('common.action.apply') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import _ from 'lodash'
import AppTextField from '@/components/atoms/global/AppTextField'
import AppCurrency from '@/components/atoms/global/AppCurrency'
import AppSelect from '@/components/atoms/global/AppSelect'
import { TAX_TYPE_INCOME } from '@/utils/constants'

export default defineComponent({
  components: {
    AppTextField,
    AppCurrency,
    AppSelect
  },
  props: {
    taxProfileItems: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      contractPriceForm: null
    }
  },
  computed: {
    taxProfileItemsMapped() {
      return this.taxProfileItems
        .filter((taxItem) => taxItem.type === TAX_TYPE_INCOME)
        .map((taxItem) => {
          return {
            ...taxItem,
            displayName: `[${taxItem.rate}%] ${taxItem.description} | ${taxItem.code}`
          }
        })
    },
    taxRateComputed() {
      if (!this.contractPriceForm) return 0.0
      const selectedTax = _.find(this.taxProfileItems, (item) => item.id === this.contractPriceForm.appliedTaxId)
      if (selectedTax && typeof selectedTax === 'object') {
        return parseFloat(selectedTax.rate || 0.0)
      }
      return 0.0
    }
  },
  watch: {
    contractPriceForm: {
      handler(contractPrice) {
        if (!contractPrice) return

        const amount = parseFloat(contractPrice.amount || 0.0)
        const taxRate = (this.taxRateComputed || 0.0) / 100.0
        this.contractPriceForm.totalPrice = amount + amount * taxRate
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    openDialog(contractPrice) {
      if (!contractPrice || typeof contractPrice !== 'object') return
      if (!contractPrice.appliedTaxId && typeof (contractPrice.appliedTax || {}).id === 'string') {
        contractPrice.appliedTaxId = contractPrice.appliedTax.id
      }
      this.contractPriceForm = contractPrice
      this.dialog = true
    },
    dismissUpdatePriceDialog(isSubmit) {
      if (isSubmit) {
        this.$emit('submit', this.contractPriceForm)
      }
      this.dialog = false
    }
  }
})
</script>
