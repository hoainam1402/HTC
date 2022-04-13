<template>
  <v-card class="my-2">
    <v-card-title>{{ $t('profile.changePassword') }}</v-card-title>
    <v-card-text>
      <molecules-form v-slot="{ handleSubmit }" ref="form">
        <v-row>
          <v-col cols="12" md="4">
            <molecules-form-item v-slot="{ errors }" vid="currentPassword" label="Current password" rules="required">
              <v-text-field
                v-model="user.currentPassword"
                :error-messages="errors"
                :label="$t('profile.currentPassword')"
                type="password"
              />
            </molecules-form-item>
          </v-col>

          <v-col cols="12" md="4">
            <molecules-form-item v-slot="{ errors }" vid="newPassword" label="New password" rules="required">
              <v-text-field
                v-model="user.newPassword"
                :error-messages="errors"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                :label="$t('profile.newPassword')"
                @click:append="show = !show"
              />
            </molecules-form-item>
          </v-col>

          <v-col cols="12" md="4">
            <molecules-form-item
              v-slot="{ errors }"
              label="Confirm new password"
              rules="required|confirmed:newPassword"
            >
              <v-text-field
                v-model="passwordConfirmation"
                :error-messages="errors"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                :label="$t('profile.confirmNewPassword')"
                @click:append="show = !show"
              />
            </molecules-form-item>
          </v-col>
        </v-row>

        <div class="d-flex">
          <v-spacer />
          <v-btn :loading="loading" color="primary" @click="handleSubmit(submit)">Save</v-btn>
        </div>
      </molecules-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup(props, { root }) {
    const { $api, $snackbar } = useContext()
    const form = ref(null)
    const show = ref(false)
    const loading = ref(false)
    const passwordConfirmation = ref('')
    const model = reactive({
      user: {
        currentPassword: '',
        newPassword: ''
      }
    })

    const submit = () => {
      loading.value = true
      $api.profile
        .changePassword(model.user)
        .then(() => {
          $snackbar({
            message: root.$t('profile.successPassword'),
            color: 'success'
          })
        })
        .catch(() => {
          this.$snackbar({
            message: this.$t('common.message.somethingWentWrong'),
            color: 'error'
          })
        })
        .finally(() => {
          loading.value = false
        })
    }

    return {
      form,
      show,
      loading,
      passwordConfirmation,
      user: toRef(model, 'user'),
      submit
    }
  }
})
</script>
