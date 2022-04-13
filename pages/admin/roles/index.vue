<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">{{ $t('menu.roles') }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
      <v-btn v-if="$acl.can('Pages.Administration.Roles.Create')" color="primary" @click="updateRole">
        {{ $t('role.action.createRole') }}
      </v-btn>
    </div>
    <v-card>
      <v-row class="align-center pa-2" dense>
        <v-spacer />
        <v-col cols="12" class="d-flex align-center justify-end">
          <v-btn :loading="loading" icon small @click="refresh">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <app-data-table
        :headers="headers"
        :items="roles"
        :search="search"
        :loading="loading"
        disable-pagination
        hide-default-footer
        item-key="uuid"
        class="flex-grow-1"
      >
        <template #item.displayName="{ item }">
          <a class="text-decoration-underline" @click="updateRole(item)">
            <span>{{ item.displayName }}</span>
          </a>
        </template>
        <template #item.isDefault="{ item }">
          <v-icon v-if="item.isDefault" color="success" small>mdi-check-circle</v-icon>
          <v-icon v-else small>mdi-circle-outline</v-icon>
        </template>
        <template #item.creationTime="{ item }">
          <div>{{ item.creationTime | formatDate('DD/MM/YYYY') }}</div>
        </template>
        <template #item.actions="{ item }">
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
            </template>
            <v-list>
              <v-list-item v-if="$acl.can('Pages.Administration.Roles.Edit')" dense @click="updateRole(item)">
                <v-list-item-title>
                  <v-icon dense>mdi-pencil-outline</v-icon>
                  {{ $t('common.action.update') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="!item.isDefault && $acl.can('Pages.Administration.Roles.Delete')"
                class="error--text"
                dense
                @click="deleteRole(item)"
              >
                <v-list-item-title>
                  <v-icon color="error" dense>mdi-delete-outline</v-icon>
                  {{ $t('common.action.delete') }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </app-data-table>
    </v-card>
    <role-update-dialog ref="roleUpdateDialog" @success="refresh"></role-update-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive, toRef, useContext, useRoute } from '@nuxtjs/composition-api'
import { useGetRoles } from '@/compositions'
import Breadcrumbs from '~/components/global/atoms/Breadcrumbs'
import RoleUpdateDialog from '~/components/role/organisms/RoleUpdateDialog'
import AppDataTable from '~/components/atoms/global/AppDataTable'

export default defineComponent({
  components: {
    AppDataTable,
    Breadcrumbs,
    RoleUpdateDialog
  },
  setup(_, { root }) {
    const { $api, $snackbar, $dialog } = useContext()
    const route = useRoute()
    const state = reactive({
      params: Object.assign({}, route.value.query),
      search: '',
      headers: [
        { text: root.$t('role.model.name'), align: 'left', value: 'displayName' },
        { text: root.$t('role.model.isDefault'), align: 'center', value: 'isDefault' },
        { text: root.$t('common.model.creationTime'), align: 'left', value: 'creationTime' },
        { text: '', sortable: false, align: 'right', value: 'actions' }
      ]
    })
    const { conditions, loading, refresh, state: listState } = useGetRoles(state.filter)

    const deleteRole = (data) => {
      $dialog
        .confirm({
          text: root.$t('role.message.confirmDeletionMessage'),
          title: root.$t('common.message.confirmDeletionTitle')
        })
        .then((confirm) => {
          if (confirm) {
            $api.role
              .deleteRole(data.id)
              .then(() => {
                refresh.value()
                $snackbar({
                  message: root.$t('role.message.successDelete'),
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
        .catch(() => {
          this.$snackbar({
            message: this.$t('common.message.somethingWentWrong'),
            color: 'error'
          })
        })
    }

    return {
      params: toRef(state, 'params'),
      search: toRef(state, 'search'),
      headers: toRef(state, 'headers'),
      conditions,
      loading,
      refresh,
      roles: toRef(listState, 'items'),
      deleteRole
    }
  },
  methods: {
    updateRole(role) {
      this.$refs.roleUpdateDialog.open(role)
    }
  }
})
</script>
