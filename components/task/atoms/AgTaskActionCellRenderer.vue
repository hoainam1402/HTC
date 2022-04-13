<template>
  <div v-if="actions.length" style="width: 100%; text-align: right">
    <v-menu offset-y>
      <template #activator="{ on, attrs }">
        <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
      </template>
      <v-list>
        <v-list-item v-for="action in actions" :key="action.key" dense @click="action.action">
          <v-list-item-title>
            <v-icon class="mr-1" dense>{{ action.iconName }}</v-icon>
            {{ action.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
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
