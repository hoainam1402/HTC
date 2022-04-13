<template>
  <form-dialog
    v-model="visible"
    :loading="loading"
    :title="$t('job.task.action.updateTask')"
    :can-delete="$acl.can('Pages.Jobs.Tasks.Delete')"
    is-update
    width="600px"
    @submit="submit"
  >
    <template slot="content">
      <v-container class="py-0">
        <task-form v-model="model" :job="model.job" />
      </v-container>
    </template>
  </form-dialog>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'
import FormDialog from '~/components/common/molecules/FormDialog'
import TaskForm from '~/components/task/organisms/TaskForm'

export default defineComponent({
  name: 'TaskUpdateDialog',
  components: {
    FormDialog,
    TaskForm
  },
  setup(_, { root, emit }) {
    const initialState = () => ({
      model: {
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

    const { $api, $moment, $snackbar, $dialog } = useContext()
    const visible = ref(false)
    const loading = ref(false)
    const state = reactive(initialState())

    const open = (data) => {
      openTask(data.id)
    }
    const openTask = (id) => {
      root.$nuxt.$loading.start()
      $api.task
        .getTask(id)
        .then(({ result }) => {
          result.startDate = $moment(result.startDate).format('YYYY-MM-DD')
          result.parentTaskId = result.parentTask?.id
          result.assigneeId = result.assignee?.id
          if (result.reminder == null) {
            result.reminder = state.model.reminder
          }
          state.model = result
          visible.value = true
        })
        .catch(() => {
          this.$snackbar({
            message: this.$t('common.message.somethingWentWrong'),
            color: 'error'
          })
        })
        .finally(() => root.$nuxt.$loading.finish())
    }
    const submit = () => {
      loading.value = true
      state.model.parentTaskId = state.model.parentTask?.id
      state.model.assigneeId = state.model.assignee?.id
      state.model.templateId = state.model.template?.id
      $api.task
        .updateTask(state.model.id, state.model)
        .then(() => {
          visible.value = false
          emit('success')
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
    const deleteTask = () => {
      $dialog
        .confirm({
          text: root.$t(
            state.model.parentTask
              ? 'job.task.message.confirmDeletionMessage'
              : 'job.task.message.confirmParentDeletionMessage'
          ),
          title: root.$t('common.message.confirmDeletionTitle')
        })
        .then((confirm) => {
          if (confirm) {
            $api.task
              .deleteTask(state.model.id)
              .then(() => {
                visible.value = false
                $snackbar({
                  message: root.$t('job.task.message.successDelete'),
                  color: 'success'
                })
              })
              .catch(() => {
                this.$snackbar({
                  message: this.$t('common.message.somethingWentWrong'),
                  color: 'error'
                })
              })
          }
        })
    }

    return {
      visible,
      loading,
      model: toRef(state, 'model'),
      open,
      openTask,
      submit,
      deleteTask
    }
  }
})
</script>
