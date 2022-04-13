<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">{{ $t('contact.action.createContact') }}</div>
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
import ContactForm from '~/components/contact/organisms/ContactForm.vue'

export default defineComponent({
  components: {
    Breadcrumbs,
    AppForm,
    ContactForm
  },
  setup(_, { emit, root }) {
    const initialState = () => ({
      model: {
        type: null,
        contactName: '',
        address: {
          street: '',
          ward: '',
          province: '',
          postalCode: ''
        },
        businessName: '',
        emailAddress: '',
        workPhone: '',
        mobilePhone: ''
      }
    })
    const { $api, $snackbar } = useContext()
    const router = useRouter()
    const loading = ref(false)
    const state = reactive(initialState())

    const submit = () => {
      loading.value = true
      $api.contact
        .createContact(state.model)
        .then(() => {
          emit('success')
          $snackbar({
            message: root.$t('contact.message.successCreate'),
            color: 'success'
          })
          router.push({ name: 'contacts' })
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
