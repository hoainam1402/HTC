<template>
  <form-dialog
    v-model="visible"
    :loading="loading"
    :title="$t('usersAndRoles.action.newUsersRole')"
    width="600px"
    @submit="submit"
  >
    <template slot="content">
      <v-row dense>
        <v-col cols="12">
          <user-autocomplete v-model="model.user" :label="$t('usersAndRoles.model.user')" vid="user" rules="required" />
        </v-col>
        <v-col cols="12">
          <app-select
            v-model="model.role"
            :items="roles"
            :label="$t('usersAndRoles.model.role')"
            vid="role"
            rules="required"
          />
        </v-col>
      </v-row>
    </template>
  </form-dialog>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, watch } from '@nuxtjs/composition-api'
import FormDialog from '~/components/common/molecules/FormDialog'
import UserAutocomplete from '~/components/user/organisms/UserAutocomplete'
import AppSelect from '~/components/atoms/global/AppSelect'

export default defineComponent({
  name: 'AddUserRoleDialog',
  components: {
    FormDialog,
    UserAutocomplete,
    AppSelect
  },
  setup(_, { emit }) {
    const initialState = () => ({
      model: {}
    })

    const { $api, $snackbar, params } = useContext()
    const visible = ref(false)
    const loading = ref(false)
    const state = reactive(initialState())
    const roles = ref([
      {
        value: 'Supervisor',
        key: 0
      },
      {
        value: 'Worker',
        key: 1
      }
    ])

    watch(visible, (val) => {
      if (!val) {
        Object.assign(state, initialState())
      }
    })

    const open = () => {
      visible.value = true
    }
    const submit = () => {
      loading.value = true
      $api.job
        .createJobRoles(params.value.id, state.model)
        .then(() => {
          visible.value = false
          emit('success')
          $snackbar({
            message: 'Success',
            color: 'success'
          })
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
      roles,
      open,
      submit
    }
  }
})
</script>
