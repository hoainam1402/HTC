<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">{{ $t('menu.workspace') }}</div>
        <breadcrumbs />
      </div>
    </div>
    <list-filter v-model="params" @filter="filterTasks" @reset="resetFilter" />
    <v-card class="mt-3">
      <v-row class="align-center pa-2" dense>
        <v-spacer />
        <v-btn :loading="loading" class="ml-2" icon small @click="refresh">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-row>
      <app-data-table
        :headers="headers"
        :items="tasks"
        :server-items-length="totalCount"
        :sort-by.sync="sorting.sortBy"
        :sort-desc.sync="sorting.sortDesc"
        :loading="loading"
        item-key="uuid"
        class="flex-grow-1"
        @update:page="onUpdatePage"
        @update:items-per-page="onUpdateItemsPerPage"
        @update:sort-by="onUpdateSort"
        @update:sort-desc="onUpdateSort"
      >
        <template #item.name="{ item }">
          <a class="text-decoration-underline" @click="onViewTask(item)">
            <strong v-if="!item.parentTask">{{ item.name }}</strong>
            <span v-else>{{ item.name }}</span>
          </a>
        </template>
        <template #item.startDate="{ item }">
          <div>{{ item.startDate | formatDate('DD/MM/YYYY') }}</div>
        </template>
        <template #item.duration="{ item }">
          <div>{{ item.duration | formatDuration }}</div>
        </template>
        <template #item.endDate="{ item }">
          <div class="text-right">{{ item.endDate | formatDate('DD/MM/YYYY') }}</div>
        </template>
        <template #item.job="{ item }">
          <div>{{ (item.job || {}).displayName }}</div>
        </template>
        <template #item.progress="{ item }">
          <v-menu v-model="item._progressMenu" :nudge-top="40" :close-on-content-click="false" close-on-click offset-y>
            <template #activator="{ on, attrs }">
              <v-progress-linear
                :value="item.progress || 0"
                :color="getProgressColor(item.progress)"
                height="22"
                class="task-progress"
                style="border-radius: 4px"
                v-bind="attrs"
                v-on="on"
              >
                <template #default="{ value: percent }">
                  <v-card-actions class="pt-0 pb-0 pl-1 pr-1" style="width: 100%">
                    <strong class="white--text">{{ getProgressStatus(percent) }}</strong>
                    <v-spacer />
                    <v-icon class="pl-1 white--text" small>mdi-pencil-outline</v-icon>
                  </v-card-actions>
                </template>
              </v-progress-linear>
            </template>
            <v-card dense>
              <v-card-actions>
                <v-text-field
                  v-model="item._progress"
                  :rules="rules.progress"
                  type="number"
                  step="25"
                  style="max-width: 150px"
                  autofocus
                />
                <v-btn class="ml-2" color="primary" @click="onInlineUpdateTask(item)">
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </template>
        <template #item.assignee="{ item }">
          <div class="text-center">
            <span v-if="item.assignee">{{ item.assignee.name }}</span>
            <span v-else>
              <v-icon color="orange" small>mdi-alert-outline</v-icon>
              <span class="orange--text">{{ $t('job.task.model.unassigned') }}</span>
            </span>
          </div>
        </template>
        <template #item.actions="{ item }">
          <v-menu v-if="$acl.anyPermission(['Pages.Jobs.Tasks.Edit', 'Pages.Jobs.Tasks.Delete'])" offset-y>
            <template #activator="{ on, attrs }">
              <v-btn v-bind="attrs" icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-if="$acl.can('Pages.Jobs.Tasks.Edit')" dense link @click="onEditTask(item)">
                <v-list-item-title>
                  <v-icon dense>mdi-pencil-outline</v-icon>
                  <span class="ml-1">{{ $t('common.action.update') }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="$acl.can('Pages.Jobs.Tasks.Delete')"
                class="error--text"
                dense
                link
                @click="onDeleteTask(item)"
              >
                <v-list-item-title>
                  <v-icon color="error" dense>mdi-delete-outline</v-icon>
                  <span class="ml-1">{{ $t('common.action.delete') }}</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </app-data-table>
    </v-card>
    <task-update-dialog ref="taskUpdateDialog" @success="refresh" />
    <task-detail ref="taskDetail" @success="refresh" />
  </div>
</template>

<script>
import _ from 'lodash'
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRef,
  useContext,
  useRoute
} from '@nuxtjs/composition-api'
import { useWorkspace } from '@/compositions'
import Breadcrumbs from '~/components/global/atoms/Breadcrumbs'
import ListFilter from '~/components/workspace/molecules/ListFilter'
import AppDataTable from '~/components/atoms/global/AppDataTable'
import TaskUpdateDialog from '~/components/task/organisms/TaskUpdateDialog'
import TaskDetail from '~/components/task/organisms/TaskDetail'

