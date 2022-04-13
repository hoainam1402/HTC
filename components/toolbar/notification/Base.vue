<template>
  <div>
    <v-divider v-if="index > 0 && index < notification.items.length" :key="`divider-${index}`" inset />
    <notification-default :key="`item-${index}`" :item="source" @click="markAsRead" />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import NotificationDefault from '~/components/toolbar/notification/Default'

export default defineComponent({
  name: 'NotificationBase',
  components: {
    NotificationDefault
  },
  props: {
    index: {
      type: Number,
      required: true
    },
    source: {
      type: Object,
      default: () => ({})
    },
    notification: {
      type: Object,
      default: () => ({})
    },
    markAsRead: {
      type: Function,
      default: () => {}
    }
  }
})
</script>
