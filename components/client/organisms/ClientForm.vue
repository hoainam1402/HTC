<template>
  <v-row dense>
    <v-col cols="12" sm="6">
      <select-client-type
        v-model="form.customerType"
        label="Client type"
        vid="customerType"
        :rules="`required|max:30|regex:${regex}`"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <app-text-field v-model="form.name" label="Name" vid="name" :rules="`required|max:30|regex:${regex}`" />
    </v-col>
    <v-col cols="12">
      <app-label :label="$t('contact.model.address')" />
      <v-row dense>
        <v-col cols="12">
          <app-text-field
            v-model="form.address.street"
            :label="$t('common.model.address')"
            vid="address.street"
            rules="required|max:255"
          />
        </v-col>
        <v-col cols="12">
          <app-text-field
            v-model="form.address.ward"
            :label="$t('common.model.ward')"
            vid="address.ward"
            :rules="`required|max:30|regex:${regex}`"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <select-state
            v-model="form.address.state"
            :label="$t('common.model.state')"
            vid="address.state"
            rules="required"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <app-text-field
            v-model="form.address.postalCode"
            :label="$t('common.model.postalCode')"
            vid="address.postalCode"
            rules="max:30"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <app-label :label="$t('contact.model.contactInformation')" />
      <v-row dense>
        <v-col cols="12" sm="6">
          <app-text-field
            v-model="form.emailAddress"
            :label="$t('common.model.email')"
            vid="emailAddress"
            rules="email"
          />
        </v-col>
        <v-col cols="12" sm="3">
          <app-text-field
            v-model="form.phoneNumber"
            :label="$t('common.model.phone')"
            vid="phoneNumber"
            rules="phone|max:16"
            onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          />
        </v-col>
        <v-col cols="12" sm="3">
          <app-text-field
            v-model="form.mobilePhone"
            :label="$t('common.model.mobile')"
            vid="mobilePhone"
            rules="phone|max:16"
            onkeypress="return event.charCode >= 48 && event.charCode <= 57"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import AppLabel from '~/components/atoms/global/AppLabel.vue'
import AppTextField from '~/components/atoms/global/AppTextField.vue'
import SelectClientType from '~/components/client/organisms/SelectClientType.vue'
import SelectState from '~/components/common/molecules/SelectState'
import { REGEX_INPUT } from '@/utils/constants'

export default defineComponent({
  name: 'ClientForm',
  components: {
    AppLabel,
    AppTextField,
    SelectClientType,
    SelectState
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props, { emit }) {
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })
    const editMode = computed(() => form.value.id)

    const regex = ref(REGEX_INPUT)

    return {
      form,
      editMode,
      regex
    }
  }
})
</script>
