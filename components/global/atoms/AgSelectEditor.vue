<template>
  <v-select
    ref="vSelect"
    v-model="value"
    :items="items"
    :item-text="itemText"
    :item-value="itemValue"
    hide-no-data
    persistent-hint
    hide-details
    solo
    dense
  />
</template>

<script>
import _ from 'lodash'
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    itemText: {
      type: String,
      default: 'value'
    },
    itemValue: {
      type: String,
      default: 'key'
    }
  },
  data() {
    return {
      value: null,
      items: []
    }
  },
  mounted() {
    if (this.params.value) {
      this.items = [_.cloneDeep(this.params.value)]
    }

    this.value = this.params.value
    this.items = this.params.values

    this.$nextTick(() => {
      this.$refs.vSelect.focus()
      this.$refs.vSelect.activateMenu()
    })
  },
  methods: {
    getValue() {
      return this.value
    },
    isCancelBeforeStart() {
      return false
    },
    isCancelAfterEnd() {
      // editor will reject any value is null
      return !this.value
    }
  }
})
</script>
