import Vue from 'vue'
import { computed } from '@nuxtjs/composition-api'
import { createAcl, defineAclRules } from 'vue-simple-acl/dist/vue-simple-acl.vue2'
import { map } from 'lodash'

export default async function ({ $api, store }) {
  const { result } = await $api.permission.getAllPermissions()
  const allPermissions = map(result.items, 'name')
  const user = computed(() => store.getters['user/grantedPermissions'])

  const rules = () =>
    defineAclRules((setRule) => {
      allPermissions.forEach((permission) => {
        setRule(permission, (user) => user.value.includes(permission))
      })
    })

  const simpleAcl = createAcl({
    user,
    rules
  })

  Vue.use(simpleAcl)
}
