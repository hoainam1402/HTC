<template>
  <v-tooltip bottom>
    <template #activator="{ on }">
      <div ref="copylabel" class="copylabel animate__faster" v-on="on" @click.stop.prevent="copy">{{ text }}</div>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'MoleculesCopyLabel',
  props: {
    text: {
      type: String,
      default: ''
    },
    toastText: {
      type: String,
      default: 'Copied to clipboard!'
    }
  },
  data() {
    return {
      tooltip: 'Copy',
      timeout: null
    }
  },
  beforeDestroy() {
    if (this.timeout) clearTimeout(this.timeout)
  },
  methods: {
    copy() {
      this.$clipboard(this.text, this.toastText)
      this.tooltip = 'Copied!'

      this.timeout = setTimeout(() => {
        this.tooltip = 'Copy'
      }, 2000)
    }
  }
}
</script>

<style scoped>
.copylabel {
  display: inline-block;
  border-bottom: 1px dashed;
  cursor: pointer;
}
</style>
