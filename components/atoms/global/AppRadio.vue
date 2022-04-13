<template>
  <validation-provider v-slot="{ errors }" :vid="vid" :rules="rules" :name="name || $attrs.label">
    <v-radio-group
      v-model="innerValue"
      v-bind="$attrs"
      :error-messages="errors"
      :hide-details="errors.length === 0 && !!!$attrs.hint"
      :dense="dense"
      class="pt-0"
    >
      <v-radio v-for="(item, index) in items" :key="index" :value="item[itemValue]" :label="item[itemText]" />
      <template v-if="!!$attrs.label" slot="label">
        {{ $attrs.label }}
        <span v-if="isRequired" class="red--text">*</span>
      </template>
      <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
    </v-radio-group>
  </validation-provider>
</template>

<script>
import ControlMixin from '@/mixins/control'

export default {
  name: 'AppRadio',
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
