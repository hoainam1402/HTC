<template>
  <v-row class="mt-2" dense>
    <v-col cols="12">
      <v-card>
        <v-card-title>
          Users and Roles
          <v-spacer />
          <v-btn color="primary" @click="onAddUserRole">{{ $t('usersAndRoles.action.newUsersRole') }}</v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="py-0">
          <app-data-table
            :headers="headers"
            :items="items"
            :loading="fetchState.pending"
            class="flex-grow-1"
            disable-pagination
            hide-default-footer
          >
            <template #item.actions="{ item }">
              <v-btn color="error" text @click="onDeleteUserRole(item)">
                <v-icon color="error" class="mr-1" dense>mdi-delete-outline</v-icon>
                <span>{{ $t('usersAndRoles.action.remove') }}</span>
              </v-btn>
            </template>
          </app-data-table>
        </v-card-text>
        <add-user-role-dialog ref="addUserRoleDialog" @success="fetch" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, useFetch } from '@nuxtjs/composition-api'
import AppDataTable from '~/components/atoms/global/AppDataTable'
import AddUserRoleDialog from '~/components/job/organisms/AddUserRoleDialog'

export default defineComponent({
  components: {
    AppDataTable,
    AddUserRoleDialog
  },
  setup(props, { root }) {
    const { $api, $snackbar, $dialog, params } = useContext()
    const state = reactive({
      items: [],
      headers: [
        { text: root.$t('usersAndRoles.model.name'), value: 'name' },
        { text: root.$t('usersAndRoles.model.emailAddress'), value: 'emailAddress', width: '30%' },
        { text: root.$t('usersAndRoles.model.roles'), value: 'roleName', width: '25%' },
        { text: '', sortable: false, align: 'center', value: 'actions' }
      ]
    })

    const { fetch, fetchState } = useFetch(async () => {
      const { result } = await $api.job.getJobRoles(params.value.id)
      state.items = result
    })

    const addUserRoleDialog = ref(null)
    const onAddUserRole = () => {
      addUserRoleDialog.value.open()
    }

    const onDeleteUserRole = (data) => {
      $dialog
        .confirm({
          text: root.$t('usersAndRoles.message.confirmDeletionMessage'),
          title: root.$t('common.message.confirmDeletionTitle')
        })
        .then((confirm) => {
          if (confirm) {
            $api.job
              .deleteJobRoles(data.jobId, data.userId)
              .then(() => {
                fetch()
                $snackbar({
                  message: root.$t('job.message.successCreate'),
                  color: 'success'
                })
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
      items: toRef(state, 'items'),
      headers: toRef(state, 'headers'),
      fetch,
      fetchState,
      addUserRoleDialog,
      onAddUserRole,
      onDeleteUserRole
    }
  }
})
</script>
