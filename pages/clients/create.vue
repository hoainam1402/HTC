<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">{{ $t('client.action.createClient') }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
    </div>
    <app-form v-slot="{ handleSubmit }">
      <v-card>
        <v-card-title>{{ $t('client.model.clientInformation') }}</v-card-title>
        <v-card-text>
          <client-form v-model="model" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="loading" class="px-2 mr-1" text @click="$router.go(-1)">
            {{ $t('common.action.discard') }}
          </v-btn>
          <v-btn :loading="loading" color="primary" class="px-2" @click="handleSubmit(submit)">
            {{ $t('common.action.create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </app-form>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, useRouter } from '@nuxtjs/composition-api'
import Breadcrumbs from '~/components/global/atoms/Breadcrumbs.vue'
import AppForm from '~/components/atoms/global/AppForm.vue'
import ClientForm from '~/components/client/organisms/ClientForm.vue'

export default defineComponent({
  components: {
    Breadcrumbs,
    ClientForm,
    AppForm
  },
  setup(_, { emit, root }) {
    const initialState = () => ({
      model: {
        customerType: null,
        name: null,
        address: {
          street: null,
          ward: null,
          province: null,
          postalCode: null
        },
        emailAddress: null,
        phoneNumber: null,
        mobilePhone: null
      }
    })
    const { $api, $snackbar } = useContext()
    const router = useRouter()
    const loading = ref(false)
    const state = reactive(initialState())

    const submit = () => {
      loading.value = true
      $api.client
        .createClient(state.model)
        .then(() => {
          emit('success')
          $snackbar({
            message: root.$t('client.message.successCreate'),
            color: 'success'
          })
          router.push({ name: 'clients' })
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
      loading,
      model: toRef(state, 'model'),
      submit
    }
  }
})
</script>
