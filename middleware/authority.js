export default async function ({ $api, $auth, store }) {
  if ($auth.loggedIn && store.getters['user/grantedPermissions'].length === 0) {
    const { result } = await $api.profile.userConfiguration()
    store.commit('user/GRANTED_PERMISSIONS', result.auth.grantedPermissions)
  }
}
