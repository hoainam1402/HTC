<template>
  <v-snackbar v-model="snackbar" :color="color" top right>
    {{ message }}
    <template #action="{ attrs }">
      <v-btn v-bind="attrs" text @click="snackbar = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'AtomsSnackbar',
  data() {
    return {
      snackbar: false,
      message: '',
      color: ''
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'app/SHOW_SNACKBAR') {
        this.message = state.app.snackbar.message
        this.color = state.app.snackbar.color
        this.snackbar = true
      }
    })
  }
}
</script>
