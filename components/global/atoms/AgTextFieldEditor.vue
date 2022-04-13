<template>
  <v-text-field
    ref="vTextField"
    v-model="value"
    :type="inputType"
    :rules="rules"
    persistent-hint
    solo
    flat
    dense
    class="elevation-0"
    @focus="$event.target.select()"
  />
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

const parseFloatOrZero = (input) => {
  const value = parseFloat(input)
  if (isNaN(value)) return 0.0
  return value
}

export default defineComponent({
  data() {
    return {
      value: null,
      inputType: 'text',
      maxNumber: null
    }
  },
  computed: {
    rules() {
      if (typeof this.maxNumber === 'number') {
        return [
          (v) =>
            !v ||
            (!!v && parseFloatOrZero(v) <= this.maxNumber) ||
            this.$t('validations.max_value', {
              _field_: 'field',
              max: this.maxNumber
            })
        ]
      }
      return []
    }
  },
  mounted() {
    this.value = this.params.value
    if (typeof this.params.type === 'string') {
      this.inputType = this.params.type
    }
    if (typeof this.params.maxNumber === 'number') {
      this.maxNumber = this.params.maxNumber
    }

    this.$nextTick(() => {
      this.$refs.vTextField.focus()
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
