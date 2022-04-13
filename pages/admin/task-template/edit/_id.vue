<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">{{ $t('taskTemplate.action.updateTaskTemplate') }} - {{ model.name }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
    </div>
    <app-form v-slot="{ handleSubmit }">
      <v-card>
        <v-card-title>{{ $t('taskTemplate.model.taskTemplateInformation') }}</v-card-title>
        <v-card-text>
          <task-template-form v-model="model" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="loading" class="px-2 mr-1" text @click="$router.go(-1)">
            {{ $t('common.action.discard') }}
          </v-btn>
          <v-btn :loading="loading" color="primary" class="px-2" @click="handleSubmit(submit)">
            {{ $t('common.action.update') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </app-form>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import Breadcrumbs from '~/components/global/atoms/Breadcrumbs.vue'
import AppForm from '~/components/atoms/global/AppForm.vue'
import TaskTemplateForm from '~/components/task-template/organisms/TaskTemplateForm'

export default defineComponent({
  components: {
    Breadcrumbs,
    AppForm,
    TaskTemplateForm
  },
  async asyncData({ $api, params }) {
    const { result } = await $api.taskTemplate.getTaskTemplate(params.id)

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
      this.$api.taskTemplate
        .updateTaskTemplate(this.model)
        .then(() => {
          this.$snackbar({
            message: this.$t('taskTemplate.message.successUpdate'),
            color: 'success'
          })
          this.$router.push({ name: 'admin-task-template' })
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
