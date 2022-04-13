<template>
  <validation-provider v-slot="scopedSlots" :vid="vid" :rules="rules" :name="name || $attrs.label">
    <slot v-bind="scopedSlots" />
  </validation-provider>
</template>

<script>
export default {
  name: 'MoleculesFormItem',
  props: {
    vid: {
      type: String,
      default: ''
    },
    rules: {
      type: [Object, String],
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  }
}
</script>
