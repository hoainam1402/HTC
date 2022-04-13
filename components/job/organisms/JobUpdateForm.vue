<template>
  <v-row dense>
    <v-col cols="12" sm="6">
      <v-row dense>
        <v-col cols="12" class="pt-0">
          <v-card>
            <v-card-title>{{ $t('job.action.viewDetail') }}</v-card-title>
            <v-card-text>
              <job-details v-model="form" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title>{{ $t('job.model.paymentInformation') }}</v-card-title>
            <v-card-text>
              <payment-information v-model="form" :invoice-methods="invoiceMethods" @submit="requestSubmit" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title>{{ $t('job.model.customerDetails') }}</v-card-title>
        <v-card-text>
          <customer-details v-model="form" />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <notes v-model="form" :change-handler="noteChangeHandler" :delete-handler="noteDeleteHandler" />
    </v-col>
    <v-col cols="12" sm="6">
      <documents v-model="form" :change-handler="documentChangeHandler" :delete-handler="documentDeleteHandler" />
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import JobDetails from '~/components/job/molecules/JobDetails'
import CustomerDetails from '~/components/job/molecules/CustomerDetails'
import PaymentInformation from '~/components/job/molecules/PaymentInformation'
import Notes from '~/components/common/organisms/Notes'
import Documents from '~/components/common/organisms/Documents'

export default defineComponent({
  name: 'JobUpdateForm',
  components: {
    JobDetails,
    CustomerDetails,
    PaymentInformation,
    Notes,
    Documents
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const { $api, params } = useContext()
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    const buildingTypes = ref([])
    const invoiceMethods = ref([])
    const retentionTypes = ref([])
    const taskProgresses = ref([])
    const taxItemTypes = ref([])
    useFetch(async () => {
      const { result: enumsResult } = await $api.job.getEnums()
      const enumsData = enumsResult || {}
      buildingTypes.value = enumsData.buildingType || []
      invoiceMethods.value = enumsData.invoiceMethod || []
      retentionTypes.value = enumsData.retentionType || []
      taskProgresses.value = enumsData.taskProgress || []
      taxItemTypes.value = enumsData.taxItemType || []
    })

    const noteChangeHandler = async (data) => {
      return await $api.job.createNote(params.value.id, data)
    }
    const noteDeleteHandler = async (data) => {
      return await $api.job.deleteNote(data.id)
    }

    const documentChangeHandler = async (data) => {
      return await $api.job.createAttachment(params.value.id, data)
    }
    const documentDeleteHandler = async (data) => {
      return await $api.job.deleteAttachment(data.id)
    }

    return {
      form,
      buildingTypes,
      invoiceMethods,
      retentionTypes,
      taskProgresses,
      taxItemTypes,
      noteChangeHandler,
      noteDeleteHandler,
      documentChangeHandler,
      documentDeleteHandler
    }
  },
  methods: {
    requestSubmit() {
      this.$emit('submit')
    }
  }
})
</script>
