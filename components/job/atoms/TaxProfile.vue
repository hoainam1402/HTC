<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y>
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" color="primary" small v-on="on">{{ taxItem.rate }}%</v-btn>
    </template>
    <v-card>
      <v-card-title>TAX PROFILE | {{ taxProfile.name }}</v-card-title>
      <v-card-text>
        <v-list shaped>
          <v-list-item-group v-model="model">
            <v-list-item v-for="(item, i) in taxProfile.taxItems" :key="i" :value="item.id" @click="onClickItem(item)">
              <template #default="{ active }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.description" />
                </v-list-item-content>
                <v-list-item-action>
                  <v-checkbox :input-value="active" />
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text @click="handleResetDefault">Reset tax values to default</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'TaxProfile',
  props: {
    value: {
      type: String,
      default: null
    },
    taxProfile: {
      type: Object,
      default: null
    }
  },
  setup(props, { emit }) {
    const menu = ref(false)
    const model = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })
    const taxItem = ref({})

    onMounted(() => {
      model.value = props.taxProfile.taxItems[0]?.id
      taxItem.value = props.taxProfile.taxItems[0]
    })

    const onClickItem = (item) => {
      taxItem.value = item
    }

    const handleResetDefault = () => {
      model.value = props.taxProfile.taxItems[0]?.id
      taxItem.value = props.taxProfile.taxItems[0]
      menu.value = false
    }

    return {
      menu,
      model,
      taxItem,
      onClickItem,
      handleResetDefault
    }
  }
})
</script>
