<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">{{ $t('menu.leads') }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
      <v-btn color="primary" :to="{ name: 'leads-create' }">{{ $t('lead.action.createLead') }}</v-btn>
    </div>
    <list-filter v-model="params" @filter="filterLeads" @reset="resetFilter" />
    <v-card class="mt-3">
      <v-row class="align-center pa-2" dense>
        <v-spacer />
        <v-col cols="6" class="d-flex align-center text-right">
          <app-text-field
            v-model="search"
            :placeholder="$t('lead.message.searchHint')"
            class="flex-grow-1 mr-md-2"
            append-icon="mdi-magnify"
            :outlined="false"
            solo
            clearable
            @keyup.enter="searchLeads"
          />
          <v-btn :loading="loading" class="ml-2" icon small @click="refresh">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <app-data-table
        :headers="headers"
        :items="leads"
        :server-items-length="totalCount"
        :sort-by.sync="sorting.sortBy"
        :sort-desc.sync="sorting.sortDesc"
        :loading="loading"
        item-key="uuid"
        group-by="stage"
        class="flex-grow-1"
        show-group-by
        @update:page="onUpdatePage"
        @update:items-per-page="onUpdateItemsPerPage"
        @update:sort-by="onUpdateSort"
        @update:sort-desc="onUpdateSort"
      >
        <template #group.header="{ group, items, isOpen, toggle }">
          <td :colspan="headers.length">
            <v-btn icon small @click="toggle">
              <v-icon v-if="isOpen">mdi-minus</v-icon>
              <v-icon v-else>mdi-plus</v-icon>
            </v-btn>
            <span class="font-weight-bold">{{ group | mapType(stages) }} ({{ items.length }})</span>
          </td>
        </template>
        <template #item.ref="{ item }">
          <nuxt-link :to="{ name: 'leads-edit-id', params: { id: item.id } }" class="text-decoration-underline">
            {{ item.ref }}
          </nuxt-link>
        </template>
        <template #item.type="{ value }">
          <span>{{ value | mapType(types) }}</span>
        </template>
        <template #item.startDate="{ item }">
          <div>{{ item.startDate | formatDate('DD/MM/YYYY') }}</div>
        </template>
        <template #item.customer="{ item }">
          <nuxt-link
            :to="{ name: 'clients-edit-id', params: { id: item.customer.id } }"
            class="text-decoration-underline"
          >
            {{ item.customer.displayName }}
          </nuxt-link>
        </template>
        <template #item.budget="{ item }">
          <div>{{ item.budget | formatCurrency }}</div>
        </template>
        <template #item.actions="{ item }">
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn v-bind="attrs" icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item :to="{ name: 'leads-edit-id', params: { id: item.id } }" dense>
                <v-list-item-title>
                  <v-icon dense>mdi-pencil-outline</v-icon>
                  <span class="ml-1">{{ $t('common.action.update') }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="error--text" dense @click="deleteLead(item)">
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
import { useGetLeads } from '@/compositions'
import AppTextField from '~/components/atoms/global/AppTextField'
import Breadcrumbs from '~/components/global/atoms/Breadcrumbs'
import ListFilter from '~/components/lead/molecules/ListFilter'
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
          customerId: '',
          ref: '',
          stage: ''
        },
        route.value.query
      ),
      sorting: {
        sortBy: ['creationTime'],
        sortDesc: [false]
      },
      search: '',
      headers: [
        { text: root.$t('lead.model.stage'), value: 'stage' },
        { text: root.$t('lead.model.ref'), value: 'ref', align: 'left', groupable: false },
        { text: root.$t('lead.model.type'), value: 'type', align: 'left', groupable: false },
        { text: root.$t('lead.model.startDate'), value: 'startDate', groupable: false },
        { text: root.$t('lead.model.customer'), value: 'customer', groupable: false },
        { text: root.$t('lead.model.budget'), value: 'budget', groupable: false },
        { text: '', value: 'actions', align: 'right', sortable: false, groupable: false }
      ]
    })
    const { loading, conditions, refresh, state: listState } = useGetLeads(state.params)

    const filterLeads = () => {
      conditions.customerId = state.params.customerId
      conditions.ref = state.params.ref
      conditions.stage = state.params.stage
    }

    const resetFilter = () => {
      state.params = {
        customerId: '',
        ref: '',
        stage: ''
      }
      conditions.customerId = state.params.customerId
      conditions.ref = state.params.ref
      conditions.stage = state.params.stage
    }

    const searchLeads = () => {
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

    const deleteLead = (data) => {
      $dialog
        .confirm({
          text: root.$t('lead.message.confirmDeletionMessage'),
          title: root.$t('common.message.confirmDeletionTitle')
        })
        .then((confirm) => {
          if (confirm) {
            $api.lead
              .deleteLead(data.id)
              .then(() => {
                refresh.value()
                $snackbar({
                  message: root.$t('lead.message.successDelete'),
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
      leads: toRef(listState, 'items'),
      totalCount: toRef(listState, 'totalCount'),
      filterLeads,
      resetFilter,
      searchLeads,
      onUpdatePage,
      onUpdateItemsPerPage,
      onUpdateSort,
      deleteLead
    }
  },
  async asyncData({ $api }) {
    const [{ result: stages }, { result: types }] = await Promise.all([
      $api.lead.getLeadStages(),
      $api.lead.getLeadTypes()
    ])

    return {
      stages,
      types
    }
  }
})
</script>
