<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">{{ $t('lead.action.updateLead') }}</div>
        <breadcrumbs />
      </div>
    </div>
    <app-form v-slot="{ handleSubmit }">
      <v-row dense>
        <v-col cols="12">
          <lead-update-form v-model="model" @success="$nuxt.refresh()" />
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
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import Breadcrumbs from '~/components/global/atoms/Breadcrumbs'
import AppForm from '~/components/atoms/global/AppForm'
import LeadUpdateForm from '~/components/lead/organisms/LeadUpdateForm'
import { ADDRESS } from '~/utils/constants'

export default defineComponent({
  components: {
    Breadcrumbs,
    AppForm,
    LeadUpdateForm
  },
  async asyncData({ $api, $moment, params }) {
    const { result } = await $api.lead.getLead(params.id)
    if (result.startDate != null) {
      result.startDate = $moment(result.startDate).utc().format('YYYY-MM-DD')
    } else {
      result.startDate = ''
    }

    if (result.address === null) {
      result.address = ADDRESS
    }

    if (result.taskTemplate === null) {
      result.taskTemplate = ''
    }

    return {
      model: result
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    submit() {
      this.loading = true
      this.model.taskTemplateId = this.model.taskTemplate.id
      this.$api.lead
        .updateLead(this.model)
        .then(() => {
          this.$snackbar({
            message: this.$t('lead.message.successUpdate'),
            color: 'success'
          })
          this.$router.push({ name: 'leads' })
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
