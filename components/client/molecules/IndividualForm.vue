<template>
  <v-row dense>
    <template v-if="!fromLead">
      <v-col cols="12" sm="6">
        <app-text-field
          v-model="form.firstName"
          :label="$t('common.model.firstName')"
          vid="firstName"
          rules="required|alpha"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <app-text-field
          v-model="form.lastName"
          :label="$t('common.model.lastName')"
          vid="lastName"
          rules="required|alpha"
        />
      </v-col>
    </template>
    <v-col cols="12" sm="6">
      <app-text-field
        v-model="form.mobilePhone"
        :label="$t('common.model.mobilePhone')"
        vid="mobileNumber"
        rules="required|phone|max:16"
        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <app-text-field
        v-model="form.phoneNumber"
        :label="$t('common.model.phone')"
        vid="phoneNumber"
        rules="phone|max:16"
        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <app-text-field v-model="form.emailAddress" :label="$t('common.model.email')" vid="emailAddress" rules="email" />
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import AppTextField from '~/components/atoms/global/AppTextField.vue'

export default defineComponent({
  name: 'IndividualForm',
  components: {
    AppTextField
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    fromLead: {
      type: Boolean,
      default: false
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
