<template>
  <v-card class="text-center pa-1">
    <v-card-title class="justify-center display-1 mb-2">{{ $t('forgot.title') }}</v-card-title>
    <v-card-subtitle>{{ $t('forgot.subtitle') }}</v-card-subtitle>

    <v-card-text>
      <molecules-form v-slot="{ handleSubmit }" ref="form">
        <molecules-form-item v-slot="{ errors, valid }" :label="$t('forgot.emailAddress')" rules="required">
          <v-text-field
            v-model="emailAddress"
            :error-messages="errors"
            :success="valid"
            :label="$t('forgot.emailAddress')"
            outlined
            @keyup.enter="submit"
            @change="resetErrors"
          />
        </molecules-form-item>

        <v-btn :loading="loading" color="primary" block x-large @click="handleSubmit(submit)">
          {{ $t('forgot.button') }}
        </v-btn>
      </molecules-form>

      <div v-if="errorProvider" class="error--text mt-2">{{ errorProviderMessages }}</div>

      <div class="mt-2">
        <nuxt-link :to="{ name: 'login' }">
          {{ $t('forgot.back_to_login') }}
        </nuxt-link>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  layout: 'auth',
  auth: false,
  data() {
    return {
      loading: false,
      emailAddress: '',
      errorProvider: false,
      errorProviderMessages: ''
    }
  },
  methods: {
    submit() {
      this.loading = true
      this.forgotPassword(this.emailAddress)
    },
    async forgotPassword(emailAddress) {
      try {
        await this.$axios.$post('/api/services/app/Account/SendPasswordResetCode', { emailAddress })
        this.$router.push('/')
        this.loading = false
      } catch (err) {
        this.errorProvider = true
        this.errorProviderMessages = err.response?.data?.error?.message
        this.loading = false
      }
    },
    resetErrors() {
      this.errorProvider = false
      this.errorProviderMessages = ''
    }
  }
}
</script>
