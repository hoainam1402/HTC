<template>
  <v-row dense>
    <v-col cols="12" sm="8">
      <app-text-field
        v-model="form.role.displayName"
        :label="$t('role.model.name')"
        vid="role.displayName"
        :rules="`required|max:30|regex:${regex}`"
      />
    </v-col>
    <v-col cols="12" sm="4">
      <app-checkbox v-model="form.role.isDefault" :label="$t('role.model.isDefault')" />
    </v-col>
    <v-col cols="12" sm="12">
      <h3 class="text-uppercase font-weight-bold">{{ $t('role.model.permissions') }}</h3>
      <tree-view-permissions v-model="form.grantedPermissionNames" :permissions="form.permissions" />
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import AppTextField from '~/components/atoms/global/AppTextField'
import AppCheckbox from '~/components/atoms/global/AppCheckbox'
import TreeViewPermissions from '~/components/role/molecules/TreeViewPermissions'
import { REGEX_INPUT } from '@/utils/constants'

export default defineComponent({
  name: 'RoleForm',
  components: {
    AppCheckbox,
    AppTextField,
    TreeViewPermissions
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })
    const regex = ref(REGEX_INPUT)

    return {
      form,
      regex
    }
  }
})
</script>
