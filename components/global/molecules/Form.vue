<template>
  <validation-observer ref="observer" v-slot="scopedSlots">
    <slot v-bind="scopedSlots" :handleReset="handleReset" />
  </validation-observer>
</template>

<script>
import { convertErrorsToVeeValidate } from '@/utils/convert-errors-to-vee-validate'

export default {
  name: 'MoleculesForm',
  created() {
    this.subscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'form/VALIDATION_ERRORS') {
        this.$refs.observer.setErrors(convertErrorsToVeeValidate(state.form.validationErrors))
      }
    })
  },
  beforeDestroy() {
    this.subscribe()
  },
  methods: {
    handleReset() {
      requestAnimationFrame(() => {
        this.$refs.observer.reset()
      })
    }
  }
}
</script>
