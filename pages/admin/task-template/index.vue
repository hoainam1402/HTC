<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">{{ $t('menu.taskTemplate') }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
      <v-btn color="primary" :to="{ name: 'admin-task-template-create' }">
        {{ $t('taskTemplate.action.createTaskTemplate') }}
      </v-btn>
    </div>
    <list-filter v-model="params" @filter="filterTaskTemplate" @reset="resetFilter" />
    <v-card class="mt-3">
      <v-row class="align-center pa-2" dense>
        <v-spacer />
      </v-row>
      <app-data-table
        :headers="headers"
        :items="tasksTemplate"
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
          <nuxt-link
            :to="{ name: 'admin-task-template-edit-id', params: { id: item.id } }"
            class="text-decoration-underline"
          >
            {{ item.name }}
          </nuxt-link>
        </template>
        <template #item.buildingType="{ value }">
          <span>{{ value | mapType(buildingType) }}</span>
        </template>
        <template #item.actions="{ item }">
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn v-bind="attrs" icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item :to="{ name: 'admin-task-template-edit-id', params: { id: item.id } }" dense>
                <v-list-item-title>
                  <v-icon dense>mdi-pencil-outline</v-icon>
                  <span class="ml-1">{{ $t('common.action.update') }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="error--text" dense @click="onDeleteTasksTemplate(item)">
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
import { useGetTasksTemplate } from '@/compositions'
import Breadcrumbs from '~/components/global/atoms/Breadcrumbs'
import ListFilter from '~/components/task-template/molecules/ListFilter'
import AppDataTable from '~/components/atoms/global/AppDataTable'

export default defineComponent({
  components: {
    AppDataTable,
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
          buildingType: ''
        },
        route.value.query
      ),
      sorting: {
        sortBy: ['creationTime'],
        sortDesc: [false]
      },
      search: '',
      headers: [
        { text: root.$t('taskTemplate.model.name'), value: 'name' },
        { text: root.$t('taskTemplate.model.buildingType'), value: 'buildingType' },
        { text: '', value: 'actions', align: 'right', sortable: false }
      ]
    })
    const { loading, conditions, refresh, state: listState } = useGetTasksTemplate(state.params)

    const filterTaskTemplate = () => {
      conditions.buildingType = state.params.buildingType
    }

    const resetFilter = () => {
      state.params = {
        buildingType: ''
      }
      conditions.buildingType = state.params.buildingType
    }

    const searchTaskTemplate = () => {
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

    const onDeleteTasksTemplate = (data) => {
      $dialog
        .confirm({
          text: root.$t('taskTemplate.message.confirmDeletionMessage'),
          title: root.$t('common.message.confirmDeletionTitle')
        })
        .then((confirm) => {
          if (confirm) {
            $api.taskTemplate
              .deleteTaskTemplate(data.id)
              .then(() => {
                refresh.value()
                $snackbar({
                  message: root.$t('taskTemplate.message.successCreate'),
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
      tasksTemplate: toRef(listState, 'items'),
      totalCount: toRef(listState, 'totalCount'),
      filterTaskTemplate,
      resetFilter,
      searchTaskTemplate,
      onUpdatePage,
      onUpdateItemsPerPage,
      onUpdateSort,
      onDeleteTasksTemplate
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
