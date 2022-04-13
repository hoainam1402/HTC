<template>
  <v-row dense>
    <v-col cols="12" sm="4">
      <app-text-field v-model="form.user.name" label="Name" vid="user.Name" :rules="`required|max:30|regex:${regex}`" />
    </v-col>
    <v-col cols="12" sm="4">
      <app-text-field
        v-model="form.user.surname"
        label="Surname"
        vid="user.Surname"
        :rules="`required|max:30|regex:${regex}`"
      />
    </v-col>
    <v-col cols="12" sm="4">
      <app-text-field v-model="form.user.userName" label="Username" vid="user.UserName" rules="required|max:30" />
    </v-col>
    <v-col cols="12" sm="6">
      <app-text-field
        v-model="form.user.emailAddress"
        label="Email address"
        vid="user.EmailAddress"
        rules="required|email"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <app-text-field
        v-model="form.user.phoneNumber"
        label="Phone number"
        vid="user.phoneNumber"
        rules="phone|max:16"
        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <select-roles v-model="form.assignedRoleNames" label="Roles" vid="assignedRoleNames" rules="required" multiple />
    </v-col>
    <v-col cols="12" sm="6">
      <app-checkbox v-model="form.user.isActive" label="Active" />
    </v-col>
    <template v-if="!editMode">
      <v-col cols="12">
        <app-checkbox v-model="form.setRandomPassword" label="Random password" class="pt-0 mt-0" />
      </v-col>
      <template v-if="!form.setRandomPassword">
        <v-col cols="12" sm="6">
          <app-text-field
            v-model="form.user.password"
            :type="show ? 'text' : 'password'"
            label="Password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            vid="user.Password"
            rules="required"
            autocomplete="new-password"
            @click:append="show = !show"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <app-text-field
            v-model="passwordConfirmation"
            :type="show ? 'text' : 'password'"
            label="Confirm password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            vid="passwordConfirmation"
            rules="required|confirmed:user.Password"
            autocomplete="new-password"
            @click:append="show = !show"
          />
        </v-col>
      </template>
    </template>
  </v-row>
</template>

<script>
import { computed, defineComponent, reactive, ref, toRef } from '@nuxtjs/composition-api'
import AppTextField from '~/components/atoms/global/AppTextField'
import AppCheckbox from '~/components/atoms/global/AppCheckbox'
import SelectRoles from '~/components/user/organisms/SelectRoles'
import { REGEX_INPUT } from '@/utils/constants'

export default defineComponent({
  name: 'UserForm',
  components: {
    AppTextField,
    AppCheckbox,
    SelectRoles
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      show: false,
      passwordConfirmation: ''
    })
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })
    const editMode = computed(() => form.value.user.id)

    const regex = ref(REGEX_INPUT)

    return {
      show: toRef(state, 'show'),
      passwordConfirmation: toRef(state, 'passwordConfirmation'),
      form,
      editMode,
      regex
    }
  }
})
</script>
