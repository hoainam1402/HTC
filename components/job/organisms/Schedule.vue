<template>
  <v-card class="pa-2">
    <v-row dense>
      <v-col cols="12">
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
          </v-toolbar>
        </v-sheet>
      </v-col>
      <v-col cols="12">
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="model"
            :type="type"
            :weekdays="weekday"
            :events="tasks"
            :event-overlap-mode="'column'"
            :event-overlap-threshold="30"
            :event-color="getEventColor"
            @change="getEvents"
          />
        </v-sheet>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'Schedule',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    type: 'month',
    weekday: [0, 1, 2, 3, 4, 5, 6],
    model: '',
    tasks: [],
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party']
  }),
  async created() {
    const { result } = await this.$api.job.getTask(this.$route.params.id)
    this.tasks = result.items.map((e) => {
      return {
        name: e.name,
        start: this.$moment(e.startDate).format('YYYY-MM-DD'),
        end: this.$moment(e.endDate).format('YYYY-MM-DD'),
        color: this.colors[this.rnd(0, this.colors.length - 1)],
        timed: true
      }
    })
  },
  methods: {
    getEvents({ start, end }) {
      const events = []

      const min = new Date(`${start.date}T00:00:00`)
      const max = new Date(`${end.date}T23:59:59`)
      const days = (max.getTime() - min.getTime()) / 86400000
      const eventCount = this.rnd(days, days + 20)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        const second = new Date(first.getTime() + secondTimestamp)

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay
        })
      }

      this.events = events
    },
    getEventColor(event) {
      return event.color
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    }
  }
})
</script>
