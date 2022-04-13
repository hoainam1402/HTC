<template>
  <v-card :height="height">
    <v-card-title>{{ $t('job.model.workLocation') }}</v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12" sm="12"></v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    value: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  setup(props, { emit }) {
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    return {
      form
    }
  }
})
</script>
