<template>
  <v-card>
    <v-card-title>{{ $t('lead.model.notes') }}</v-card-title>
    <v-card-text>
      <app-textarea v-if="isCreate" v-model="note" :loading="loading" rows="1" @blur="submit" />
      <v-btn v-else color="primary" block @click="isCreate = true">Create note</v-btn>
      <v-list two-line>
        <template v-for="(item, index) in notes">
          <v-list-item :key="item.id" dense>
            <v-list-item-content>
              <v-list-item-title>{{ item.content }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.creationTime | formatDate('DD/MM/YYYY') }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon color="error" dense @click="deleteNote(item, index)">mdi-delete-outline</v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="index < notes.length - 1" :key="index" />
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import { cloneDeep } from 'lodash'
import AppTextarea from '~/components/atoms/global/AppTextarea'

export default defineComponent({
  name: 'Notes',
  components: {
    AppTextarea
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    changeHandler: {
      type: Function,
      default: () => {}
    },
    deleteHandler: {
      type: Function,
      default: () => {}
    }
  },
  setup(props, { root }) {
    const { $dialog, $snackbar } = useContext()
    const loading = ref(false)
    const isCreate = ref(false)
    const notes = ref(cloneDeep(props.value.notes))
    const note = ref(null)

    const submit = () => {
      if (note.value) {
        loading.value = true
        props
          .changeHandler({
            content: note.value
          })
          .then(({ result }) => {
            notes.value.push(result)
            note.value = null
            isCreate.value = false
          })
          .catch(() => {
            this.$snackbar({
              message: this.$t('common.message.somethingWentWrong'),
              color: 'error'
            })
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        isCreate.value = false
      }
    }

    const deleteNote = (data, idx) => {
      $dialog
        .confirm({
          text: root.$t('lead.message.confirmDeletionNoteMessage'),
          title: root.$t('common.message.confirmDeletionTitle')
        })
        .then((confirm) => {
          if (confirm) {
            props
              .deleteHandler(data)
              .then(() => {
                $snackbar({
                  message: root.$t('lead.message.successDeleteNote'),
                  color: 'success'
                })
                notes.value.splice(idx, 1)
              })
              .catch(() => {
                this.$snackbar({
                  message: this.$t('common.message.somethingWentWrong'),
                  color: 'error'
                })
              })
          }
        })
    }

    return {
      loading,
      isCreate,
      notes,
      note,
      submit,
      deleteNote
    }
  }
})
</script>
