<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">{{ $t('client.action.updateClient') }} - {{ model.name }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
    </div>
    <app-form v-slot="{ handleSubmit }">
      <v-tabs v-model="tab" :show-arrows="false" background-color="transparent">
        <v-tab>Client Information</v-tab>
        <v-tab>Leads</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" class="tw-bg-transparent">
        <v-tab-item>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-card>
                <v-card-title>Client Information</v-card-title>
                <v-card-text>
                  <client-form ref="client-info" v-model="model" />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn :disabled="loading" class="px-2 mr-1" text @click="$router.go(-1)">
                    {{ $t('common.action.discard') }}
                  </v-btn>
                  <v-btn :loading="loading" color="primary" class="px-2" @click="handleSubmit(submit)">
                    {{ $t('common.action.update') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6">
              <v-card>
                <v-card-title>
                  Individuals
                  <v-spacer />
                  <v-btn color="primary" @click="createContact">{{ $t('common.action.create') }}</v-btn>
                </v-card-title>
                <v-card-text>
                  <v-data-table
                    :headers="individualHeaders"
                    :items="model.contacts"
                    :loading="loading"
                    class="flex-grow-1"
                    hide-default-footer
                  >
                    <template #item.actions="{ item }">
                      <v-menu offset-y>
                        <template #activator="{ on, attrs }">
                          <v-btn v-bind="attrs" icon v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item dense @click="updateContact(item)">
                            <v-list-item-title>
                              <v-icon dense>mdi-pencil-outline</v-icon>
                              <span class="ml-1">{{ $t('common.action.update') }}</span>
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item class="error--text" dense @click="deleteContact(item)">
                            <v-list-item-title>
                              <v-icon color="error" dense>mdi-delete-outline</v-icon>
                              <span class="ml-1">{{ $t('common.action.delete') }}</span>
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-row dense>
            <v-col cols="12">
              <v-card>
                <v-card-title>Leads</v-card-title>
                <v-card-text>
                  <app-data-table
                    :headers="leadHeaders"
                    :items="leads"
                    :server-items-length="totalCount"
                    :loading="loading"
                    item-key="uuid"
                    group-by="stage"
                    class="flex-grow-1"
                    show-group-by
                  >
                    <template #group.header="{ group, items, isOpen, toggle }">
                      <td :colspan="leadHeaders.length">
                        <v-btn icon small @click="toggle">
                          <v-icon v-if="isOpen">mdi-minus</v-icon>
                          <v-icon v-else>mdi-plus</v-icon>
                        </v-btn>
                        <span class="font-weight-bold">{{ group | mapType(stages) }} ({{ items.length }})</span>
                      </td>
                    </template>
                    <template #item.ref="{ item }">
                      <nuxt-link
                        :to="{ name: 'leads-edit-id', params: { id: item.id } }"
                        class="text-decoration-underline"
                      >
                        {{ item.ref }}
                      </nuxt-link>
                    </template>
                    <template #item.type="{ value }">
                      <span>{{ value | mapType(types) }}</span>
                    </template>
                    <template #item.startDate="{ item }">
                      <div>{{ item.startDate | formatDate('DD/MM/YYYY') }}</div>
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
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </app-form>
    <individual-create-dialog ref="individualCreateDialog" @success="$nuxt.refresh()" />
    <individual-update-dialog ref="individualUpdateDialog" @success="$nuxt.refresh()" />
  </div>
</template>

<script>
import { defineComponent, reactive, toRef, useContext } from '@nuxtjs/composition-api'
import { useGetLeads } from '@/compositions'
import Breadcrumbs from '~/components/global/atoms/Breadcrumbs.vue'
import AppForm from '~/components/atoms/global/AppForm.vue'
import ClientForm from '~/components/client/organisms/ClientForm.vue'
import { ADDRESS } from '~/utils/constants'
import AppDataTable from '~/components/atoms/global/AppDataTable'
import IndividualCreateDialog from '~/components/client/organisms/IndividualCreateDialog'
import IndividualUpdateDialog from '~/components/client/organisms/IndividualUpdateDialog'

export default defineComponent({
  components: {
    AppDataTable,
    Breadcrumbs,
    AppForm,
    ClientForm,
    IndividualCreateDialog,
    IndividualUpdateDialog
  },
  setup(props, { root }) {
    const { $api, params, $snackbar, $dialog } = useContext()
    const state = reactive({
      params: Object.assign({
        customerId: params.value.id
      }),
      leadHeaders: [
        { text: root.$t('lead.model.stage'), value: 'stage' },
        { text: root.$t('lead.model.ref'), value: 'ref', align: 'left', groupable: false },
        { text: root.$t('lead.model.type'), value: 'type', align: 'left', groupable: false },
        { text: root.$t('lead.model.startDate'), value: 'startDate', groupable: false },
        { text: root.$t('lead.model.budget'), value: 'budget', groupable: false },
        { text: '', value: 'actions', align: 'right', sortable: false, groupable: false }
      ],
      individualHeaders: [
        { text: root.$t('client.model.name'), value: 'firstName' },
        { text: root.$t('common.model.email'), value: 'emailAddress' },
        { text: root.$t('common.model.mobile'), value: 'phoneNumber' },
        { text: '', value: 'actions', align: 'right', sortable: false }
      ]
    })
    const { loading, conditions, refresh, state: listState } = useGetLeads(state.params)

    const deleteContact = (data) => {
      $dialog
        .confirm({
          text: root.$t('contact.message.confirmDeletionMessage'),
          title: root.$t('common.message.confirmDeletionTitle')
        })
        .then((confirm) => {
          if (confirm) {
            $api.client
              .deleteContact(params.value.id, data.id)
              .then(() => {
                root.$nuxt.refresh()
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
      leadHeaders: toRef(state, 'leadHeaders'),
      individualHeaders: toRef(state, 'individualHeaders'),
      conditions,
      loading,
      refresh,
      deleteContact,
      deleteLead,
      leads: toRef(listState, 'items'),
      totalCount: toRef(listState, 'totalCount')
    }
  },
  async asyncData({ $api, params }) {
    const [{ result: stages }, { result: types }, { result: model }] = await Promise.all([
      $api.lead.getLeadStages(),
      $api.lead.getLeadTypes(),
      $api.client.getClient(params.id)
    ])

    if (model.address === null) {
      model.address = ADDRESS
    }

    return {
      model,
      stages,
      types
    }
  },

  data() {
    return {
      tab: ''
    }
  },
  methods: {
    createContact() {
      this.$refs.individualCreateDialog.open()
    },
    updateContact(data) {
      this.$refs.individualUpdateDialog.open(data)
    },
    submit() {
      this.loading = true
      this.$api.client
        .updateClient(this.model)
        .then(() => {
          this.$snackbar({
            message: this.$t('client.message.successUpdate'),
            color: 'success'
          })
          this.$router.push({ name: 'clients' })
        })
        .catch(() => {
          this.$snackbar({
            message: this.$t('common.message.somethingWentWrong'),
            color: 'error'
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
})
</script>
