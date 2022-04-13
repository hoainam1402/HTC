<template>
  <span class="font-weight-bold">{{ label }}</span>
</template>

<script>
export default {
  name: 'AppLabel',
  props: {
    label: {
      type: String,
      required: true
    }
  }
}
</script>
