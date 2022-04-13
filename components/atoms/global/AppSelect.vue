<template>
  <validation-provider v-slot="{ errors }" :vid="vid" :rules="rules" :name="name || $attrs.label">
    <v-select
      v-model="innerValue"
      v-bind="$attrs"
      :error-messages="errors"
      :item-text="itemText"
      :item-value="itemValue"
      :items="items"
      :hide-details="errors.length === 0 && !!!$attrs.hint"
      :dense="dense"
      :outlined="outlined"
    >
      <template v-if="!!$attrs.label" slot="label">
        {{ $attrs.label }}
        <span v-if="isRequired" class="red--text">*</span>
      </template>
      <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
    </v-select>
  </validation-provider>
</template>

<script>
import ControlMixin from '@/mixins/control'

export default {
  name: 'AppSelect',
  mixins: [ControlMixin],
  props: {
    items: {
      type: Array,
      default: () => []
    },
    itemText: {
      type: String,
      default: 'value'
    },
    itemValue: {
      type: String,
      default: 'key'
    }
  }
}
</script>
