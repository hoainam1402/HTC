<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">Users</div>
        <breadcrumbs />
      </div>
      <v-spacer />
      <v-btn v-if="$acl.can('Pages.Administration.Users.Create')" color="primary" @click="createUser">
        Create User
      </v-btn>
    </div>
    <list-filter v-model="params" @filter="filterUser" @reset="resetFilter" />
    <v-card class="mt-3">
      <v-row class="align-center pa-2" dense>
        <v-spacer />
        <v-col cols="6" class="d-flex align-center text-right">
          <app-text-field
            v-model="search"
            placeholder="e.g. filter for email, name, etc"
            class="flex-grow-1 mr-md-2"
            append-icon="mdi-magnify"
            :outlined="false"
            solo
            clearable
            @keyup.enter="searchUser"
          />
          <v-btn :loading="loading" class="ml-2" icon small @click="refresh">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <app-data-table
        :headers="headers"
        :items="users"
        :server-items-length="totalCount"
        :sort-by.sync="sorting.sortBy"
        :sort-desc.sync="sorting.sortDesc"
        :loading="loading"
        item-key="uuid"
        class="flex-grow-1"
        @update:page="onUpdatePage"
        @update:items-per-page="onUpdateItemsPerPage"
        @update:sort-by="onUpdateSort"
        @update:sort-desc="onUpdateSort"
      >
        <template #item.name="{ item }">
          <a class="text-decoration-underline" @click="updateUser(item)">
            <span>{{ item.name }}</span>
          </a>
        </template>
        <template #item.emailAddress="{ item }">
          <div class="caption font-weight-bold ml-1">
            <molecules-copy-label :text="item.emailAddress" />
          </div>
        </template>
        <template #item.roles="{ item }">
          <div>{{ item.roles.map((e) => e.roleName).join(', ') }}</div>
        </template>
        <template #item.creationTime="{ item }">
          <div>{{ item.creationTime | formatDate('DD/MM/YYYY') }}</div>
        </template>
        <template #item.isActive="{ item }">
          <v-icon v-if="item.isActive" color="success" small>mdi-check-circle</v-icon>
          <v-icon v-else small>mdi-circle-outline</v-icon>
        </template>
        <template #item.actions="{ item }">
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
            </template>
            <v-list>
              <v-list-item v-if="$acl.can('Pages.Administration.Users.Edit')" dense @click="updateUser(item)">
                <v-list-item-title>
                  <v-icon dense>mdi-pencil-outline</v-icon>
                  <span class="ml-1">{{ $t('common.action.update') }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="$acl.can('Pages.Administration.Users.Delete')"
                class="error--text"
                dense
                @click="deleteUser(item)"
              >
                <v-list-item-title>
                  <v-icon color="error" dense>mdi-delete-outline</v-icon>
                  <span class="ml-1">{{ $t('common.action.delete') }}</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </app-data-table>
    </v-card>
    <user-create-dialog ref="userCreateDialog" @success="refresh" />
    <user-update-dialog ref="userUpdateDialog" @success="refresh" />
  </div>
</template>

<script>
import { defineComponent, reactive, toRef, useContext, useRoute } from '@nuxtjs/composition-api'
import { useGetUsers } from '@/compositions'
import AppTextField from '~/components/atoms/global/AppTextField'
import Breadcrumbs from '~/components/global/atoms/Breadcrumbs'
import ListFilter from '~/components/user/molecules/ListFilter'
import UserCreateDialog from '~/components/user/organisms/UserCreateDialog'
import UserUpdateDialog from '~/components/user/organisms/UserUpdateDialog'
import AppDataTable from '~/components/atoms/global/AppDataTable'

export default defineComponent({
  components: {
    AppDataTable,
    AppTextField,
    Breadcrumbs,
    ListFilter,
    UserCreateDialog,
    UserUpdateDialog
  },
  setup() {
    const { $api, $snackbar, $dialog } = useContext()
    const route = useRoute()
    const state = reactive({
      params: Object.assign(
        {
          filter: '',
          sorting: 'creationTime asc',
          role: '',
          onlyLockedUsers: false
        },
        route.value.query
      ),
      sorting: {
        sortBy: ['creationTime'],
        sortDesc: [false]
      },
      search: '',
      headers: [
        { text: 'Name', align: 'left', value: 'name' },
        { text: 'Email address', value: 'emailAddress' },
        { text: 'Username', value: 'userName' },
        { text: 'Phone number', value: 'phoneNumber' },
        { text: 'Roles', value: 'roles' },
        { text: 'Creation time', value: 'creationTime' },
        { text: 'Active', value: 'isActive' },
        { text: '', sortable: false, align: 'right', value: 'actions' }
      ]
    })
    const { loading, conditions, refresh, state: listState } = useGetUsers(state.params)

    const filterUser = () => {
      conditions.role = state.params.role
      conditions.onlyLockedUsers = state.params.onlyLockedUsers
    }

    const resetFilter = () => {
      state.params = {
        role: '',
        onlyLockedUsers: false
      }
      conditions.role = state.params.role
      conditions.onlyLockedUsers = state.params.onlyLockedUsers
    }

    const searchUser = () => {
      conditions.filter = state.search
    }

    const onUpdatePage = (val) => {
      conditions.skipCount = (val - 1) * 10
    }

    const onUpdateItemsPerPage = (val) => {
      conditions.maxResultCount = val
    }

    const onUpdateSort = () => {
      if (state.sorting.sortBy[0]) {
        conditions.sorting = `${state.sorting.sortBy[0]} ${state.sorting.sortDesc[0] ? 'desc' : 'asc'}`
      } else {
        conditions.sorting = ''
      }
    }

    const deleteUser = (data) => {
      $dialog
        .confirm({
          text: 'Do you really want to exit?',
          title: 'Warning'
        })
        .then((confirm) => {
          if (confirm) {
            $api.user
              .deleteUser(data.id)
              .then(() => {
                refresh.value()
                $snackbar({
                  message: 'Success',
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
      params: toRef(state, 'params'),
      sorting: toRef(state, 'sorting'),
      search: toRef(state, 'search'),
      headers: toRef(state, 'headers'),
      conditions,
      loading,
      refresh,
      users: toRef(listState, 'items'),
      totalCount: toRef(listState, 'totalCount'),
      filterUser,
      resetFilter,
      searchUser,
      onUpdatePage,
      onUpdateItemsPerPage,
      onUpdateSort,
      deleteUser
    }
  },
  methods: {
    createUser() {
      this.$refs.userCreateDialog.open()
    },
    updateUser(data) {
      this.$refs.userUpdateDialog.open(data)
    }
  }
})
</script>
