<template>
  <v-card class="pa-1">
    <v-card-title class="justify-center display-1 mb-2">Welcome</v-card-title>
    <v-card-subtitle>Sign in to your account</v-card-subtitle>

    <v-card-text>
      <molecules-form v-slot="{ handleSubmit }" ref="form">
        <molecules-form-item v-slot="{ errors, valid }" :label="$t('login.usernameOrEmail')" rules="required">
          <v-text-field
            v-model="userNameOrEmailAddress"
            :error-messages="errors"
            :success="valid"
            :label="$t('login.usernameOrEmail')"
            class="text-left"
            outlined
            autofocus
            @keyup.enter="submit"
            @change="resetErrors"
          />
        </molecules-form-item>

        <molecules-form-item v-slot="{ errors, valid }" :label="$t('login.password')" rules="required">
          <v-text-field
            v-model="password"
            :error-messages="errors"
            :success="valid"
            class="text-left"
            :type="showPassword ? 'text' : 'password'"
            :label="$t('login.password')"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            outlined
            @change="resetErrors"
            @keyup.enter="submit"
            @click:append="showPassword = !showPassword"
          />
        </molecules-form-item>

        <v-btn :loading="loading" color="primary" block x-large @click="handleSubmit(submit)">
          {{ $t('login.button') }}
        </v-btn>
      </molecules-form>

      <div v-if="errorProvider" class="error--text mt-2">{{ errorProviderMessages }}</div>

      <div class="mt-2">
        <nuxt-link :to="{ name: 'forgot-password' }">
          {{ $t('login.forgot') }}
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
      userNameOrEmailAddress: '',
      password: '',
      errorProvider: false,
      errorProviderMessages: '',
      showPassword: false
    }
  },
  methods: {
    submit() {
      this.loading = true
      this.signIn(this.userNameOrEmailAddress, this.password)
    },
    async signIn(userNameOrEmailAddress, password) {
      try {
        await this.$auth.loginWith('local', { data: { userNameOrEmailAddress, password } })
        this.$router.push({ name: 'workspace' })
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

<style scoped>
* >>> .text-left input {
  text-align: left !important;
}
</style>
