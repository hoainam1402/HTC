<template>
  <nuxt />
</template>

<script>
export default {
  middleware({ redirect }) {
    return redirect('/workspace')
  }
}
</script>
