<template>
  <v-row v-if="form.customer" dense>
    <v-col cols="12">
      <app-text-field v-model="form.customer.name" :label="$t('client.model.name')" vid="customer.name" />
    </v-col>
    <v-col cols="12" sm="6">
      <app-text-field
        v-model="form.customer.phoneNumber"
        :label="$t('common.model.phone')"
        vid="customer.phoneNumber"
        rules="phone|max:16"
        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <app-text-field
        v-model="form.customer.mobilePhone"
        :label="$t('common.model.workPhone')"
        vid="customer.mobilePhone"
        rules="phone|max:16"
        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
      />
    </v-col>
    <v-col cols="12">
      <app-text-field
        v-model="form.customer.emailAddress"
        :label="$t('common.model.email')"
        vid="customer.emailAddress"
      />
    </v-col>
    <v-col cols="12">
      <app-label :label="$t('client.model.clientAddress')" style="line-height: 1.8" />
      <v-row dense>
        <v-col cols="12">
          <app-text-field
            v-model="form.customer.address.street"
            :label="$t('common.model.address')"
            vid="customer.address.street"
          />
        </v-col>
        <v-col cols="12">
          <app-text-field
            v-model="form.customer.address.ward"
            :label="$t('common.model.ward')"
            vid="customer.address.ward"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <select-state
            v-model="form.customer.address.state"
            :label="$t('common.model.state')"
            vid="customer.address.state"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <app-text-field
            v-model="form.customer.address.postalCode"
            :label="$t('common.model.postalCode')"
            vid="customer.address.postalCode"
          />
        </v-col>
        <v-col v-if="form.lead" cols="12" sm="4">
          <app-text-field
            v-model="form.lead.address.codeNumber"
            :label="$t('common.model.codeNumber')"
            vid="customer.address.codeNumber"
            disabled
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import AppTextField from '~/components/atoms/global/AppTextField'
import AppLabel from '~/components/atoms/global/AppLabel'
import SelectState from '~/components/common/molecules/SelectState'

export default defineComponent({
  components: {
    AppLabel,
    AppTextField,
    SelectState
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
  }
})
</script>
