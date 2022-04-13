<template>
  <div style="width: 100%; text-align: right">
    <v-btn
      v-for="action in actions"
      :key="action.key"
      :icon="!action.title && !!action.iconName"
      :color="action.tintColor || 'secondary'"
      small
      @click="action.action"
    >
      <v-icon v-if="action.iconName" small :class="{ 'mr-1': !!action.title }">{{ action.iconName }}</v-icon>
      <span v-if="action.title">{{ action.title }}</span>
    </v-btn>
  </div>
</template>

<script>
import { v4 as uuid4 } from 'uuid'
import _ from 'lodash'

export default {
  data() {
    return {
      /**
       * Action format:
       * {
       *   action: function,
       *   title: string?,
       *   tintColor: string?,
       *   iconName: string?
       * }
       */
      actions: []
    }
  },
  mounted() {
    const setEditingRowId = ((this.params.context || {}).componentParent || {}).setCurrentEditingRowId
    this.actions = _.map(this.params.actions || [], (item) => {
      const delegate = item.action
      item.key = uuid4().toString()
      item.action = () => {
        if (typeof setEditingRowId === 'function') setEditingRowId(this.params.node.id)
        if (typeof delegate === 'function') delegate()
      }
      return item
    })
  }
}
</script>
