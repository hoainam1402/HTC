<template>
  <ag-grid-vue
    ref="agInstance"
    v-resize="fixColumnSizes"
    class="ag-gird-table ag-theme-alpine"
    :animate-rows="true"
    :default-col-def="defaultColDef"
    :column-defs="columnDefs"
    :row-data="rowData"
    :get-row-class="getRowClass"
    :undo-redo-cell-editing-limit="1"
    :get-row-node-id="getRowNodeId"
    :immutable-data="true"
    :is-external-filter-present="isExternalFilterPresent"
    :does-external-filter-pass="doesExternalFilterPass"
    :pagination="false"
    :context="viewContext"
    :row-selection="'single'"
    :edit-type="editType"
    :single-click-edit="singleClickEdit"
    :pinned-bottom-row-data="pinnedBottomRowData"
    :dom-layout="'autoHeight'"
    :header-height="headerHeight"
    @grid-ready="onGridReady"
    @cellValueChanged="onCellValueChanged"
    @selection-changed="onSelectionChanged"
  />
</template>

<script>
import _ from 'lodash'
import { defineComponent, reactive, ref, toRef, watch } from '@nuxtjs/composition-api'
import { AgGridVue } from 'ag-grid-vue'
import AgProgressBarRenderer from '~/components/global/atoms/AgProgressBarRenderer'
import AgGroupableCellRenderer from '~/components/global/atoms/AgGroupableCellRenderer'
import AgDatePickerEditor from '~/components/global/atoms/AgDatePickerEditor'
import AgUserAutocompleteEditor from '~/components/global/atoms/AgUserAutocompleteEditor'
import AgSelectEditor from '~/components/global/atoms/AgSelectEditor'
import AgTextFieldEditor from '~/components/global/atoms/AgTextFieldEditor'
import AgTextRenderer from '~/components/global/atoms/AgTextRenderer'
import AgActionCellRenderer from '~/components/global/atoms/AgActionCellRenderer'
import AgTaxEditor from '~/components/global/atoms/AgTaxEditor'
import {
  AG_GRID_FIELD_CHILDS_COUNT,
  AG_GRID_FIELD_IS_COLLAPSED,
  AG_GRID_FIELD_ORDERING_INDICATOR,
  AG_GRID_FIELD_PARENT_DETAILS,
  AG_GRID_FIELD_PARENT_ID
} from '@/utils/constants'

const mapColumns = (columns, groupedBy) => {
  // handle grouping
  if (typeof groupedBy !== 'string') {
    return columns
  }
  const firstField = columns.length > 0 ? columns[0] : null
  if (!firstField) return columns
  firstField.cellRendererFramework = 'groupableCellRenderer'
  return columns
}

const mapRows = (rows, groupedBy, indicatorBy, snapshot) => {
  if (typeof groupedBy !== 'string') {
    return rows
  }

  const results = []
  _.forEach(rows, (row, parentIndex) => {
    const hasChilds = row[groupedBy] && typeof row[groupedBy] === 'object'
    const rowSnapshot = _.find(snapshot, (item) => item.id === row.id)
    if (rowSnapshot && typeof rowSnapshot[AG_GRID_FIELD_IS_COLLAPSED] === 'boolean') {
      row[AG_GRID_FIELD_IS_COLLAPSED] = rowSnapshot[AG_GRID_FIELD_IS_COLLAPSED]
    } else {
      row[AG_GRID_FIELD_IS_COLLAPSED] = row[AG_GRID_FIELD_IS_COLLAPSED] || true
    }
    row[AG_GRID_FIELD_CHILDS_COUNT] = (row[groupedBy] || []).length
    if (typeof indicatorBy === 'string' && indicatorBy.length > 0) {
      row[AG_GRID_FIELD_ORDERING_INDICATOR] = `${row[indicatorBy]}.`
    } else {
      row[AG_GRID_FIELD_ORDERING_INDICATOR] = `${parentIndex + 1}.`
    }
    results.push(row)

    const cleanedParentItem = _.clone(row)
    delete cleanedParentItem[groupedBy]

    if (hasChilds) {
      _.forEach(row[groupedBy], (childItem, childIndex) => {
        childItem[AG_GRID_FIELD_PARENT_ID] = cleanedParentItem.id
        childItem[AG_GRID_FIELD_PARENT_DETAILS] = cleanedParentItem
        if (typeof indicatorBy === 'string' && indicatorBy.length > 0) {
          childItem[AG_GRID_FIELD_ORDERING_INDICATOR] = `${row[indicatorBy]}.${childItem[indicatorBy]}.`
        } else {
          childItem[AG_GRID_FIELD_ORDERING_INDICATOR] = `${parentIndex + 1}.${childIndex + 1}.`
        }
        if (row.job && !childItem.job) {
          childItem.job = row.job
        }
        results.push(childItem)
      })
    }
  })
  return results
}

