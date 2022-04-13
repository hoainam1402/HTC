<template>
  <v-menu offset-y left transition="slide-y-transition">
    <template #activator="{ on }">
      <v-badge bordered :content="notification.unreadCount" offset-x="22" offset-y="22">
        <v-btn icon v-on="on">
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
      </v-badge>
    </template>
    <v-card width="400">
      <v-list class="tw-cursor-pointer" three-line dense>
        <v-subheader class="pa-2 font-weight-bold">Notifications</v-subheader>
        <virtual-scroll-list
          data-key="id"
          :data-sources="notification.items"
          :data-component="dataComponent"
          :extra-props="{ notification, markAsRead }"
          :estimate-size="80"
          class="tw-overflow-auto"
          style="height: 400px"
          @tobottom="infiniteHandler"
        >
          <div v-if="!busy" slot="footer" class="text-center">
            <v-progress-circular indeterminate />
          </div>
        </virtual-scroll-list>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, useRouter } from '@nuxtjs/composition-api'
import VirtualScrollList from 'vue-virtual-scroll-list'
import NotificationBase from '~/components/toolbar/notification/Base'

export default defineComponent({
  components: {
    VirtualScrollList
  },
  setup() {
    const { $api } = useContext()
    const router = useRouter()
    const busy = ref(false)
    const page = ref(1)
    const state = reactive({
      notification: {
        items: []
      }
    })

    const infiniteHandler = () => {
      $api.account
        .getUserNotifications({
          skipCount: (page.value - 1) * 10,
          maxResultCount: 10
        })
        .then(({ result }) => {
          if (result.items.length) {
            page.value += 1
            state.notification.totalCount = result.totalCount
            state.notification.unreadCount = result.unreadCount
            state.notification.items.push(...result.items)
          } else {
            busy.value = true
          }
        })
        .catch(() => {
          this.$snackbar({
            message: this.$t('common.message.somethingWentWrong'),
            color: 'error'
          })
        })
    }

    infiniteHandler()

    const markAsRead = (item) => {
      if (item.notification.notificationName === 'TaskAssigned') {
        router.push({
          name: 'workspace',
          query: {
            taskId: item.notification.entityId
          }
        })
      }
      if (item.state === 0) {
        $api.account
          .setNotificationAsRead({
            id: item.id
          })
          .then(() => {
            state.notification.unreadCount--
          })
      }
    }

    return {
      notification: toRef(state, 'notification'),
      busy,
      infiniteHandler,
      markAsRead
    }
  },
  data() {
    return {
      dataComponent: NotificationBase
    }
  },
  created() {
    this.$startHub()
  },
  mounted() {
    this.$hub.on('getNotification', (data) => {
      this.notification.items.unshift(data)
      this.notification.unreadCount++
      this.$snackbar({
        message: data.notification.data?.message,
        color: 'success'
      })
    })
  }
})
</script>
