<template>
  <v-overlay v-model="loading" opacity="0.8" z-index="10">
    <v-progress-circular size="64" indeterminate />
  </v-overlay>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'AtomsLoading',
  setup() {
    const loading = ref(false)

    const start = () => {
      loading.value = true
    }
    const finish = () => {
      loading.value = false
    }

    return {
      loading,
      start,
      finish
    }
  }
})
</script>
