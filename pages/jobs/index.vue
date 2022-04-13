<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">{{ $t('menu.jobs') }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
      <v-btn color="primary" :to="{ name: 'jobs-create' }">{{ $t('job.action.createJob') }}</v-btn>
    </div>
    <list-filter v-model="params" @filter="filterJob" @reset="resetFilter" />
    <v-card class="mt-3">
      <v-row class="align-center pa-2" dense>
        <v-spacer />
        <v-col cols="6" class="d-flex align-center text-right">
          <app-text-field
            v-model="search"
            :placeholder="$t('job.message.searchHint')"
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
        :items="jobs"
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
        <template #item.refNo="{ item }">
          <nuxt-link :to="{ name: 'jobs-id', params: { id: item.id } }" class="text-decoration-underline">
            {{ item.refNo }}
          </nuxt-link>
        </template>
        <template #item.description="{ item }">
          <nuxt-link :to="{ name: 'jobs-id', params: { id: item.id } }" class="text-decoration-underline">
            {{ item.description }}
          </nuxt-link>
        </template>
        <template #item.codeNumber="{ item }">
          <span v-if="item.lead && item.lead.address">{{ item.lead.address.codeNumber }}</span>
        </template>
        <template #item.buildingType="{ value }">
          <span>{{ value | mapType(buildingType) }}</span>
        </template>
        <template #item.progress="{ value }">
          <strong>{{ Math.ceil(value) }}%</strong>
          <v-progress-linear :value="value" color="success" height="5" />
        </template>
        <template #item.customer="{ item }">
          <nuxt-link
            :to="{ name: 'clients-edit-id', params: { id: item.customer.id } }"
            class="text-decoration-underline"
          >
            {{ item.customer.displayName }}
          </nuxt-link>
        </template>
        <template #item.expectedStart="{ item }">
          <div>{{ item.expectedStart | formatDate('DD/MM/YYYY') }}</div>
        </template>
        <template #item.actions="{ item }">
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn v-bind="attrs" icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item :to="{ name: 'jobs-id', params: { id: item.id } }" dense>
                <v-list-item-title>
                  <v-icon dense>mdi-pencil-outline</v-icon>
                  <span class="ml-1">{{ $t('common.action.update') }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="error--text" dense @click="deleteJob(item)">
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
import { useGetJobs } from '@/compositions'
import AppTextField from '~/components/atoms/global/AppTextField'
import Breadcrumbs from '~/components/global/atoms/Breadcrumbs'
import ListFilter from '~/components/job/molecules/ListFilter'
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
          sorting: 'expectedStart desc',
          buildingType: '',
          progress: ''
        },
        route.value.query
      ),
      sorting: {
        sortBy: ['expectedStart'],
        sortDesc: [false]
      },
      search: '',
      headers: [
        { text: root.$t('job.model.ref'), value: 'refNo', align: 'left' },
        { text: root.$t('common.model.codeNumber'), value: 'codeNumber', align: 'left' },
        { text: root.$t('job.model.description'), value: 'description' },
        { text: root.$t('job.model.type'), value: 'buildingType' },
        { text: root.$t('job.model.taskProgress'), value: 'progress', sortable: false },
        { text: root.$t('job.model.customer'), value: 'customer', sortable: false },
        { text: root.$t('job.model.date'), value: 'expectedStart' },
        { text: '', value: 'actions', align: 'right', sortable: false }
      ]
    })
    const { loading, conditions, refresh, state: listState } = useGetJobs(state.params)

    const filterJob = () => {
      conditions.buildingType = state.params.buildingType
      conditions.progress = state.params.progress
    }

    const resetFilter = () => {
      state.params = {
        buildingType: '',
        progress: ''
      }
      conditions.buildingType = state.params.buildingType
      conditions.progress = state.params.progress
    }

    const searchJob = () => {
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

    const deleteJob = (data) => {
      $dialog
        .confirm({
          text: root.$t('job.message.confirmDeletionMessage'),
          title: root.$t('common.message.confirmDeletionTitle')
        })
        .then((confirm) => {
          if (confirm) {
            $api.job
              .deleteJob(data.id)
              .then(() => {
                refresh.value()
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
      params: toRef(state, 'params'),
      sorting: toRef(state, 'sorting'),
      search: toRef(state, 'search'),
      headers: toRef(state, 'headers'),
      conditions,
      loading,
      refresh,
      jobs: toRef(listState, 'items'),
      totalCount: toRef(listState, 'totalCount'),
      filterJob,
      resetFilter,
      searchJob,
      onUpdatePage,
      onUpdateItemsPerPage,
      onUpdateSort,
      deleteJob
    }
  },
  async asyncData({ store }) {
    await store.dispatch('job/getEnums')
  },
  computed: {
    buildingType() {
      return this.$store.state.job.enums.buildingType
    }
  }
})
</script>