export default defineComponent({
  components: {
    AgGridVue,
    // eslint-disable-next-line
    agProgressBarRenderer: AgProgressBarRenderer,
    // eslint-disable-next-line
    agDatePickerEditor: AgDatePickerEditor,
    // eslint-disable-next-line
    agUserAutocompleteEditor: AgUserAutocompleteEditor,
    // eslint-disable-next-line
    agSelectEditor: AgSelectEditor,
    // eslint-disable-next-line
    agTextFieldEditor: AgTextFieldEditor,
    // eslint-disable-next-line
    agActionCellRenderer: AgActionCellRenderer,
    // eslint-disable-next-line
    agTaxEditor: AgTaxEditor,
    // eslint-disable-next-line
    agTextRenderer: AgTextRenderer,
    // eslint-disable-next-line
    groupableCellRenderer: AgGroupableCellRenderer
  },
  props: {
    columns: {
      type: Array,
      required: true
    },
    rows: {
      type: Array,
      required: true
    },
    // More documentation: https://www.ag-grid.com/vue-data-grid/grid-properties/
    editType: {
      type: String,
      default: () => ''
    },
    singleClickEdit: {
      type: Boolean,
      default: () => false
    },
    groupedBy: {
      type: String,
      default: () => null
    },
    indicatorBy: {
      type: String,
      default: () => null
    },
    pinnedBottomRowData: {
      type: Array,
      default: () => []
    },
    /**
     * onCellUpdate(params, next) -> Bool
     * @param params cell data
     * @param next next(data) data need to update to current row, next(null) to undo changes
     */
    onCellUpdate: {
      type: Function,
      default: () => null
    },
    // More documentation: https://www.ag-grid.com/vue-data-grid/grid-interface/
    headerHeight: {
      type: Number,
      default: null
    }
  },
  setup(props, { emit, root }) {
    const agInstance = ref(null)
    const currentEditingRowId = ref(null)
    const state = reactive({
      gridApi: null,
      viewContext: {
        componentParent: root
      },
      defaultColDef: {
        resizable: true,
        suppressSizeToFit: false
      },
      columnDefs: [],
      rowData: []
    })

    watch(props, (newProps) => {
      state.columnDefs = mapColumns(newProps.columns, props.groupedBy)
      state.rowData = mapRows(
        newProps.rows,
        props.groupedBy,
        props.indicatorBy,
        JSON.parse(JSON.stringify(state.rowData))
      )
      if (state.gridApi) {
        state.gridApi.sizeColumnsToFit()

        // auto scroll to last updated row position
        if (currentEditingRowId.value) {
          const rowNode = state.gridApi.getRowNode(currentEditingRowId.value)
          if (!rowNode) return
          state.gridApi.ensureIndexVisible(rowNode.rowIndex, null)
        }
      }
    })

    const getRowClass = () => {
      return null
    }

    const getRowNodeId = (data) => {
      return data.id || data._id
    }

    const onGridReady = (params) => {
      state.gridApi = params.api
      emit('onReady', state.gridApi)
    }

    const onCellValueChanged = (params) => {
      if (typeof props.onCellUpdate !== 'function') return

      currentEditingRowId.value = params.node.id
      props.onCellUpdate(params, (newValue) => {
        const rowNode = state.gridApi.getRowNode(getRowNodeId(params.data))
        if (!rowNode) return

        // update new value
        if (newValue && typeof newValue === 'object') {
          rowNode.setData(Object.assign(params.data || {}, newValue))
        }
        // update to existing value
        else if (params.data && typeof params.data === 'object') {
          const data = params.data
          data[params.colDef.field] = params.oldValue
          rowNode.setData(data)
        }
      })
    }

    const onSelectionChanged = (params) => {
      const selectedRows = params.api.getSelectedRows()

      // current supported single selection only
      if (selectedRows.length !== 1) return

      const rowNode = params.api.getRowNode(getRowNodeId(selectedRows[0]))
      currentEditingRowId.value = rowNode.id
    }

    const isExternalFilterPresent = () => {
      return typeof props.groupedBy === 'string' && props.groupedBy.length
    }

    const doesExternalFilterPass = (params) => {
      if (typeof params.data[AG_GRID_FIELD_PARENT_ID] === 'string') {
        const parentNode = state.gridApi.getRowNode(params.data[AG_GRID_FIELD_PARENT_ID])
        if (!parentNode) return true

        const isCollapsed = parentNode.data[AG_GRID_FIELD_IS_COLLAPSED] === true
        return !isCollapsed
      }
      return true
    }

    return {
      agInstance,
      currentEditingRowId,
      viewContext: toRef(state, 'viewContext'),
      gridApi: toRef(state, 'gridApi'),
      defaultColDef: toRef(state, 'defaultColDef'),
      columnDefs: toRef(state, 'columnDefs'),
      rowData: toRef(state, 'rowData'),
      onGridReady,
      onCellValueChanged,
      onSelectionChanged,
      getRowClass,
      getRowNodeId,
      isExternalFilterPresent,
      doesExternalFilterPass
    }
  },
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.fixColumnSizes()
      })
    }, 1500)
  },
  methods: {
    getGridApi() {
      return this.gridApi
    },
    setCurrentEditingRowId(rowId) {
      this.currentEditingRowId = rowId
    },
    fixColumnSizes() {
      if (!this.gridApi) return
      this.gridApi.sizeColumnsToFit()
    }
  }
})
</script>

<!--suppress CssUnknownTarget -->
<style lang="scss">
.ag-cell {
  border: none;
}
.ag-gird-table {
  font-family: 'Quicksand', sans-serif;
  // styling table
  .ag-root-wrapper {
    border: none;
  }
  // styling headers
  .ag-header {
    background: none;
  }
  .ag-header-cell-text {
    color: #000;
    font-weight: bold;
  }
  // styling rows
  .custom-row-child {
    border-width: 0;
  }
  .custom-row-parent {
    border-right: none;
    border-left: none;
    background-color: #fff;
  }
}

.ag-header-cell-label .ag-header-cell-text {
  white-space: normal !important;
}
</style>
