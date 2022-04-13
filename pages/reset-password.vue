<template>
  <v-card class="text-center pa-1">
    <v-card-title class="justify-center display-1 mb-2">{{ $t('reset.title') }}</v-card-title>
    <div class="overline">{{ status }}</div>

    <v-card-text>
      <molecules-form v-slot="{ handleSubmit }" ref="form">
        <molecules-form-item v-slot="{ errors, valid }" :label="$t('reset.resetCode')" rules="required">
          <v-text-field
            v-model="data.resetCode"
            :error-messages="errors"
            :success="valid"
            :label="$t('reset.resetCode')"
            outlined
            @keyup.enter="submit"
            @change="resetErrors"
          />
        </molecules-form-item>

        <molecules-form-item
          v-slot="{ errors, valid }"
          vid="password"
          :label="$t('reset.newPassword')"
          rules="required"
        >
          <v-text-field
            v-model="data.password"
            :error-messages="errors"
            :success="valid"
            :type="showPassword ? 'text' : 'password'"
            :label="$t('reset.newPassword')"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            outlined
            @change="resetErrors"
            @keyup.enter="submit"
            @click:append="showPassword = !showPassword"
          />
        </molecules-form-item>

        <molecules-form-item
          v-slot="{ errors, valid }"
          :label="$t('reset.confirmPassword')"
          rules="required|confirmed:password"
        >
          <v-text-field
            v-model="passwordConfirmation"
            :error-messages="errors"
            :success="valid"
            :type="showPassword ? 'text' : 'password'"
            :label="$t('reset.confirmPassword')"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            outlined
            @click:append="showPassword = !showPassword"
          />
        </molecules-form-item>

        <v-btn :loading="loading" color="primary" block x-large @click="handleSubmit(submit)">
          {{ $t('reset.button') }}
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
      data: {
        resetCode: '',
        password: '',
        c: this.$route.query.c
      },
      passwordConfirmation: '',
      status: 'Resetting password',
      errorProvider: false,
      errorProviderMessages: '',
      showPassword: false
    }
  },
  methods: {
    submit() {
      this.loading = true
      this.resetPassword(this.data)
    },
    async resetPassword(data) {
      try {
        await this.$axios.$post('/api/services/app/Account/ResetPassword', data)
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
