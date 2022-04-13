<template>
  <v-navigation-drawer v-model="rightMenu" :width="width" absolute stateless temporary right>
    <portal-target name="right-drawer" />
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'RightDrawer',
  data() {
    return {
      rightMenu: false,
      width: 400
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'app/SHOW_RIGHT_MENU') {
        this.width = state.app.rightMenu?.width || 400
        this.rightMenu = true
      }
      if (mutation.type === 'app/HIDE_RIGHT_MENU') {
        this.width = state.app.rightMenu.width
        this.rightMenu = false
      }
    })
  }
}
</script>
