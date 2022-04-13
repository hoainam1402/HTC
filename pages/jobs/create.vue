<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">{{ $t('job.action.createJob') }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
    </div>
    <app-form v-slot="{ handleSubmit }">
      <v-card>
        <v-card-title>{{ $t('job.model.jobInformation') }}</v-card-title>
        <v-card-text>
          <job-create-form v-model="model" :tax-profile="taxProfile" />
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
import Breadcrumbs from '~/components/global/atoms/Breadcrumbs'
import AppForm from '~/components/atoms/global/AppForm'
import JobCreateForm from '~/components/job/organisms/JobCreateForm'

export default defineComponent({
  components: {
    Breadcrumbs,
    AppForm,
    JobCreateForm
  },
  setup(_, { emit, root }) {
    const initialState = () => ({
      model: {
        description: null,
        buildingType: null,
        customerId: null,
        customerName: null,
        expectedStart: $moment().utc().add('d', 2).format('YYYY-MM-DD'),
        invoiceMethod: 0,
        appliedTaxId: null,
        contractTotal: null,
        markupPercent: 10,
        costPlusPercent: null,
        createDefaultTasks: true,
        createDefaultInvoices: false
      }
    })
    const { $api, $snackbar, $moment } = useContext()
    const router = useRouter()
    const loading = ref(false)
    const state = reactive(initialState())

    const submit = () => {
      loading.value = true
      $api.job
        .createJob(state.model)
        .then(() => {
          emit('success')
          $snackbar({
            message: root.$t('job.message.successCreate'),
            color: 'success'
          })
          router.push({ name: 'jobs' })
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
  },
  async asyncData({ $api, store }) {
    const { result } = await $api.job.getTaxProfiles()
    await store.dispatch('job/getEnums')

    return {
      taxProfile: {
        ...result,
        taxItems: result.taxItems.filter((e) => e.type === 0)
      }
    }
  }
})
</script>
