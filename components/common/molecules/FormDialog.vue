<template>
  <v-dialog v-model="dialog" :width="width" scrollable persistent>
    <app-form v-slot="{ handleSubmit }">
      <v-card>
        <v-card-title>
          <slot name="title">
            <span class="text-h5">{{ title }}</span>
          </slot>
        </v-card-title>
        <v-card-text>
          <slot name="content" />
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="canDelete" color="error" @click="$emit('delete')">
            {{ deleteText || $t('common.action.delete') }}
          </v-btn>
          <v-spacer />
          <v-btn :disabled="loading" class="px-2 mr-1" text @click="close">
            {{ discardText || $t('common.action.discard') }}
          </v-btn>
          <v-btn :loading="loading" color="primary" class="px-2" @click="handleSubmit(submit)">
            <span v-if="submitText">{{ submitText }}</span>
            <span v-else>
              {{ isUpdate ? updateText || $t('common.action.update') : createText || $t('common.action.create') }}
            </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </app-form>
  </v-dialog>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import AppForm from '~/components/atoms/global/AppForm'

export default defineComponent({
  name: 'FormDialog',
  components: {
    AppForm
  },
  props: {
    value: Boolean,
    loading: Boolean,
    canDelete: Boolean,
    isUpdate: Boolean,
    width: {
      type: [String, Number],
      default: 'auto'
    },
    title: {
      type: String,
      default: null
    },
    submitText: {
      type: String,
      default: null
    },
    createText: {
      type: String,
      default: null
    },
    updateText: {
      type: String,
      default: null
    },
    deleteText: {
      type: String,
      default: null
    },
    discardText: {
      type: String,
      default: null
    }
  },
  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        return emit('input', val)
      }
    })

    const close = () => {
      dialog.value = false
    }
    const submit = () => {
      emit('submit')
    }

    return {
      dialog,
      close,
      submit
    }
  }
})
</script>
