<template>
  <validation-provider v-slot="{ errors }" :vid="vid" :rules="rules" :name="name || $attrs.label">
    <v-text-field
      ref="currencyInput"
      v-model="currencyValue"
      v-currency="currencyOptions"
      v-bind="$attrs"
      :error-messages="errors"
      :hide-details="errors.length === 0 && !!!$attrs.hint"
      :dense="dense"
      :outlined="outlined"
      v-on="$listeners"
    >
      <template v-if="!!$attrs.label" slot="label">
        {{ $attrs.label }}
        <span v-if="isRequired" class="red--text">*</span>
      </template>
      <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
    </v-text-field>
  </validation-provider>
</template>

<script>
import { getValue } from 'vue-currency-input'
import ControlMixin from '@/mixins/control'

export default {
  name: 'AppCurrency',
  mixins: [ControlMixin],
  data() {
    return {
      currencyValue: this.value,
      currencyOptions: {
        currency: 'USD',
        distractionFree: false
      }
    }
  },
  watch: {
    value() {
      this.innerValue = getValue(this.$refs.currencyInput)
    }
  }
}
</script>
