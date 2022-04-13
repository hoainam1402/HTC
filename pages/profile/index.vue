<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center py-1">
      <div class="display-1">{{ `${$auth.$state.user.name} ${$auth.$state.user.surname}` }}</div>
    </div>

    <div class="mb-4">
      <div class="d-flex">
        <span class="font-weight-bold">Email</span>
        <span class="mx-1">
          <molecules-copy-label :text="$auth.$state.user.emailAddress" />
        </span>
      </div>
      <div class="d-flex">
        <span class="font-weight-bold">ID</span>
        <span class="mx-1">
          <molecules-copy-label :text="$auth.$state.user.id + ''" />
        </span>
      </div>
    </div>

    <v-tabs v-model="tab" :show-arrows="false" background-color="transparent">
      <v-tab>Account</v-tab>
      <v-tab>Security</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" class="tw-bg-transparent">
      <v-tab-item>
        <account-tab ref="tabs-account" v-model="user" />
      </v-tab-item>

      <v-tab-item>
        <security-tab ref="tabs-security" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { defineComponent, useFetch, useContext, reactive, ref, toRef } from '@nuxtjs/composition-api'
import AccountTab from '~/components/profile/AccountTab'
import SecurityTab from '~/components/profile/SecurityTab'

export default defineComponent({
  components: {
    AccountTab,
    SecurityTab
  },
  setup() {
    const { $api } = useContext()
    const tab = ref('')
    const state = reactive({
      user: {}
    })

    useFetch(async () => {
      const { result } = await $api.profile.getCurrentUserProfileForEdit()
      state.user = result
    })

    return {
      tab,
      user: toRef(state, 'user')
    }
  }
})
</script>
