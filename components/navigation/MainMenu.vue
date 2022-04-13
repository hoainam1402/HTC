<template>
  <v-list nav dense>
    <div v-for="(item, index) in menu" :key="index">
      <template v-if="hasAccess(item)">
        <div v-if="item.key || item.text" class="pa-1 mt-2 overline">{{ item.key ? $t(item.key) : item.text }}</div>
        <nav-menu :menu="item.items" />
      </template>
    </div>
  </v-list>
</template>

<script>
import NavMenu from './NavMenu'

export default {
  components: {
    NavMenu
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    hasAccess(item) {
      if (item.permission) {
        return this.$acl.anyPermission(item.permission)
      }

      return false
    }
  }
}
</script>
