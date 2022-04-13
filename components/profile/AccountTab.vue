<template>
  <div class="my-2">
    <v-card>
      <v-card-title>{{ $t('profile.basicInfo') }}</v-card-title>
      <v-card-text>
        <div class="d-flex flex-column flex-sm-row">
          <div>
            <v-img
              :src="form.avatar"
              max-width="90"
              max-height="90"
              aspect-ratio="1"
              class="blue-grey lighten-4 rounded elevation-3"
            />
            <v-btn class="mt-1" small>{{ $t('profile.editAvatar') }}</v-btn>
          </div>
          <div class="flex-grow-1 pt-2 pa-sm-2">
            <v-text-field v-model="form.name" :label="$t('profile.name')" hide-details></v-text-field>
            <v-text-field v-model="form.surname" :label="$t('profile.surname')" hide-details></v-text-field>
            <v-text-field v-model="form.userName" disabled :label="$t('profile.userName')" hide-details></v-text-field>
            <v-text-field v-model="form.emailAddress" disabled :label="$t('profile.email')" hide-details></v-text-field>

            <div class="mt-2">
              <v-btn v-if="!form.verified" :loading="sendLoading" @click="sendEmailActivationLink">
                <v-icon left small>mdi-email</v-icon>
                {{ $t('profile.sendVerify') }}
              </v-btn>
            </div>

            <div class="mt-2">
              <v-btn :loading="submitLoading" color="primary" @click="submit">{{ $t('profile.save') }}</v-btn>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { computed, defineComponent, ref, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const { $api, $snackbar } = useContext()
    const sendLoading = ref(false)
    const submitLoading = ref(false)
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    const sendEmailActivationLink = () => {
      sendLoading.value = true
      $api.account
        .sendEmailActivationLink({
          emailAddress: form.value.emailAddress
        })
        .then(() => {
          $snackbar({
            message: 'Success',
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
          sendLoading.value = false
        })
    }

    const submit = () => {
      submitLoading.value = true
      $api.profile
        .updateCurrentUserProfile(form.value)
        .then(() => {
          $snackbar({
            message: 'Success',
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
          submitLoading.value = false
        })
    }

    return {
      sendLoading,
      submitLoading,
      form,
      sendEmailActivationLink,
      submit
    }
  }
})
</script>
