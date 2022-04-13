<template>
  <tax-profile v-if="visible" v-model="value" :tax-profile="taxProfile" />
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import TaxProfile from '~/components/job/atoms/TaxProfile'

export default defineComponent({
  components: {
    TaxProfile
  },
  data() {
    return {
      value: null,
      visible: false,
      taxProfile: {
        taxItems: [{}]
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        if (typeof this.params.value === 'function' && val === this.params.value(this.params)) {
          return
        } else if (val === this.params.value) {
          return
        }

        if (typeof this.params.onChange === 'function') {
          this.params.onChange(this.params, val)
        } else {
          this.params.node.data[this.params.colDef.field] = val
        }
      },
      immediate: false,
      deep: false
    }
  },
  mounted() {
    if (typeof this.params.value === 'function') {
      this.value = this.params.value(this.params)
    } else {
      this.value = this.params.value
    }
    this.taxProfile = this.params.taxProfile
    this.visible = true
  },
  methods: {
    getValue() {
      return this.value
    },
    isCancelBeforeStart() {
      return false
    },
    isCancelAfterEnd() {
      return !this.value
    }
  }
})
</script>
