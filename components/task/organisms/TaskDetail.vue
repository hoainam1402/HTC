<template>
  <div>
    <portal to="right-drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6 d-flex">
            <span class="tw-truncate mr-1">{{ model.name }}</span>
            <v-icon v-if="$acl.can('Pages.Jobs.Tasks.Edit')" color="orange" dense @click="updateTask(model)">
              mdi-pencil-outline
            </v-icon>
            <v-spacer />
            <v-icon color="pink" dense @click="closeTask">mdi-close</v-icon>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <div class="tw-overflow-auto section-height">
        <v-row class="px-2" no-gutters>
          <v-col cols="12" class="mt-2">
            <v-row dense>
              <template v-if="model.parentTask">
                <v-col cols="6">{{ $t('task.detail.parentTask') }}</v-col>
                <v-col cols="6">{{ model.parentTask.name }}</v-col>
              </template>
              <v-col cols="6">{{ $t('task.detail.assignee') }}</v-col>
              <v-col cols="6" class="orange--text">
                <span v-if="model.assignee">{{ model.assignee.name }}</span>
                <span v-else>{{ $t('job.task.model.unassigned') }}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="mt-2">
            <div class="heading font-weight-bold">{{ $t('task.detail.details') }}</div>
            <v-row dense>
              <v-col cols="6">{{ $t('task.detail.status') }}</v-col>
              <v-col cols="6">
                <v-chip :color="model.progress | progressColor" small outlined>
                  {{ model.progress | progressStatus }}
                </v-chip>
              </v-col>
              <v-col cols="6">{{ $t('task.detail.progress') }}</v-col>
              <v-col cols="6">
                <v-progress-linear :value="model.progress" :color="model.progress | progressColor" height="24" />
              </v-col>
              <v-col cols="6">{{ $t('job.task.model.contractAmount') }}</v-col>
              <v-col cols="6">
                <v-progress-linear :value="model.totalAmountPercentage" height="24">
                  {{ model.totalAmountPercentage }}%
                </v-progress-linear>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="mt-2">
            <div class="heading font-weight-bold">{{ $t('task.detail.dates') }}</div>
            <v-row dense>
              <v-col cols="6">{{ $t('task.detail.startDate') }}</v-col>
              <v-col cols="6">{{ model.startDate }}</v-col>
              <v-col cols="6">{{ $t('task.detail.endDate') }}</v-col>
              <v-col cols="6">{{ model.endDate }}</v-col>
              <v-col cols="6">{{ $t('task.detail.duration') }}</v-col>
              <v-col cols="6">{{ model.duration }} {{ $t('task.detail.day') }}</v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="mt-2">
            <v-row dense>
              <v-col cols="10">
                <div class="heading font-weight-bold">{{ $t('task.detail.relatedTasks') }}</div>
              </v-col>
              <v-col cols="2">
                <v-btn v-if="$acl.can('Pages.Jobs.Tasks.Create')" width="20" height="20" fab left @click="createTask">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" class="pa-1">
                <v-list-item v-for="(item, i) in model.relatedTasks" :key="i" :value="item.id" class="d-flex px-0">
                  <v-list-item-content>
                    <v-tooltip :open-delay="200" top>
                      <template #activator="{ on, attrs }">
                        <v-list-item-title
                          v-bind="attrs"
                          class="tw-truncate tw-cursor-pointer"
                          v-on="on"
                          @click="updateTaskId(item.taskId)"
                        >
                          {{ item.name }}
                        </v-list-item-title>
                      </template>
                      <span>{{ item.name }}</span>
                    </v-tooltip>
                    <v-list-item-subtitle v-if="item.assignee" class="orange--text" v-text="item.assignee.name" />
                    <v-list-item-subtitle v-else class="orange--text">
                      {{ $t('job.task.model.unassigned') }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-chip :color="item.progress | progressColor" small outlined>
                      {{ item.progress | progressStatus }}
                    </v-chip>
                  </v-list-item-action>
                </v-list-item>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="model.reminder" cols="12" class="mt-2">
            <div class="heading font-weight-bold">{{ $t('task.detail.reminderSetting') }}</div>
            <v-row dense>
              <v-col cols="6">{{ $t('task.detail.remindBefore') }}</v-col>
              <v-col cols="6">
                {{ model.reminder.remindBefore }} {{ model.reminder.remindBeforeUnit | mapType(optionReminder) }}
              </v-col>
              <v-col cols="6">{{ $t('task.detail.remindAt') }}</v-col>
              <v-col cols="6">{{ model.reminder.remindAt }} {{ $t('task.detail.hours') }}</v-col>
              <v-col cols="12">{{ $t('task.detail.remindType') }}</v-col>
              <v-col cols="4">
                <v-checkbox
                  :label="$t('job.task.model.notification')"
                  :input-value="model.remindNotification"
                  class="pt-0 mt-0"
                  hide-details
                  disabled
                />
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  :label="$t('job.task.model.sms')"
                  :input-value="model.remindSms"
                  class="pt-0 mt-0"
                  hide-details
                  disabled
                />
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  :label="$t('job.task.model.email')"
                  :input-value="model.remindEmail"
                  class="pt-0 mt-0"
                  hide-details
                  disabled
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="model.description" cols="12" class="mt-2">
            <div class="heading font-weight-bold">{{ $t('task.detail.description') }}</div>
            <v-row dense>
              <v-col cols="12">
                <span v-html="model.description" />
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="model.subTasks && model.subTasks.length" cols="12" class="mt-2">
            <div class="heading font-weight-bold">{{ $t('task.detail.subTask') }}</div>
            <v-list-item v-for="(item, i) in model.subTasks" :key="i" :value="item.id" class="d-flex px-0">
              <v-list-item-content>
                <v-tooltip :open-delay="200" top>
                  <template #activator="{ on, attrs }">
                    <v-list-item-title
                      v-bind="attrs"
                      class="tw-truncate tw-cursor-pointer"
                      v-on="on"
                      @click="updateTask(item)"
                    >
                      {{ item.name }}
                    </v-list-item-title>
                  </template>
                  <span>{{ item.name }}</span>
                </v-tooltip>
                <v-list-item-subtitle v-if="item.assignee" class="orange--text" v-text="item.assignee.name" />
                <v-list-item-subtitle v-else class="orange--text">
                  {{ $t('job.task.model.unassigned') }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip :color="item.progress | progressColor" small outlined>
                  {{ item.progress | progressStatus }}
                </v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-col>
        </v-row>
      </div>
    </portal>
    <task-create-dialog ref="taskCreateDialog" @success="createRelated" />
    <task-update-dialog ref="taskUpdateDialog" @success="$emit('success')" />
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRef,
  useContext,
  useStore,
  ref,
  watch,
  useRoute,
  useFetch
} from '@nuxtjs/composition-api'
import TaskCreateDialog from '~/components/task/organisms/TaskCreateDialog'
import TaskUpdateDialog from '~/components/task/organisms/TaskUpdateDialog'

export default defineComponent({
  name: 'TaskDetail',
  components: {
    TaskCreateDialog,
    TaskUpdateDialog
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { root, emit }) {
    const { $api, $moment } = useContext()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      model: {
        assignee: '',
        relatedTasks: [],
        subTasks: [],
        reminder: {
          remindBeforeUnit: 0,
          remindBefore: 1,
          remindAt: 10,
          note: '',
          remindNotification: true,
          remindEmail: false,
          remindSms: false
        }
      }
    })

    const optionReminder = ref([])
    useFetch(async () => {
      const { result: enumResult } = await $api.task.getTaskEnums()
      optionReminder.value = (enumResult || {}).timeUnit || []
    })

    const open = (taskId) => {
      // root.$nuxt.$loading.start()
      $api.task.getTask(taskId).then(({ result }) => {
        result.startDate = $moment(result.startDate).format('YYYY-MM-DD')
        result.endDate = $moment(result.endDate).format('YYYY-MM-DD')
        state.model = result
        store.commit('app/SHOW_RIGHT_MENU')
      }).catch(() => {
        this.$snackbar({
          message: this.$t('common.message.somethingWentWrong'),
          color: 'error'
        })
      })
      // .finally(() => root.$nuxt.$loading.finish())
    }

    const taskId = ref(route.value.query.taskId)
    watch(
      taskId,
      (val) => {
        if (val) {
          open(val)
        }
      },
      { immediate: true }
    )

    const createRelated = (taskId) => {
      state.model.relatedTasks.push({
        taskId,
        relationship: 0
      })
      $api.task.updateTask(state.model.id, state.model)
      emit('success')
    }

    return {
      model: toRef(state, 'model'),
      optionReminder,
      open,
      createRelated
    }
  },
  methods: {
    createTask() {
      this.$refs.taskCreateDialog.open(null, this.model)
    },
    updateTask(task) {
      this.$refs.taskUpdateDialog.open(task)
    },
    updateTaskId(id) {
      this.$refs.taskUpdateDialog.openTask(id)
    },
    closeTask() {
      this.$store.commit('app/HIDE_RIGHT_MENU')
    }
  }
})
</script>

<style scoped>
.section-height {
  height: calc(100vh - 4rem);
}
</style>
