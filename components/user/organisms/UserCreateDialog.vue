<template>
  <form-dialog v-model="visible" :loading="loading" title="Create User" width="600px" @submit="submit">
    <template slot="content">
      <user-form v-model="model" />
    </template>
  </form-dialog>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, watch } from '@nuxtjs/composition-api'
import FormDialog from '~/components/common/molecules/FormDialog'
import UserForm from '~/components/user/organisms/UserForm'

export default defineComponent({
  name: 'UserCreateDialog',
  components: {
    FormDialog,
    UserForm
  },
  setup(_, { emit }) {
    const initialState = () => ({
      model: {
        user: {
          name: '',
          surname: '',
          userName: '',
          emailAddress: '',
          phoneNumber: '',
          isActive: true
        },
        assignedRoleNames: [],
        sendActivationEmail: true,
        setRandomPassword: false
      }
    })

    const { $api, $snackbar } = useContext()
    const visible = ref(false)
    const loading = ref(false)
    const state = reactive(initialState())

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
      $api.user
        .createOrUpdateUser(state.model)
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
      open,
      submit
    }
  }
})
</script>
