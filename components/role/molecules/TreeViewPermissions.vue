<template>
  <v-treeview
    v-model="model"
    item-text="displayName"
    item-value="name"
    :items="permissionsTree"
    selection-type="independent"
    dense
    selectable
  />
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import transformToTree from '~/utils/transform-to-tree'

export default defineComponent({
  name: 'PermissionTree',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    permissions: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const model = computed({
      get: () => props.value,
      set: (val) => {
        return emit('input', val)
      }
    })

    const permissionsTree = computed(() => {
      const items = transformToTree(props.permissions)
      return items.length > 0 ? items[0].children : []
    })

    return {
      model,
      permissionsTree
    }
  }
})
</script>
