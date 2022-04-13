<template>
  <v-card flat style="width: 100%" class="pa-0">
    <v-card-text class="pa-0">
      <a-g-gird-table
        ref="agGridTable"
        style="width: 100%"
        :columns="tableColumns"
        :rows="tableRows"
        :grouped-by="'subTasks'"
        :indicator-by="'stage'"
        :on-cell-update="onTableCellUpdate"
        :pinned-bottom-row-data="pinnedBottomRowData"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-pagination v-if="availablePages > 1" v-model="currentPage" :length="availablePages" />
    </v-card-actions>
  </v-card>
</template>

<script>
import _ from 'lodash'
import {
  computed,
  defineComponent,
  reactive,
  ref,
  toRef,
  useContext,
  useRoute,
  useStore,
  watch
} from '@nuxtjs/composition-api'
import numeral from 'numeral'
import AGGirdTable from '~/components/global/molecules/AgGirdTable'
import { useGetTasks } from '@/compositions'
import {
  AG_GRID_FIELD_CHILDS_COUNT,
  AG_GRID_FIELD_PARENT_DETAILS,
  AG_GRID_FIELD_PARENT_ID,
  FORMAT_BACKEND_DATETIME_WITHOUT_TZ
} from '@/utils/constants'
import AgTaskActionCellRenderer from '~/components/task/atoms/AgTaskActionCellRenderer'

