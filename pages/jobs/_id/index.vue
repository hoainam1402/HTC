<template>
  <app-form v-slot="{ handleSubmit }" class="mt-1">
    <v-row dense>
      <v-col cols="12">
        <job-update-form v-model="model" />
      </v-col>
      <v-col cols="12">
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="loading" class="px-2 mr-1" text @click="$router.go(-1)">
            {{ $t('common.action.discard') }}
          </v-btn>
          <v-btn :loading="loading" color="primary" class="px-2" @click="handleSubmit(submit)">
            {{ $t('common.action.update') }}
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </app-form>
</template>

<script>
import { defineComponent, reactive } from '@nuxtjs/composition-api'
import AppForm from '~/components/atoms/global/AppForm'
import JobUpdateForm from '~/components/job/organisms/JobUpdateForm'

export default defineComponent({
  components: {
    AppForm,
    JobUpdateForm
  },
  props: {
    job: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const model = reactive(props.job)

    return {
      model
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    getCleanedForm() {
      const cleanedForm = JSON.parse(JSON.stringify(this.model))
      const taxId = ((cleanedForm.contractPrice || {}).appliedTax || {}).id
      if (typeof taxId === 'string' && !cleanedForm.contractPrice.appliedTaxId) {
        cleanedForm.contractPrice.appliedTaxId = taxId
      }
      return cleanedForm
    },
    submit() {
      this.loading = true
      this.$api.job
        .updateJob(this.job.id, this.getCleanedForm())
        .then(() => {
          this.$snackbar({
            message: this.$t('job.message.successUpdate'),
            color: 'success'
          })
          this.$nuxt.refresh()
        })
        .catch(() => {
          this.$snackbar({
            message: this.$t('common.message.somethingWentWrong'),
            color: 'error'
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
})
</script>
