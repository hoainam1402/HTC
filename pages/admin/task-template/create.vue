<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">{{ $t('taskTemplate.action.createTaskTemplate') }}</div>
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
import TaskTemplateForm from '~/components/task-template/organisms/TaskTemplateForm'

export default defineComponent({
  components: {
    Breadcrumbs,
    AppForm,
    TaskTemplateForm
  },
  setup(_, { emit, root }) {
    const initialState = () => ({
      model: {
        name: null,
        buildingType: null,
        tasks: []
      }
    })
    const { $api, $snackbar } = useContext()
    const router = useRouter()
    const loading = ref(false)
    const state = reactive(initialState())

    const submit = () => {
      loading.value = true
      // eslint-disable-next-line array-callback-return
      state.model.tasks.map((e, index) => {
        e.stage = index
      })
      // eslint-disable-next-line array-callback-return
      state.model.tasks.map((e) => {
        // eslint-disable-next-line array-callback-return
        e.subTasks.map((el, index) => {
          el.stage = index
        })
      })
      $api.taskTemplate
        .createTaskTemplate(state.model)
        .then(() => {
          emit('success')
          $snackbar({
            message: root.$t('taskTemplate.message.successCreate'),
            color: 'success'
          })
          router.push({ name: 'admin-task-template' })
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