export default defineComponent({
  components: {
    AGGirdTable,
    // eslint-disable-next-line
    agTaskActionCellRenderer: AgTaskActionCellRenderer
  },
  props: {
    jobId: {
      type: String,
      required: true
    }
  },
  setup(props, { root, emit }) {
    const { $api, $snackbar, $moment } = useContext()
    const route = useRoute()
    const store = useStore()
    const agGridTable = ref(null)

    const state = reactive({
      params: Object.assign(
        {
          jobId: props.jobId,
          filter: '',
          sorting: 'startDate asc',
          excludeSubTasks: false,
          maxResultCount: 50,
          skipCount: 0
        },
        route.value.query
      ),
      tableColumns: [],
      tableRows: []
    })

    const {
      loading: tableLoading,
      tableConditions,
      refresh: tableRefresh,
      state: tasksState
    } = useGetTasks(state.params)

    const pinnedBottomRowData = ref([])
    watch(tasksState, (newState) => {
      if (!newState || typeof newState !== 'object') return
      state.tableRows = newState.items || []
      pinnedBottomRowData.value = [
        {
          name: 'Total',
          contractAmount: _.sumBy(state.tableRows, 'contractAmount'),
          totalAmountPercentage: _.sumBy(state.tableRows, 'totalAmountPercentage'),
          creditAmount: _.sumBy(state.tableRows, 'creditAmount'),
          creditAmountPercentage: _.sumBy(state.tableRows, 'creditAmountPercentage'),
          id: '_BOTTOM_DATA'
        }
      ]
    })

    watch(tableLoading, (isLoading) => {
      emit('on-loading', isLoading)
    })

    const availablePages = computed(() => {
      const totalItems = (tasksState || {}).totalCount || 0
      return Math.ceil(totalItems / state.params.maxResultCount)
    })

    const currentPage = computed({
      get: () => Math.ceil((state.params.skipCount + 1) / state.params.maxResultCount),
      set: (val) => {
        state.params.skipCount = (val - 1) * state.params.maxResultCount
        tableConditions.skipCount = state.params.skipCount
      }
    })

    const getAvailablePercentage = (subtractPercentage) => {
      let totalPercents = 0.0
      _.forEach(
        _.filter(
          _.map(_.cloneDeep(state.tableRows || []), (taskItem) => {
            const itemCost = parseFloat(taskItem.totalAmountPercentage || '0.0')
            if (isNaN(itemCost)) return -1
            return itemCost
          }),
          (percent) => percent >= 0.0
        ),
        (percent) => {
          totalPercents += percent
        }
      )
      return 100.0 - (totalPercents - (subtractPercentage || 0.0))
    }

    /// data table

    const onTableCellUpdate = (params, next) => {
      const data = JSON.parse(JSON.stringify(params.data))
      if (!data) return next(null)

      // map assigneeId from assignee object when needed
      if (data.assignee) {
        data.assigneeId = (data.assignee || {}).id || (data.assignee || {}).userId
      }

      $api.task
        .updateTask(data.id, data)
        .then((/* response */) => {
          $snackbar({
            message: root.$t('task.message.successUpdate'),
            color: 'success'
          })
          // uncomment line below and remove refresh.value() in next line
          // after backend fix response data consistent with model
          // next(response.result)
          tableRefresh.value()
        })
        .catch(() => {
          next(null)
        })
    }

    const addChildTask = (parentTask) => {
      emit('on-add-task', parentTask)
    }

    const addOrder = (task) => {
      emit('on-add-order', task)
    }

    const viewTask = (task) => {
      emit('on-view-task', task)
    }

    const editTask = (task) => {
      emit('on-edit-task', task)
    }

    const deleteTask = (task) => {
      emit('on-delete-task', task)
    }

    state.tableColumns = [
      {
        field: 'name',
        minWidth: 250,
        pinned: 'left',
        enableCellChangeFlash: true,
        editable: (params) => {
          return params.data.id !== '_BOTTOM_DATA'
        },
        cellClass: (params) => {
          if (params.data.id !== '_BOTTOM_DATA') {
            // styling for grouped rows
            if (params.data[AG_GRID_FIELD_PARENT_ID]) {
              return 'custom-cell-name-child'
            }
            return 'custom-cell-name-parent'
          }
        },
        cellRendererParams: (params) => {
          if (params.data.id === '_BOTTOM_DATA') {
            return {
              isPinnedBottomRowData: true
            }
          }
          if (typeof params.data[AG_GRID_FIELD_PARENT_ID] !== 'string' && params.data.id !== '_BOTTOM_DATA') {
            return {
              action: {
                iconName: 'mdi-plus',
                tooltip: 'Add child task',
                tintColor: 'green',
                action: () => {
                  addChildTask(params.data)
                }
              }
            }
          }
          return {}
        }
      },
      {
        field: 'startDate',
        width: 150,
        enableCellChangeFlash: true,
        editable: (params) => {
          return params.data.id !== '_BOTTOM_DATA'
        },
        cellEditorFramework: 'agDatePickerEditor',
        cellEditorParams: (params) => {
          if (params.data && params.data[AG_GRID_FIELD_PARENT_DETAILS]) {
            const parentDetails = params.data[AG_GRID_FIELD_PARENT_DETAILS] || {}
            const minDate = $moment(parentDetails.startDate || '', FORMAT_BACKEND_DATETIME_WITHOUT_TZ).format(
              'YYYY-MM-DD'
            )
            const maxDate = $moment(parentDetails.endDate || '', FORMAT_BACKEND_DATETIME_WITHOUT_TZ).format(
              'YYYY-MM-DD'
            )
            return {
              minDate,
              maxDate
            }
          }
          return {}
        },
        valueFormatter: (params) => {
          if (typeof params.value === 'string') {
            return $moment(params.value).format('DD/MM/YYYY')
          }
          return null
        },
        valueSetter: (params) => {
          params.data.startDate = params.newValue
          return true
        }
      },
      {
        field: 'endDate',
        width: 150,
        editable: false,
        enableCellChangeFlash: true,
        cellEditorFramework: 'agDatePickerEditor',
        valueFormatter: (params) => {
          if (typeof params.value === 'string') {
            return $moment(params.value).format('DD/MM/YYYY')
          }
          return null
        }
      },
      {
        field: 'duration',
        width: 140,
        enableCellChangeFlash: true,
        editable: (params) => {
          return params.data.id !== '_BOTTOM_DATA' && !(params.data.subTasks?.length > 0)
        },
        cellEditorFramework: 'agTextFieldEditor',
        cellEditorParams: (params) => {
          if (params.data && params.data[AG_GRID_FIELD_PARENT_DETAILS]) {
            const parentDetails = params.data[AG_GRID_FIELD_PARENT_DETAILS] || {}
            const selectedDateString = params.data.startDate || ''
            const maxDate = $moment(parentDetails.endDate || '', FORMAT_BACKEND_DATETIME_WITHOUT_TZ)
            if (selectedDateString.length && maxDate) {
              const selectedDate = $moment(selectedDateString, FORMAT_BACKEND_DATETIME_WITHOUT_TZ)
              const maxDuration = Math.ceil((maxDate - selectedDate) / 86400000)
              return {
                type: 'number',
                maxNumber: maxDuration
              }
            }
          }
          return {
            type: 'number'
          }
        },
        valueFormatter: (params) => {
          let value = null
          if (typeof params.value === 'number') {
            value = params.value
          }
          if (typeof params.value === 'string') {
            value = parseInt(params.value)
          }
          if (value === null) {
            return null
          }

          if (value > 1) {
            return `${value} days`
          }
          return `${value} day`
        },
        valueSetter: (params) => {
          params.data.duration = params.newValue
          return true
        }
      },
      {
        field: 'progress',
        width: 150,
        enableCellChangeFlash: true,
        cellRenderer: 'agProgressBarRenderer',
        editable: (params) => {
          return !params.data[AG_GRID_FIELD_CHILDS_COUNT] && params.data.id !== '_BOTTOM_DATA'
        }
      },
      {
        headerName: 'Assignee',
        width: 150,
        cellEditorFramework: 'agUserAutocompleteEditor',
        editable: (params) => {
          return params.data.id !== '_BOTTOM_DATA'
        },
        valueFormatter: (params) => {
          const assignee = (params.data || {}).assignee
          if (!assignee) return null
          return assignee.name
        },
        valueGetter: (params) => {
          return (params.data || {}).assignee
        },
        valueSetter: (params) => {
          params.data.assignee = params.newValue
          return true
        }
      },
      {
        headerName: 'Percent',
        field: 'totalAmountPercentage',
        width: 150,
        enableCellChangeFlash: true,
        cellClass: (params) => {
          if (params.data.id === '_BOTTOM_DATA') {
            return 'title font-weight-regular'
          }
          return ''
        },
        editable: (params) => {
          return !params.data[AG_GRID_FIELD_PARENT_ID] && params.data.id !== '_BOTTOM_DATA'
        },
        valueFormatter: (params) => {
          if (params.data[AG_GRID_FIELD_PARENT_ID]) {
            return ''
          }
          const percent = parseFloat(params.value || '0.0')
          return `${percent}%`
        },
        valueSetter: (params) => {
          let oldValue = parseFloat(params.oldValue || 0.0)
          if (isNaN(oldValue)) oldValue = 0.0
          let newValue = parseFloat(params.newValue || 0.0)
          if (isNaN(newValue)) newValue = 0.0
          const maxPercents = getAvailablePercentage(oldValue)
          if (newValue <= maxPercents) {
            params.data.contractAmountFlag = 'totalAmountPercentage'
            params.data.totalAmountPercentage = newValue
            return true
          }

          $snackbar({
            message: root.$t('validations.maxPercent', { _field_: 'contract percent', _max_: maxPercents }),
            color: 'error'
          })
          return false
        }
      },
      {
        headerName: 'Cash',
        field: 'contractAmount',
        width: 150,
        enableCellChangeFlash: true,
        cellClass: (params) => {
          if (params.data.id === '_BOTTOM_DATA') {
            return 'title'
          }
          return ''
        },
        editable: (params) => {
          return !params.data[AG_GRID_FIELD_PARENT_ID] && params.data.id !== '_BOTTOM_DATA'
        },
        valueFormatter: (params) => {
          if (params.data[AG_GRID_FIELD_PARENT_ID]) {
            return ''
          }
          const amount = parseFloat(params.value || '0.0')
          return numeral(amount).format('$0,0.00')
        },
        valueSetter: (params) => {
          const job = store.state.job.jobDetails
          const maxAmount = (job.totalPrice * (100 - job.contractPrice.markupPercent)) / 100
          let newValue = parseFloat(params.newValue || 0.0)
          if (isNaN(newValue)) newValue = 0.0
          if (newValue <= maxAmount) {
            params.data.contractAmountFlag = 'contractAmount'
            params.data.contractAmount = newValue
            return true
          }

          $snackbar({
            message: root.$t('validations.maxAmount', { _field_: 'contract amount', _max_: maxAmount }),
            color: 'error'
          })
          return false
        }
      },
      {
        headerName: 'Bank',
        field: 'creditAmount',
        width: 150,
        enableCellChangeFlash: true,
        cellClass: (params) => {
          if (params.data.id === '_BOTTOM_DATA') {
            return 'title'
          }
          return ''
        },
        editable: (params) => {
          return !params.data[AG_GRID_FIELD_PARENT_ID] && params.data.id !== '_BOTTOM_DATA'
        },
        valueFormatter: (params) => {
          if (params.data[AG_GRID_FIELD_PARENT_ID]) {
            return ''
          }
          const amount = parseFloat(params.value || '0.0')
          return numeral(amount).format('$0,0.00')
        },
        valueSetter: (params) => {
          let newValue = parseFloat(params.newValue || 0.0)
          if (isNaN(newValue)) newValue = 0.0
          params.data.creditAmount = newValue
          return true
        }
      },
      {
        field: '_actions',
        headerName: '',
        width: 36,
        suppressSizeToFit: true,
        cellRenderer: 'agTaskActionCellRenderer',
        cellRendererParams: (params) => {
          if (params.data.id !== '_BOTTOM_DATA') {
            const actions = [
              {
                title: root.$t('task.purchaseOrders.addPurchaseOrder'),
                iconName: 'mdi-plus',
                tintColor: 'info',
                action: () => {
                  addOrder(params.data)
                }
              },
              {
                title: root.$t('common.action.view'),
                iconName: 'mdi-eye-outline',
                tintColor: 'info',
                action: () => {
                  viewTask(params.data)
                }
              },
              {
                title: root.$t('common.action.update'),
                iconName: 'mdi-pencil-outline',
                tintColor: 'orange',
                action: () => {
                  editTask(params.data)
                }
              },
              {
                title: root.$t('common.action.delete'),
                iconName: 'mdi-trash-can-outline',
                tintColor: 'error',
                action: () => {
                  deleteTask(params.data)
                }
              }
            ]
            return { actions }
          }
        }
      }
    ]

    return {
      loading: tableLoading,
      refresh: tableRefresh,
      params: toRef(state, 'params'),
      agGridTable,
      tableColumns: toRef(state, 'tableColumns'),
      tableRows: toRef(state, 'tableRows'),
      pinnedBottomRowData,
      availablePages,
      currentPage,
      getAvailablePercentage,
      onTableCellUpdate
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.tableColumns && this.tableColumns.length > 0) {
        this.refresh()
      } else {
        this.agGridTable.fixColumnSizes()
      }
    })
  }
})
</script>
