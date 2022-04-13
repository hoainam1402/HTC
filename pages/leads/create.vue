<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">{{ $t('lead.action.createLead') }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
    </div>
    <app-form v-slot="{ handleSubmit }">
      <v-card>
        <v-card-title>{{ $t('lead.model.leadInformation') }}</v-card-title>
        <v-card-text>
          <lead-create-form v-model="model" />
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
import { LEAD_STAGE_NEW } from '@/utils/constants'
import Breadcrumbs from '~/components/global/atoms/Breadcrumbs'
import AppForm from '~/components/atoms/global/AppForm'
import LeadCreateForm from '~/components/lead/organisms/LeadCreateForm'

export default defineComponent({
  components: {
    Breadcrumbs,
    AppForm,
    LeadCreateForm
  },
  setup(_, { emit, root }) {
    const initialState = () => ({
      model: {
        type: 0,
        customerId: null,
        customer: null,
        source: 1,
        stage: LEAD_STAGE_NEW,
        taskTemplateId: null,
        budget: null,
        startDate: null,
        address: {
          street: null,
          ward: null,
          province: null,
          postalCode: null,
          codeNumber: btoa(Math.random().toString()).substr(10, 5).toUpperCase()
        }
      }
    })
    const { $api, $snackbar } = useContext()
    const router = useRouter()
    const loading = ref(false)
    const state = reactive(initialState())

    const submit = () => {
      loading.value = true
      $api.lead
        .createLead(state.model)
        .then(() => {
          emit('success')
          $snackbar({
            message: root.$t('lead.message.successCreate'),
            color: 'success'
          })
          router.push({ name: 'leads' })
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
