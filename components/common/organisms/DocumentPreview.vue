<template>
  <v-dialog v-model="dialog" max-width="80vw" scrollable>
    <v-card>
      <v-card-title>
        <v-spacer />
        <v-icon color="primary" dense @click="dialog = false">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <vue-doc-preview v-if="isOffice || isText" :value="officeConfig.value" :type="officeConfig.type" />
        <div v-else style="display: flex; height: 80vh">
          <div style="flex: 8 0 10px">
            <vue-pdf-app :pdf="pdfConfig.url" :config="pdfConfig" />
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import VueDocPreview from 'vue-doc-preview'
import VuePdfApp from 'vue-pdf-app'
import 'vue-pdf-app/dist/icons/main.css'

export default defineComponent({
  components: {
    VueDocPreview,
    VuePdfApp
  },
  data() {
    return {
      dialog: false,
      data: {
        contentType: ''
      },
      officeConfig: {
        value: '',
        type: 'office'
      },
      pdfConfig: {
        url: ''
      }
    }
  },
  computed: {
    isOffice() {
      return (
        this.data.contentType.match('spreadsheetml.*') ||
        this.data.contentType.match('wordprocessingml.*') ||
        this.data.contentType.match('presentationml.*')
      )
    },
    isText() {
      return this.data.contentType.match('text.*')
    },
    isPdf() {
      return this.data.contentType.match('pdf.*')
    }
  },
  methods: {
    open(data) {
      this.data = data
      this.officeConfig.value = encodeURIComponent(data.url)
      this.officeConfig.type = this.isOffice ? 'office' : 'text'
      this.$axios.$get(`/api/services/app/files/${data.id}/content`, { responseType: 'arraybuffer' }).then((res) => {
        this.pdfConfig.url = res
      })
      this.dialog = true
    }
  }
})
</script>
