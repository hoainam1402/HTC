<template>
  <v-menu
    ref="menu"
    :close-on-content-click="false"
    max-width="290px"
    min-width="290px"
    transition="scale-transition"
    absolute
    allow-overflow
    offset-y
  >
    <template #activator="{ on, attrs }">
      <validation-provider v-slot="{ errors }" :vid="vid" :rules="rules" :name="name || $attrs.label">
        <v-text-field
          :value="innerValue | formatDate('DD/MM/YYYY')"
          v-bind="{ ...attrs, ...$attrs }"
          :error-messages="errors"
          :hide-details="errors.length === 0 && !!!$attrs.hint"
          :clearable="clearable"
          :dense="dense"
          :outlined="outlined"
          readonly
          v-on="on"
        >
          <template slot="append">
            <v-icon v-on="on">mdi-calendar</v-icon>
          </template>
          <template v-if="!!$attrs.label" slot="label">
            {{ $attrs.label }}
            <span v-if="isRequired" class="red--text">*</span>
          </template>
          <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
        </v-text-field>
      </validation-provider>
    </template>
    <v-date-picker :max="maxDate" :min="minDate" no-title @change="save" />
  </v-menu>
</template>

<script>
import ControlMixin from '@/mixins/control'

export default {
  name: 'AppDatePicker',
  mixins: [ControlMixin],
  props: {
    maxDate: {
      type: String,
      default: null
    },
    minDate: {
      type: String,
      default: null
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    save(date) {
      this.innerValue = this.$moment(date).format('YYYY-MM-DD')
      this.$refs.menu.save(date)
    }
  }
}
</script>
