<template>
  <v-card>
    <v-card-title>{{ $t('lead.action.manageDocuments') }}</v-card-title>
    <v-card-text>
      <v-file-input v-model="attachment" label="Document" @change="upload" />
      <v-list two-line>
        <template v-for="(item, index) in attachments">
          <v-list-item :key="item.id" dense>
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.creationTime | formatDate('DD/MM/YYYY') }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <div class="d-flex">
                <v-icon color="info" class="mr-1" dense @click="view(item)">mdi-eye-outline</v-icon>
                <v-icon color="error" dense @click="deleteAttachment(item, index)">mdi-delete-outline</v-icon>
              </div>
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="index < attachments.length - 1" :key="index" />
        </template>
      </v-list>
    </v-card-text>
    <document-preview ref="documentPreview" />
  </v-card>
</template>

<script>
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import { cloneDeep } from 'lodash'
import DocumentPreview from '@/components/common/organisms/DocumentPreview'

export default defineComponent({
  name: 'Documents',
  components: {
    DocumentPreview
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
    const attachments = ref(cloneDeep(props.value.attachments))
    const attachment = ref(null)

    const upload = (file) => {
      const formData = new FormData()
      formData.append('formFile', file)
      props.changeHandler(formData).then(({ result }) => {
        attachments.value.push(result)
      })
    }

    const deleteAttachment = (data, idx) => {
      $dialog
        .confirm({
          text: root.$t('lead.message.confirmDeletionDocumentMessage'),
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
                attachments.value.splice(idx, 1)
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
      attachments,
      attachment,
      upload,
      deleteAttachment
    }
  },
  methods: {
    view(data) {
      this.$refs.documentPreview.open(data)
    }
  }
})
</script>
