<template>
  <form-dialog
    v-model="visible"
    :loading="loading"
    :title="isUpdateExisting ? $t('role.action.updateRole') : $t('role.action.createRole')"
    :is-update="isUpdateExisting"
    width="600px"
    @submit="submit"
  >
    <template slot="content">
      <role-form v-model="model" />
    </template>
  </form-dialog>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, watch } from '@nuxtjs/composition-api'
import FormDialog from '~/components/common/molecules/FormDialog'
import RoleForm from '~/components/role/organisms/RoleForm'

export default defineComponent({
  name: 'RoleUpdateDialog',
  components: {
    FormDialog,
    RoleForm
  },
  setup(_, { root, emit }) {
    const initialState = () => ({
      isUpdateExisting: false,
      model: {
        role: {
          displayName: '',
          isDefault: false
        },
        grantedPermissionNames: []
      }
    })

    const { $api, $snackbar } = useContext()
    const visible = ref(false)
    const loading = ref(false)
    const state = reactive(initialState())

    watch(visible, (isVisible) => {
      if (!isVisible) {
        Object.assign(state, initialState())
      }
    })

    const open = (data) => {
      root.$nuxt.$loading.start()
      $api.role
        .getRoleForEdit((data || {}).id || null)
        .then(({ result }) => {
          state.isUpdateExisting = typeof ((result || {}).role || {}).id === 'number'
          state.model = result
          visible.value = true
        })
        .catch(() => {
          this.$snackbar({
            message: this.$t('common.message.somethingWentWrong'),
            color: 'error'
          })
        })
        .finally(() => root.$nuxt.$loading.finish())
    }
    const submit = () => {
      loading.value = true
      $api.role
        .createOrUpdateRole(state.model)
        .then(() => {
          visible.value = false
          emit('success')
          if (state.isUpdateExisting === true) {
            $snackbar({
              message: root.$t('role.message.successUpdate'),
              color: 'success'
            })
          } else {
            $snackbar({
              message: root.$t('role.message.successCreate'),
              color: 'success'
            })
          }
        })
        .catch(() => {
          this.$snackbar({
            message: this.$t('common.message.somethingWentWrong'),
            color: 'error'
          })
        })
        .finally(() => {
          loading.value = false
        })
    }

    return {
      visible,
      loading,
      model: toRef(state, 'model'),
      isUpdateExisting: toRef(state, 'isUpdateExisting'),
      open,
      submit
    }
  }
})
</script>
