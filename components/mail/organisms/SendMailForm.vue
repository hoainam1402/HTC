<template>
  <v-row dense>
    <v-col cols="12">
      <contact-autocomplete
        v-model="form.recipientIds"
        :default-params="{ type: 'supplier' }"
        label="To..."
        placeholder="Please select or enter name"
        item-text="contactName"
        vid="recipientIds"
        rules="required"
        multiple
      />
    </v-col>
    <v-col cols="12">
      <app-checkbox v-model="form.sendMeACopy" label="Send me a copy" vid="sendMeACopy" />
    </v-col>
    <v-col cols="12">
      <app-text-field v-model="form.subject" label="Subject" vid="subject " rules="required" />
    </v-col>
    <v-col cols="12">
      <app-textarea v-model="form.body" label="Body" vid="body" rules="required" rows="5" />
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import AppTextField from '~/components/atoms/global/AppTextField'
import AppTextarea from '~/components/atoms/global/AppTextarea'
import AppCheckbox from '~/components/atoms/global/AppCheckbox'
import ContactAutocomplete from '~/components/contact/organisms/ContactAutocomplete'

export default defineComponent({
  name: 'SendMailForm',
  components: {
    AppTextField,
    AppTextarea,
    AppCheckbox,
    ContactAutocomplete
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
        emit('input', val)
      }
    })

    return {
      form
    }
  }
})
</script>
