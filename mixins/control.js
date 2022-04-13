export default {
  name: 'ControlMixin',
  props: {
    value: {
      type: [String, Number, Boolean, Array, Object, File],
      default: null
    },
    vid: {
      type: String,
      default: ''
    },
    rules: {
      type: [Object, String],
      default: null
    },
    name: {
      type: String,
      default: ''
    },
    dense: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    innerValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    isRequired() {
      return !!this.$attrs.label && this.rules && this.rules.split('|').includes('required')
    }
  }
}
