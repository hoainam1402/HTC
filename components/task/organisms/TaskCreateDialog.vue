<template>
  <form-dialog
    v-model="visible"
    :loading="loading"
    :title="$t('job.task.action.createTask')"
    width="600px"
    @submit="submit"
  >
    <template slot="content">
      <v-container class="py-0">
        <task-form v-model="model" :job="jobDetails" />
      </v-container>
    </template>
  </form-dialog>
</template>

<script>
import { computed, defineComponent, reactive, ref, toRef, useContext, useStore, watch } from '@nuxtjs/composition-api'
import { isEmpty } from 'lodash'
import FormDialog from '~/components/common/molecules/FormDialog'
import TaskForm from '~/components/task/organisms/TaskForm'

export default defineComponent({
  name: 'TaskCreateDialog',
  components: {
    FormDialog,
    TaskForm
  },
  setup(_, { emit }) {
    const initialState = () => ({
      model: {
        jobId: params.value.id,
        job: {
          id: params.value.id
        },
        name: '',
        parentTaskId: '',
        parentTask: null,
        description: '',
        startDate: $moment().format('YYYY-MM-DD'),
        duration: 1,
        progress: 0,
        totalAmountPercentage: 0,
        assigneeId: null,
        assignee: null,
        templateId: '',
        template: null,
        reminder: {
          remindBefore: 1,
          remindBeforeUnit: 0,
          remindAt: 10,
          remindNotification: true,
          remindEmail: false,
          remindSms: false,
          note: ''
        }
      }
    })

    const { $api, $moment, $snackbar, params } = useContext()
    const store = useStore()
    const visible = ref(false)
    const loading = ref(false)
    const state = reactive(initialState())
    const job = ref({})
    const jobDetails = computed(() => {
      if (!isEmpty(store.state.job.jobDetails)) {
        return store.state.job.jobDetails
      }

      return job.value
    })

    watch(visible, (val) => {
      if (!val) {
        Object.assign(state, initialState())
      }
    })

    const open = (parent, task) => {
      if (parent) {
        state.model.parentTask = parent
        state.model.parentTaskId = parent.id
        state.model.startDate = $moment(parent.startDate).format('YYYY-MM-DD')
      }
      if (task) {
        job.value = task.job
      }
      visible.value = true
    }
    const submit = () => {
      loading.value = true
      state.model.parentTaskId = state.model.parentTask?.id
      state.model.assigneeId = state.model.assignee?.id
      state.model.templateId = state.model.template?.id
      $api.task
        .createTask(state.model)
        .then(({ result }) => {
          visible.value = false
          emit('success', result.id)
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
          loading.value = false
        })
    }

    return {
      visible,
      loading,
      model: toRef(state, 'model'),
      jobDetails,
      open,
      submit
    }
  }
})
</script>
