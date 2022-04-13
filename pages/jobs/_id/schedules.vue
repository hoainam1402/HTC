<template>
  <v-row class="mt-2" dense>
    <v-col cols="12">
      <v-card>
        <v-card-title>
          <span>Schedules</span>
          <v-spacer />
          <v-menu v-if="viewType" transition="slide-y-transition" bottom>
            <template #activator="{ on, attrs }">
              <v-btn v-bind="attrs" class="mr-1" v-on="on">
                <v-icon>{{ viewType.iconName }}</v-icon>
                <span class="ml-1 mr-2">{{ viewType.title }}</span>
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item v-for="type in viewTypes" :key="type.code" link @click="changeViewType(type)">
                <v-list-item-icon>
                  <v-icon>{{ type.iconName }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ type.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn color="primary" @click="onAddTask(null)">
            <v-icon class="mr-1">mdi-plus</v-icon>
            <span>New Task</span>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="py-0">
          <tasks-table
            v-if="viewTypeCode === 'table'"
            ref="table"
            :job-id="job.id"
            @on-loading="onTableLoading"
            @on-add-task="onAddTask"
            @on-add-order="onAddOrder"
            @on-view-task="onViewTask"
            @on-edit-task="onEditTask"
            @on-delete-task="onDeleteTask"
          />
          <tasks-calendar
            v-if="viewTypeCode === 'calendar'"
            ref="calendar"
            :job-id="job.id"
            @on-loading="onCalendarLoading"
            @on-add-task="onAddTask"
            @on-edit-task="onEditTask"
          />
        </v-card-text>
        <task-create-dialog ref="taskCreateDialog" @success="refreshData" />
        <task-update-dialog ref="taskUpdateDialog" @success="refreshData" />
        <task-detail ref="taskDetail" @success="refreshData" />
        <create-purchase-order ref="createPurchaseOrder" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import _ from 'lodash'
import { computed, defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import TasksTable from '~/components/task/organisms/TasksTable'
import TasksCalendar from '~/components/task/organisms/TasksCalendar'
import TaskCreateDialog from '~/components/task/organisms/TaskCreateDialog'
import TaskUpdateDialog from '~/components/task/organisms/TaskUpdateDialog'
import TaskDetail from '~/components/task/organisms/TaskDetail'
import CreatePurchaseOrder from '~/components/purchase-order/organisms/CreatePurchaseOrder'

export default defineComponent({
  components: {
    TasksTable,
    TasksCalendar,
    TaskCreateDialog,
    TaskUpdateDialog,
    TaskDetail,
    CreatePurchaseOrder
  },
  props: {
    job: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { root }) {
    const { $api, $dialog, $snackbar } = useContext()
    const viewTypes = computed(() => {
      return [
        { code: 'calendar', title: 'Calendar', iconName: 'mdi-calendar-today' },
        { code: 'table', title: 'Table', iconName: 'mdi-folder-table-outline' }
      ]
    })
    const viewTypeCode = ref('table')
    const viewType = computed(() => {
      return _.find(viewTypes.value || [], (item) => item.code === viewTypeCode.value)
    })

    const calendar = ref(null)
    const table = ref(null)
    const calendarLoading = ref(false)
    const tableLoading = ref(false)
    const taskCreateDialog = ref(null)
    const taskUpdateDialog = ref(null)
    const taskDetail = ref(null)
    const createPurchaseOrder = ref(null)

    const onCalendarLoading = (isLoading) => {
      calendarLoading.value = isLoading
    }
    const onTableLoading = (isLoading) => {
      tableLoading.value = isLoading
    }
    const loading = computed(() => {
      return calendarLoading.value === true || tableLoading.value === true
    })

    const changeViewType = (type) => {
      viewTypeCode.value = type.code
    }

    const refreshData = () => {
      if (viewTypeCode.value === 'calendar') {
        calendar.value.reloadData()
        return
      }
      table.value.reloadData()
    }

    const onAddOrder = (task) => {
      createPurchaseOrder.value.open(task)
    }

    const onAddTask = (parentTask) => {
      taskCreateDialog.value.open(parentTask)
    }

    const onViewTask = (task) => {
      taskDetail.value.open(task.id)
    }

    const onEditTask = (task) => {
      taskUpdateDialog.value.open(task)
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
                refreshData()
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
      calendar,
      table,
      viewTypeCode,
      viewType,
      viewTypes,
      loading,
      taskCreateDialog,
      taskUpdateDialog,
      taskDetail,
      createPurchaseOrder,
      changeViewType,
      onCalendarLoading,
      onTableLoading,
      onAddOrder,
      onAddTask,
      onViewTask,
      onEditTask,
      onDeleteTask,
      refreshData
    }
  }
})
</script>
