<template>
  <v-list-item @click="$emit('click', item)">
    <v-list-item-avatar color="primary" size="32">
      <v-icon dark small>{{ item.notification.notificationName | notificationType }}</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title v-text="item.notification.notificationName" />
      <v-list-item-subtitle class="caption" v-text="message" />
    </v-list-item-content>
    <v-list-item-action class="align-self-center">
      <v-list-item-action-text v-text="$moment.utc(item.notification.creationTime).fromNow()" />
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'NotificationDefault',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    message() {
      return this.item.notification.data?.message
    }
  }
})
</script>
