<template>
  <validation-provider
    v-slot="{ errors, invalid }"
    :vid="vid"
    class="d-flex align-center justify-space-between tw-h-full"
  >
    <span>{{ params.value }}</span>
    <v-tooltip v-if="invalid" bottom>
      <template #activator="{ on }">
        <v-icon color="error" small v-on="on">mdi-help-circle-outline</v-icon>
      </template>
      <span>{{ errors[0] }}</span>
    </v-tooltip>
  </validation-provider>
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
    vid() {
      return [`${this.params.vid[0]}[${this.params.rowIndex}]`, this.params.vid[1]].join('.')
    }
  }
}
</script>
