<template>
  <validation-provider v-slot="{ errors }" :vid="vid" :rules="rules" :name="name || $attrs.label">
    <v-checkbox
      v-model="innerValue"
      v-bind="$attrs"
      :error-messages="errors"
      :hide-details="errors.length === 0 && !!!$attrs.hint"
      :dense="dense"
    >
      <template v-if="!!$attrs.label" slot="label">
        {{ $attrs.label }}
        <span v-if="isRequired" class="red--text">*</span>
      </template>
      <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
    </v-checkbox>
  </validation-provider>
</template>

<script>
import ControlMixin from '@/mixins/control'

export default {
  name: 'AppCheckbox',
  mixins: [ControlMixin]
}
</script>
