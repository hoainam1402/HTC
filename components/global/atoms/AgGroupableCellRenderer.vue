<template>
  <v-card-actions :class="{ 'pl-4': isParentItem, 'pr-0': !isParentItem }" class="pt-0 pb-0">
    <v-btn :disabled="!isToggleEnabled" class="mr-1" small icon @click="toggleCollapseChilds">
      <v-icon>{{ iconName }}</v-icon>
    </v-btn>
    <span v-if="orderingIndicator" class="mr-1">{{ orderingIndicator }}</span>
    <div :class="{ 'text-right': isPinnedBottomRowData === true }" class="text-truncate">
      <strong v-if="isPinnedBottomRowData" class="title">{{ displayValue }}</strong>
      <span v-else>{{ displayValue }}</span>
    </div>
    <v-spacer></v-spacer>
    <v-tooltip v-if="action" top>
      <template #activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :icon="!action.title && !!action.iconName"
          :color="action.tintColor || 'secondary'"
          small
          v-on="on"
          @click="action.action"
        >
          <v-icon v-if="action.iconName" :class="{ 'mr-1': !!action.title }">{{ action.iconName }}</v-icon>
          <span v-if="action.title">{{ action.title }}</span>
        </v-btn>
      </template>
      <span>{{ action.tooltip || 'Action' }}</span>
    </v-tooltip>
  </v-card-actions>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import {
  AG_GRID_FIELD_CHILDS_COUNT,
  AG_GRID_FIELD_IS_COLLAPSED,
  AG_GRID_FIELD_PARENT_ID,
  AG_GRID_FIELD_ORDERING_INDICATOR
} from '@/utils/constants'

export default defineComponent({
  data() {
    return {
      displayValue: '',
      isToggleEnabled: false,
      isHiddenChilds: false,
      isParentItem: false,
      isPinnedBottomRowData: false,
      action: null
    }
  },
  computed: {
    orderingIndicator() {
      const indicator = this.params.data[AG_GRID_FIELD_ORDERING_INDICATOR]
      if (typeof indicator === 'string' && indicator.length > 0) {
        return indicator
      }
      return null
    },
    iconName() {
      const hasChilds = (this.params.data[AG_GRID_FIELD_CHILDS_COUNT] || 0) > 0
      if (!hasChilds) return ''
      return this.isHiddenChilds ? 'mdi-chevron-right' : 'mdi-chevron-down'
    }
  },
  watch: {
    isHiddenChilds(newValue) {
      const rowNode = this.params.api.getRowNode(this.params.data.id)
      if (!rowNode) return

      const rowData = JSON.parse(JSON.stringify(rowNode.data || {}))
      if (newValue === rowData[AG_GRID_FIELD_IS_COLLAPSED]) return
      rowData[AG_GRID_FIELD_IS_COLLAPSED] = newValue
      this.params.data[AG_GRID_FIELD_IS_COLLAPSED] = newValue
      rowNode.setData(rowData)
      this.params.api.onFilterChanged()
    }
  },
  mounted() {
    const hasParent = typeof this.params.data[AG_GRID_FIELD_PARENT_ID] === 'string'
    const hasChilds = (this.params.data[AG_GRID_FIELD_CHILDS_COUNT] || 0) > 0
    const isCollapsed = this.params.data[AG_GRID_FIELD_IS_COLLAPSED] || false

    this.isParentItem = hasParent
    this.isToggleEnabled = hasChilds
    this.isHiddenChilds = isCollapsed
    this.displayValue = this.params.value
    this.isPinnedBottomRowData = this.params.isPinnedBottomRowData || false
    if (typeof this.params.action === 'object' && this.params.action.constructor.name === 'Object') {
      this.action = this.params.action
    }
  },
  methods: {
    toggleCollapseChilds() {
      this.isHiddenChilds = !this.isHiddenChilds
    }
  }
})
</script>