export default defineComponent({
  components: {
    Breadcrumbs,
    ListFilter,
    AppDataTable,
    TaskUpdateDialog,
    TaskDetail
  },
  setup(props, { root }) {
    const { $api, $snackbar, $dialog, $moment, $hub } = useContext()
    const route = useRoute()
    const state = reactive({
      params: Object.assign(
        {
          filter: '',
          sorting: 'startDate asc',
          assigneeId: '',
          date: $moment().format(),
          fromDate: $moment().format(),
          toDate: $moment().format(),
          jobId: '',
          progress: [0],
          flattenResult: true
        },
        route.value.query
      ),
      sorting: {
        sortBy: ['startDate'],
        sortDesc: [false]
      },
      search: '',
      headers: [
        { text: root.$t('job.task.model.name'), value: 'name' },
        { text: root.$t('job.task.model.job'), value: 'job' },
        { text: root.$t('job.task.model.codeNumber'), value: 'leadCodeNumber' },
        { text: root.$t('job.task.model.startDate'), value: 'startDate' },
        { text: root.$t('job.task.model.duration'), value: 'duration' },
        { text: root.$t('job.task.model.assignee'), value: 'assignee', align: 'center', sortable: false },
        { text: root.$t('job.task.model.progress'), value: 'progress', sortable: false },
        { text: root.$t('job.task.model.endDate'), value: 'endDate', align: 'right' },
        { text: '', value: 'actions', align: 'right', sortable: false }
      ],
      rules: {
        progress: [
          (v) => !isNaN(parseFloat(v)) || 'Invalid number',
          (v) => (parseFloat(v) >= 0 && parseFloat(v) <= 100) || 'Invalid progress value'
        ]
      }
    })
    const { loading, conditions, refresh, state: listState } = useWorkspace(state.params)

    const taskItems = computed(() => {
      return _.map(listState.items, (item) => {
        item._progress = item.progress
        item._progressMenu = false
        return item
      })
    })

    onMounted(() => {
      $hub.on('getUpdatedTask', (data) => {
        taskItems.value.map((e) => {
          if (e.id === data.id) {
            e._progress = data.progress
            e.progress = data.progress
          }
          return e
        })
      })
    })

    const filterTasks = () => {
      conditions.jobId = state.params.jobId
      conditions.progress = state.params.progress
      conditions.assigneeId = state.params.assigneeId
      conditions.date = state.params.date
    }

    const resetFilter = () => {
      state.params = {
        jobId: '',
        progress: [0],
        assigneeId: '',
        date: ''
      }

      conditions.jobId = state.params.jobId
      conditions.progress = state.params.progress
      conditions.assigneeId = state.params.assigneeId
      conditions.date = state.params.date
    }

    const searchTasks = () => {
      conditions.filter = state.search
    }

    const onUpdatePage = (val) => {
      conditions.skipCount = (val - 1) * 10
    }

    const onUpdateItemsPerPage = (val) => {
      conditions.maxResultCount = val
    }

    const onUpdateSort = () => {
      if (state.sorting.sortBy[0]) {
        conditions.sorting = `${state.sorting.sortBy[0]} ${state.sorting.sortDesc[0] ? 'desc' : 'asc'}`
      } else {
        conditions.sorting = ''
      }
    }

    const taskDetail = ref(null)
    const onViewTask = (task) => {
      taskDetail.value.open(task.id)
    }

    const taskUpdateDialog = ref(null)
    const onEditTask = (task) => {
      taskUpdateDialog.value.open(task)
    }

    const onInlineUpdateTask = (task) => {
      if (!task) return
      const cleanedForm = _.clone(task)

      // map assigneeId from assignee object when needed
      if (cleanedForm.assignee) {
        cleanedForm.assigneeId = (cleanedForm.assignee || {}).id || (cleanedForm.assignee || {}).userId
      }

      // map progress
      if (cleanedForm._progress) {
        cleanedForm.progress = cleanedForm._progress
        delete cleanedForm._progress
      }

      $api.task
        .updateTask(cleanedForm.id, cleanedForm)
        .then(() => {
          $snackbar({
            message: root.$t('task.message.successUpdate'),
            color: 'success'
          })
          refresh.value()
        })
        .catch(() => {
          this.$snackbar({
            message: this.$t('common.message.somethingWentWrong'),
            color: 'error'
          })
          refresh.value()
        })
    }

    const onDeleteTask = (task) => {
      $dialog
        .confirm({
          text: root.$t(
            task.parentTask
              ? 'job.task.message.confirmDeletionMessage'
              : 'job.task.message.confirmParentDeletionMessage'
          ),
          title: root.$t('common.message.confirmDeletionTitle')
        })
        .then((confirm) => {
          if (confirm) {
            $api.task
              .deleteTask(task.id)
              .then(() => {
                refresh.value()
                $snackbar({
                  message: root.$t('job.task.message.successDelete'),
                  color: 'success'
                })
              })
              .catch(() => {
                $snackbar({
                  message: root.$t('common.message.somethingWentWrong'),
                  color: 'error'
                })
              })
          }
        })
    }

    return {
      params: toRef(state, 'params'),
      sorting: toRef(state, 'sorting'),
      search: toRef(state, 'search'),
      headers: toRef(state, 'headers'),
      rules: toRef(state, 'rules'),
      conditions,
      loading,
      refresh,
      tasks: taskItems,
      totalCount: toRef(listState, 'totalCount'),
      searchTasks,
      filterTasks,
      resetFilter,
      onUpdatePage,
      onUpdateItemsPerPage,
      onUpdateSort,
      taskDetail,
      taskUpdateDialog,
      onViewTask,
      onEditTask,
      onDeleteTask,
      onInlineUpdateTask
    }
  },
  async asyncData({ $api }) {
    const { result: enums } = await $api.task.getTaskEnums()

    return {
      enums
    }
  },
  methods: {
    getProgressColor(progressPercent) {
      const percent = progressPercent || 0
      if (percent === 0) {
        return 'blue-grey'
      }
      if (percent >= 100) {
        return 'green'
      }
      return 'orange'
    },
    getProgressStatus(progressPercent) {
      const percent = progressPercent || 0
      if (percent === 0) {
        return 'Scheduled'
      }
      if (percent >= 100) {
        return 'Completed'
      }
      return `${Math.ceil(percent)}%`
    }
  }
})
</script>

<style scoped>
.task-progress {
  min-width: 100px;
}
</style>
