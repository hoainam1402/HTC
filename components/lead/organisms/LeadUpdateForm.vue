<template>
  <v-row dense>
    <v-col cols="12" sm="6">
      <v-row dense>
        <v-col cols="12" class="pt-0">
          <v-card>
            <v-card-title>{{ $t('lead.action.viewDetail') }}</v-card-title>
            <v-card-text>
              <lead-details v-model="form" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title>{{ $t('lead.action.clientDetails') }}</v-card-title>
            <v-card-text>
              <client-details v-model="form" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <client-project v-model="form" @success="$emit('success')" />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" sm="6">
      <v-row dense>
        <v-col cols="12" class="pt-0">
          <v-card>
            <v-card-title>{{ $t('lead.action.projectScope') }}</v-card-title>
            <v-card-text>
              <project-scope v-model="form" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <notes v-model="form" :change-handler="noteChangeHandler" :delete-handler="noteDeleteHandler" />
        </v-col>
        <v-col cols="12">
          <documents v-model="form" :change-handler="documentChangeHandler" :delete-handler="documentDeleteHandler" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import LeadDetails from '~/components/lead/molecules/LeadDetails'
import ProjectScope from '~/components/lead/molecules/ProjectScope'
import ClientDetails from '~/components/lead/molecules/ClientDetails'
import ClientProject from '~/components/lead/molecules/ClientProject'
import Notes from '~/components/common/organisms/Notes'
import Documents from '~/components/common/organisms/Documents'

export default defineComponent({
  name: 'LeadForm',
  components: {
    LeadDetails,
    ProjectScope,
    ClientDetails,
    ClientProject,
    Notes,
    Documents
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const { $api, params } = useContext()
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    const noteChangeHandler = async (data) => {
      return await $api.lead.createNote(params.value.id, data)
    }
    const noteDeleteHandler = async (data) => {
      return await $api.lead.deleteNote(data.id)
    }

    const documentChangeHandler = async (data) => {
      return await $api.lead.createAttachment(params.value.id, data)
    }
    const documentDeleteHandler = async (data) => {
      return await $api.lead.deleteAttachment(data.id)
    }

    return {
      form,
      noteChangeHandler,
      noteDeleteHandler,
      documentChangeHandler,
      documentDeleteHandler
    }
  }
})
</script>
