<template>
  <v-card style="width: 100%" class="pb-2" flat>
    <v-card-text class="pa-0">
      <v-card-actions class="pl-0 pr-0 pb-2" flat>
        <v-btn class="mr-2" @click="onTodayClicked">
          <span v-if="calendarType === 'day'">This Month</span>
          <span v-else>Today</span>
        </v-btn>
        <v-menu transition="slide-y-transition" bottom>
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on">
              <span class="mr-2">{{ calendarTypeName }}</span>
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item v-for="type in calendarTypes" :key="type.code" link @click="setCalendarType(type)">
              <v-list-item-title>{{ type.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-spacer></v-spacer>
        <v-btn icon @click="calendar.prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-2 mr-2">{{ calendarTitle }}</v-toolbar-title>
        <v-btn icon @click="calendar.next()">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-card-actions>
      <v-calendar
        ref="calendar"
        v-model="calendarData"
        style="min-height: 500px"
        :weekdays="calendarWeekday"
        :type="calendarType"
        :events="calendarEvents"
        :event-name="'displayName'"
        :event-color="getCalendarEventColor"
        :event-text-color="getCalendarEventTextColor"
        :event-more="true"
        :short-months="false"
        @click:event="onEventClicked"
        @click:more="onDateClicked"
        @change="onCalendarChanged"
        @click:date="onDateClicked"
      >
        <template #event="{ event }">
          <v-tooltip :position-x="0" :open-delay="200" left>
            <template #activator="{ on, attrs }">
              <v-progress-linear
                :value="event.progress || 0"
                :color="`${event.progressColor} lighten-5`"
                height="100%"
                v-bind="attrs"
                v-on="on"
              >
                <template #default>
                  <div
                    style="width: 100%; text-align: left"
                    class="pl-1 pr-1"
                    :class="`${event.progressColor}--text text--darken-3`"
                  >
                    <v-icon :color="event.progressColor" small>
                      {{ event.parentTask ? 'mdi-file-outline' : 'mdi-folder' }}
                    </v-icon>
                    <span>{{ event.displayName }}</span>
                    <span v-if="event.percentVisible">({{ Math.ceil(event.progress || 0) }}%)</span>
                  </div>
                </template>
              </v-progress-linear>
            </template>
            <v-simple-table dense class="pa-0 ma-0" style="background-color: transparent" dark>
              <tbody>
                <tr>
                  <td colspan="2">
                    <strong>{{ event.name }}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Assignee</td>
                  <th>
                    <span v-if="event.assignee">{{ (event.assignee || {}).name }}</span>
                    <span v-else class="warning--text">
                      <v-icon color="warning" small>mdi-alert-outline</v-icon>
                      <span>Unassigned</span>
                    </span>
                  </th>
                </tr>
                <tr v-if="event.startDate">
                  <td>Start date</td>
                  <th>{{ event.startDate | formatDate('YYYY-MM-DD') }}</th>
                </tr>
                <tr v-if="event.endDate">
                  <td>End date</td>
                  <th>
                    <span>{{ event.endDate | formatDate('YYYY-MM-DD') }}</span>
                    <span v-if="event.duration" class="ml-1">
                      <span>({{ event.duration }}</span>
                      <span v-if="event.duration > 1">days)</span>
                      <span v-else>day)</span>
                    </span>
                  </th>
                </tr>
                <tr>
                  <td>Status</td>
                  <th>{{ event.statusName }}</th>
                </tr>
              </tbody>
            </v-simple-table>
          </v-tooltip>
        </template>
      </v-calendar>
    </v-card-text>
  </v-card>
</template>

<script>
import _ from 'lodash'
import { computed, defineComponent, reactive, ref, toRef, useContext, useRoute, watch } from '@nuxtjs/composition-api'
import { FORMAT_BACKEND_DATETIME } from '@/utils/constants'

export default defineComponent({
  props: {
    jobId: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const { $api, $moment } = useContext()
    const route = useRoute()

    const calendar = ref(null)

    const calendarState = reactive({
      params: Object.assign(
        {
          jobId: props.jobId,
          fromDate: null,
          toDate: null,
          maxItemPerDay: 3
        },
        route.value.query
      ),
      model: $moment().format('YYYY-MM-DD'),
      weekdays: [1, 2, 3, 4, 5, 6, 0],
      type: 'month',
      events: []
    })

    const loading = ref(false)
    watch(loading, (isLoading) => {
      emit('on-loading', isLoading)
    })

    const calendarTypes = ref([
      { code: 'day', title: 'Day' },
      { code: 'week', title: 'Week' },
      { code: 'month', title: 'Month' }
    ])
    const calendarTypeName = computed(() => {
      const type = _.find(calendarTypes.value || [], (item) => item.code === calendarState.type)
      if (!type) return null
      return type.title
    })
    const setCalendarType = (type) => {
      calendarState.events = []
      calendarState.type = type.code
    }

    const calendarTitle = computed(() => {
      if (!calendar.value) return ''
      return calendar.value.title
    })

    const fetchCalendarTasks = _.debounce(async () => {
      try {
        loading.value = true
        const response = await $api.task.getCalendar(calendarState.params)
        calendarState.events = (response.result || {}).items || []
      } catch (e) {
        window.console.error(e)
      } finally {
        loading.value = false
      }
    }, 300)

    const calendarEvents = computed(() => {
      return _.flatMap(
        _.map(calendarState.events, (item) => {
          return _.map(item.tasks || [], (taskItem) => {
            const start = $moment(taskItem.startDate, FORMAT_BACKEND_DATETIME).toDate()
            const end = $moment(taskItem.endDate || taskItem.startDate, FORMAT_BACKEND_DATETIME).toDate()
            const displayName = _.filter(
              [(taskItem.assignee || {}).name, taskItem.name],
              (name) => typeof name === 'string' && name.length > 0
            ).join(' - ')
            const tPgrs = taskItem.progress || 0
            const progressColor = tPgrs > 0 && tPgrs < 100 ? 'orange' : tPgrs > 0 ? 'green' : 'blue-grey'
            const percentVisible = tPgrs > 0 && tPgrs < 100
            const status =
              tPgrs > 0 && tPgrs < 100 ? `In-Progress (${Math.ceil(tPgrs)}%)` : tPgrs > 0 ? 'Completed' : 'Scheduled'
            return {
              ...taskItem,
              start,
              end,
              displayName,
              statusName: status,
              progressColor,
              percentVisible,
              timed: false
            }
          })
        })
      )
    })

    const getCalendarEventColor = () => {
      return 'rgba(0, 0, 0, 0.0)'
    }

    const getCalendarEventTextColor = () => {
      return 'black'
    }

    const onCalendarChanged = ({ start, end }) => {
      const min = $moment(`${start.date}T00:00:00`).format(FORMAT_BACKEND_DATETIME)
      const max = $moment(`${end.date}T23:59:59`).format(FORMAT_BACKEND_DATETIME)

      calendarState.params.fromDate = min
      calendarState.params.toDate = max
      fetchCalendarTasks()
    }

    const onDateClicked = (event) => {
      calendarState.model = event.date
      calendarState.type = calendarState.type === 'day' ? 'month' : 'day'
    }

    const onEventClicked = (event) => {
      if (event.event && typeof event.event === 'object') {
        emit('on-edit-task', event.event)
      }
    }

    const onTodayClicked = () => {
      calendarState.model = $moment().format('YYYY-MM-DD')
      calendarState.type = calendarState.type === 'day' ? 'month' : 'day'
    }

    return {
      calendar,
      calendarTitle,
      calendarTypes,
      calendarTypeName,
      setCalendarType,
      calendarData: toRef(calendarState, 'model'),
      calendarWeekday: toRef(calendarState, 'weekdays'),
      calendarType: toRef(calendarState, 'type'),
      calendarEvents,
      fetchCalendarTasks,
      getCalendarEventColor,
      getCalendarEventTextColor,
      onCalendarChanged,
      onDateClicked,
      onEventClicked,
      onTodayClicked
    }
  },
  methods: {
    reloadData() {
      this.fetchCalendarTasks()
    }
  }
})
</script>

<!--suppress CssUnresolvedCustomProperty -->
<style scoped>
* >>> .v-calendar-weekly__day {
  min-height: 180px;
}

* >>> .v-event {
  font-weight: bold;
}

* >>> .theme--light.v-calendar-weekly .v-calendar-weekly__day,
* >>> .theme--light.v-calendar-weekly .v-calendar-weekly__head-weekday {
  border-right: var(--v-surface-darken1) 1px solid;
  border-bottom: var(--v-surface-darken1) 1px solid;
}
* >>> .theme--light.v-calendar-weekly {
  border-top: var(--v-surface-darken1) 1px solid;
  border-left: var(--v-surface-darken1) 1px solid;
}
* >>> .v-calendar-weekly__day .v-past .v-outside {
  color: var(--v-primary-base);
}
</style>
