<template>
  <validation-provider v-slot="{ errors }" :vid="vid" :rules="rules" :name="name || $attrs.label">
    <v-autocomplete
      v-model="innerValue"
      v-bind="$attrs"
      :error-messages="errors"
      :item-text="itemText"
      :item-value="itemValue"
      :items="items"
      :hide-details="errors.length === 0 && !!!$attrs.hint"
      :search-input.sync="search"
      :clearable="clearable"
      :dense="dense"
      :outlined="outlined"
      @update:search-input="handleSearch"
    >
      <template v-if="!!$attrs.label" slot="label">
        {{ $attrs.label }}
        <span v-if="isRequired" class="red--text">*</span>
      </template>
      <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
    </v-autocomplete>
  </validation-provider>
</template>

<script>
import ControlMixin from '@/mixins/control'

export default {
  name: 'AppAutocomplete',
  mixins: [ControlMixin],
  props: {
    items: {
      type: Array,
      default: () => []
    },
    itemText: {
      type: String,
      default: 'name'
    },
    itemValue: {
      type: String,
      default: 'id'
    },
    searchInput: {
      type: String,
      default: null
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    search: {
      get() {
        return this.searchInput
      },
      set(val) {
        this.$emit('update:search-input', val)
      }
    }
  },
  methods: {
    handleSearch(val) {
      this.$emit('search-input', val)
    }
  }
}
</script>
