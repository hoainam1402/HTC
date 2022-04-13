<template>
  <v-menu
    v-model="isPickerVisible"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        :value="value | formatDate('DD/MM/YYYY')"
        dense
        hide-details
        readonly
        solo
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="value" :min="minDate" :max="maxDate" @input="onDateSelected"></v-date-picker>
  </v-menu>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  data() {
    return {
      value: null,
      isPickerVisible: false,
      minDate: null,
      maxDate: null
    }
  },
  mounted() {
    if (typeof this.params.value === 'string') {
      this.value = this.$moment(this.params.value, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM-DD')
    } else {
      this.value = null
    }
    this.isPickerVisible = true
    if (typeof this.params.minDate === 'string') {
      this.minDate = this.params.minDate
    }
    if (typeof this.params.maxDate === 'string') {
      this.maxDate = this.params.maxDate
    }
  },
  methods: {
    onDateSelected() {
      this.isPickerVisible = false
    },
    getValue() {
      if (!this.value) {
        return null
      }
      return `${this.value}T00:00:00.00000`
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
