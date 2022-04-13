<template>
  <v-card>
    <v-card-title>{{ $t('lead.action.clientProject') }}</v-card-title>
    <v-card-text v-if="form.isPublished">
      <div class="text-body-2">{{ $t('lead.message.successPublished') }}</div>
    </v-card-text>
    <v-card-text v-else>
      <div class="text-body-2">
        {{ $t('lead.message.publishProjectHint') }}
      </div>
      <v-btn :loading="loading" color="success" class="mt-2" block @click="publishProject">
        {{ $t('lead.action.publishProject') }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { computed, defineComponent, ref, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ClientProject',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  setup(props, { root, emit }) {
    const { $api, $dialog, $snackbar } = useContext()
    const loading = ref(false)
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    const publishProject = () => {
      $dialog
        .confirm({
          text: root.$t('lead.message.confirmPublishMessage'),
          title: root.$t('common.message.confirmDeletionTitle')
        })
        .then(async (confirm) => {
          if (confirm) {
            try {
              await $api.lead.publishProject(form.value.id)
              emit('success')
              $snackbar({
                message: root.$t('lead.message.successPublish'),
                color: 'success'
              })
            } catch (e) {
              this.$snackbar({
                message: this.$t('common.message.somethingWentWrong'),
                color: 'error'
              })
              window.console.error(e)
            }
          }
        })
    }

    return {
      loading,
      form,
      publishProject
    }
  }
})
</script>
