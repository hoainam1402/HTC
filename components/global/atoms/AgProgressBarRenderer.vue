<template>
  <v-progress-linear v-if="params.value !== undefined" :color="colorName" height="22" :value="value" class="mt-1">
    <template #default="{ value: percent }">
      <strong>{{ Math.ceil(percent) }}%</strong>
    </template>
  </v-progress-linear>
</template>

<script>
export default {
  computed: {
    value() {
      const paramsValue = (this.params || {}).value
      if (typeof paramsValue === 'number') {
        return paramsValue
      }
      if (typeof paramsValue === 'string') {
        try {
          return parseFloat(paramsValue)
        } catch (exception) {
          window.console.error(exception)
          return 0.0
        }
      }
      return null
    },
    colorName() {
      const value = this.value
      if (typeof value !== 'number') {
        return 'secondary'
      }
      if (value > 0 && value < 100) {
        return 'orange'
      }
      if (value >= 100) {
        return 'success'
      }
      return 'secondary'
    }
  }
}
</script>
