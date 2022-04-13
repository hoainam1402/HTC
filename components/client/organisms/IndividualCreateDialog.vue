<template>
  <form-dialog v-model="visible" :loading="loading" title="Create Individual" width="600px" @submit="submit">
    <template slot="content">
      <individual-form v-model="model" />
    </template>
  </form-dialog>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, watch } from '@nuxtjs/composition-api'
import FormDialog from '~/components/common/molecules/FormDialog'
import IndividualForm from '~/components/client/molecules/IndividualForm'

export default defineComponent({
  name: 'IndividualCreateDialog',
  components: {
    FormDialog,
    IndividualForm
  },
  setup(_, { emit }) {
    const initialState = () => ({
      model: {
        firstName: null,
        lastName: null,
        mobilePhone: null,
        phoneNumber: null,
        emailAddress: null
      }
    })

    const { $api, $snackbar, params } = useContext()
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
      $api.client
        .createContact(params.value.id, state.model)
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
