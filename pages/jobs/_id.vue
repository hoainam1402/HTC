<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">{{ model.description }}</div>
        <breadcrumbs />
      </div>
    </div>
    <v-tabs v-model="currentRoute" :show-arrows="false" background-color="transparent">
      <v-tab v-for="tab in tabs" :key="tab.route.name" :to="tab.route" exact>{{ tab.name }}</v-tab>
    </v-tabs>
    <v-layout>
      <nuxt-child :job="model" />
    </v-layout>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { cloneDeep } from 'lodash'
import Breadcrumbs from '~/components/global/atoms/Breadcrumbs'
import { ADDRESS } from '~/utils/constants'

export default defineComponent({
  components: {
    Breadcrumbs
  },
  async asyncData({ $api, store, params }) {
    const { result } = await $api.job.getJob(params.id)

    if (result.address === null) {
      result.address = ADDRESS
    }

    if (result.customer?.address === null) {
      result.customer.address = ADDRESS
    }

    store.commit('job/JOB_DETAILS', cloneDeep(result))
    await store.dispatch('job/getEnums')

    return {
      model: result
    }
  },
  data() {
    return {
      currentRoute: this.$route.path
    }
  },
  computed: {
    tabs() {
      return [
        { name: 'Information', route: { name: 'jobs-id', params: { id: this.model.id } } },
        { name: 'Schedules', route: { name: 'jobs-id-schedules', params: { id: this.model.id } } },
        { name: 'Purchase Orders', route: { name: 'jobs-id-purchase-orders', params: { id: this.model.id } } }
        // { name: 'Users and Roles', route: { name: 'jobs-id-users-and-roles', params: { id: this.model.id } } }
      ]
    }
  }
})
</script>
