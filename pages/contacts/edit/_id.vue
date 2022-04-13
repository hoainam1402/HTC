<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">{{ $t('contact.action.updateContact') }} - {{ model.contactName }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
    </div>
    <app-form v-slot="{ handleSubmit }">
      <v-card>
        <v-card-title>{{ $t('contact.model.contactInformation') }}</v-card-title>
        <v-card-text>
          <contact-form v-model="model" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="loading" class="px-2 mr-1" text @click="$router.go(-1)">
            {{ $t('common.action.discard') }}
          </v-btn>
          <v-btn :loading="loading" color="primary" class="px-2" @click="handleSubmit(submit)">
            {{ $t('common.action.update') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </app-form>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import Breadcrumbs from '~/components/global/atoms/Breadcrumbs.vue'
import AppForm from '~/components/atoms/global/AppForm.vue'
import ContactForm from '~/components/contact/organisms/ContactForm.vue'
import { ADDRESS } from '~/utils/constants'

export default defineComponent({
  components: {
    Breadcrumbs,
    AppForm,
    ContactForm
  },
  async asyncData({ $api, params }) {
    const { result } = await $api.contact.getContact(params.id)

    if (result.address === null) {
      result.address = ADDRESS
    }

    return {
      model: result
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    submit() {
      this.loading = true
      this.$api.contact
        .updateContact(this.model)
        .then(() => {
          this.$snackbar({
            message: this.$t('contact.message.successUpdate'),
            color: 'success'
          })
          this.$router.push({ name: 'contacts' })
        })
        .catch(() => {
          this.$snackbar({
            message: this.$t('common.message.somethingWentWrong'),
            color: 'error'
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
})
</script>
