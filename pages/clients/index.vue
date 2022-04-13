<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">{{ $t('menu.clients') }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
      <v-btn color="primary" :to="{ name: 'clients-create' }">{{ $t('client.action.createClient') }}</v-btn>
    </div>
    <list-filter v-model="params" @filter="filterClient" @reset="resetFilter" />
    <v-card class="mt-3">
      <v-row class="align-center pa-2" dense>
        <v-spacer />
        <v-col cols="6" class="d-flex align-center text-right">
          <app-text-field
            v-model="search"
            :placeholder="$t('client.message.searchHint')"
            class="flex-grow-1 mr-md-2"
            append-icon="mdi-magnify"
            :outlined="false"
            solo
            clearable
            @keyup.enter="searchClient"
          />
          <v-btn :loading="loading" class="ml-2" icon small @click="refresh">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <app-data-table
        :headers="headers"
        :items="clients"
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
          <nuxt-link :to="{ name: 'clients-edit-id', params: { id: item.id } }" class="text-decoration-underline">
            {{ item.name }}
          </nuxt-link>
        </template>
        <template #item.customerType="{ value }">
          <span>{{ value | mapType(clientTypes) }}</span>
        </template>
        <template #item.actions="{ item }">
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn v-bind="attrs" icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item :to="{ name: 'clients-edit-id', params: { id: item.id } }" dense>
                <v-list-item-title>
                  <v-icon dense>mdi-pencil-outline</v-icon>
                  <span class="ml-1">{{ $t('common.action.update') }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="error--text" dense @click="deleteClient(item)">
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
  </div>
</template>

<script>
import { defineComponent, reactive, toRef, useContext, useRoute } from '@nuxtjs/composition-api'
import { useGetClients } from '@/compositions'
import AppTextField from '~/components/atoms/global/AppTextField'
import Breadcrumbs from '~/components/global/atoms/Breadcrumbs'
import ListFilter from '~/components/client/molecules/ListFilter'
import AppDataTable from '~/components/atoms/global/AppDataTable'

export default defineComponent({
  components: {
    AppDataTable,
    AppTextField,
    Breadcrumbs,
    ListFilter
  },
  setup(props, { root }) {
    const { $api, $snackbar, $dialog } = useContext()
    const route = useRoute()
    const state = reactive({
      params: Object.assign(
        {
          filter: '',
          sorting: 'creationTime asc',
          type: ''
        },
        route.value.query
      ),
      sorting: {
        sortBy: ['creationTime'],
        sortDesc: [false]
      },
      search: '',
      headers: [
        { text: root.$t('client.model.name'), value: 'name' },
        { text: root.$t('client.model.customerType'), value: 'customerType' },
        { text: root.$t('common.model.email'), value: 'emailAddress' },
        { text: root.$t('common.model.phone'), value: 'phoneNumber' },
        { text: root.$t('common.model.mobile'), value: 'mobilePhone' },
        { text: '', value: 'actions', align: 'right', sortable: false }
      ]
    })
    const { loading, conditions, refresh, state: listState } = useGetClients(state.params)

    const filterClient = () => {
      conditions.type = state.params.type
    }

    const resetFilter = () => {
      state.params = {
        type: ''
      }
      conditions.type = state.params.type
    }

    const searchClient = () => {
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

    const deleteClient = (data) => {
      $dialog
        .confirm({
          text: root.$t('client.message.confirmDeletionMessage'),
          title: root.$t('common.message.confirmDeletionTitle')
        })
        .then((confirm) => {
          if (confirm) {
            $api.client
              .deleteClient(data.id)
              .then(() => {
                refresh.value()
                $snackbar({
                  message: root.$t('client.message.successCreate'),
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
      clients: toRef(listState, 'items'),
      totalCount: toRef(listState, 'totalCount'),
      filterClient,
      resetFilter,
      searchClient,
      onUpdatePage,
      onUpdateItemsPerPage,
      onUpdateSort,
      deleteClient
    }
  },
  async asyncData({ $api }) {
    const { result: clientTypesResult } = await $api.client.getClientTypes()

    return {
      clientTypes: clientTypesResult
    }
  }
})
</script>
