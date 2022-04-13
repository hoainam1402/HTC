<template>
  <v-row dense>
    <v-col cols="12">
      <v-card flat>
        <v-card-text class="py-0">
          <v-row dense>
            <v-col cols="12" md="9">
              <app-text-field v-model="form.description" label="Description (internal use only)" vid="description" />
            </v-col>
            <v-col cols="12" md="3">
              <app-select v-model="form.status" :items="orderStatuses" label="Status" vid="status" />
            </v-col>
            <v-col cols="12">
              <app-textarea v-model="form.instruction" label="Instructions" vid="instruction" rows="3" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card flat>
        <v-card-title class="py-0">Supplier</v-card-title>
        <v-card-text class="py-0">
          <v-row dense>
            <v-col cols="12">
              <contact-autocomplete
                v-model="form.supplierId"
                :default-params="{ type: 'supplier' }"
                label="Please select or enter name"
                item-text="contactName"
                vid="supplierId"
                rules="required"
              />
            </v-col>
            <v-col cols="12">
              <app-text-field v-model="form.attentionName" label="Attention" vid="attentionName" />
            </v-col>
            <v-col cols="12">
              <app-date-picker v-model="form.dateRequired" label="Date required" vid="dateRequired" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card flat>
        <v-card-title class="py-0">
          Deliver To
          <v-spacer />
          <app-checkbox v-model="form.pickUp" label="Pick-up" />
        </v-card-title>
        <v-card-text class="py-0">
          <v-row dense>
            <v-col cols="12">
              <app-text-field
                v-model="form.deliveryAddress.street"
                label="Enter an address"
                vid="deliveryAddress.street"
                :disabled="form.pickUp"
              />
            </v-col>
            <v-col cols="12">
              <app-text-field
                v-model="form.deliveryAddress.province"
                label="City / Town"
                vid="deliveryAddress.province"
                :disabled="form.pickUp"
              />
            </v-col>
            <v-col cols="12" md="6">
              <app-text-field
                v-model="form.deliveryAddress.state"
                label="State"
                vid="deliveryAddress.state"
                :disabled="form.pickUp"
              />
            </v-col>
            <v-col cols="12" md="6">
              <app-text-field
                v-model="form.deliveryAddress.postalCode"
                label="Postal code"
                vid="deliveryAddress.postalCode"
                :disabled="form.pickUp"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <line-item v-model="form" />
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import AppTextField from '~/components/atoms/global/AppTextField'
import AppTextarea from '~/components/atoms/global/AppTextarea'
import AppCheckbox from '~/components/atoms/global/AppCheckbox'
import AppSelect from '~/components/atoms/global/AppSelect'
import AppDatePicker from '~/components/atoms/global/AppDatePicker'
import ContactAutocomplete from '~/components/contact/organisms/ContactAutocomplete'
import LineItem from '~/components/purchase-order/molecules/form/LineItem'

export default defineComponent({
  components: {
    AppTextField,
    AppTextarea,
    AppCheckbox,
    AppSelect,
    AppDatePicker,
    ContactAutocomplete,
    LineItem
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
        emit('input', val)
      }
    })

    return {
      form
    }
  },
  computed: {
    orderStatuses() {
      return this.$store.state.job.orderMetadata.orderStatuses
    }
  }
})
</script>
