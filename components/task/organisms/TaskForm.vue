<template>
  <v-row dense>
    <v-col cols="12">
      <app-text-field v-model="form.name" :label="$t('job.task.model.name')" vid="name" rules="required" />
    </v-col>
    <v-col cols="12">
      <task-autocomplete
        v-model="form.parentTask"
        :default-params="{ jobId: job.id }"
        :label="$t('job.task.model.parentTask')"
        vid="parentTaskId"
        :disabled="!!form.id"
        return-object
      />
    </v-col>
    <v-col cols="12">
      <app-textarea v-model="form.description" :label="$t('job.task.model.description')" vid="description" rows="2" />
    </v-col>
    <v-col cols="12">
      <v-slider
        v-model="form.progress"
        :label="$t('job.task.model.progress')"
        :color="form.progress | progressColor"
        max="100"
        min="0"
        step="25"
        hide-details
        thumb-label
        ticks
      />
    </v-col>
    <v-col cols="12" sm="5">
      <app-date-picker
        v-model="form.startDate"
        :label="$t('job.task.model.startDate')"
        vid="startDate"
        :min-date="allowStartDate"
      />
    </v-col>
    <v-col cols="12" sm="7">
      <app-text-field
        v-model="form.duration"
        type="number"
        :label="$t('job.task.model.duration')"
        :hint="$t('job.task.model.weekendsExcluded')"
        vid="duration"
        :rules="`${hasSubTasks ? '' : 'required|'}min_value:1|max_value:30`"
        :disabled="hasSubTasks || disabledDuration"
        suffix="day(s)"
        persistent-hint
      />
    </v-col>
    <!--    <v-col cols="6">-->
    <!--      <app-text-field-->
    <!--        v-model="form.contractAmount"-->
    <!--        type="number"-->
    <!--        :label="$t('job.task.model.contractAmount')"-->
    <!--        :hint="`Max $${maxAmount}`"-->
    <!--        vid="contractAmount"-->
    <!--        :rules="`required|min_value:0|max_value:${maxAmount}`"-->
    <!--        prefix="$"-->
    <!--        persistent-hint-->
    <!--      />-->
    <!--    </v-col>-->
    <!--    <v-col cols="6">-->
    <!--      <app-text-field-->
    <!--        v-model="form.contractAmountPercentage"-->
    <!--        type="number"-->
    <!--        :label="$t('job.task.model.contractAmount')"-->
    <!--        :hint="`Max ${maxPercent}%`"-->
    <!--        vid="contractAmountPercentage"-->
    <!--        :rules="`required|min_value:0|max_value:${maxPercent}`"-->
    <!--        suffix="%"-->
    <!--        persistent-hint-->
    <!--      />-->
    <!--    </v-col>-->
    <v-col cols="12">
      <user-autocomplete
        v-model="form.assignee"
        :label="$t('job.task.model.assignee')"
        vid="assigneeId"
        rules="required"
        return-object
      />
    </v-col>
    <v-col v-if="!form.id && !form.parentTaskId" cols="12">
      <select-template
        v-model="form.template"
        :label="$t('job.task.model.templateId')"
        vid="templateId"
        return-object
      />
    </v-col>
    <v-col cols="12">
      <div class="heading font-weight-bold">
        {{ $t('job.task.model.reminderSetting') }}
      </div>
    </v-col>
    <v-col cols="12" sm="4">
      <app-text-field
        v-model="form.reminder.remindBefore"
        type="number"
        :label="$t('job.task.model.remindBefore')"
        vid="reminder.remindBefore"
        rules="required"
      />
    </v-col>
    <v-col cols="12" sm="4">
      <v-select
        v-model="form.reminder.remindBeforeUnit"
        :items="optionReminder"
        item-text="value"
        item-value="key"
        hide-details
        dense
        outlined
      />
    </v-col>
    <v-col cols="12" sm="4">
      <app-text-field
        v-model="form.reminder.remindAt"
        type="number"
        :label="$t('job.task.model.remindAt')"
        vid="reminder.remindAt"
        rules="required|min_value:0|max_value:23"
        suffix="Hours"
      />
    </v-col>
    <v-col cols="12">
      <v-row class="d-flex align-center">
        <v-col cols="12" sm="3" class="py-0">
          <app-label :label="$t('job.task.model.remindType')" />
        </v-col>
        <v-col cols="12" sm="3" class="py-0">
          <app-checkbox v-model="form.reminder.remindNotification" :label="$t('job.task.model.notification')" />
        </v-col>
        <v-col cols="12" sm="3" class="py-0">
          <app-checkbox v-model="form.reminder.remindSms" :label="$t('job.task.model.sms')" />
        </v-col>
        <v-col cols="12" sm="3" class="py-0">
          <app-checkbox v-model="form.reminder.remindEmail" :label="$t('job.task.model.email')" />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <app-textarea
        v-model="form.reminder.note"
        :label="$t('job.task.model.reminderNote')"
        vid="reminder.note"
        rows="2"
      />
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent, ref, computed, useContext, useFetch, watch } from '@nuxtjs/composition-api'
import AppLabel from '~/components/atoms/global/AppLabel'
import AppTextField from '~/components/atoms/global/AppTextField'
import AppTextarea from '~/components/atoms/global/AppTextarea'
import AppCheckbox from '~/components/atoms/global/AppCheckbox'
import AppDatePicker from '~/components/atoms/global/AppDatePicker'
import TaskAutocomplete from '~/components/task/organisms/TaskAutocomplete'
import UserAutocomplete from '~/components/user/organisms/UserAutocomplete'
import SelectTemplate from '~/components/task/organisms/SelectTemplate'

export default defineComponent({
  name: 'TaskForm',
  components: {
    AppLabel,
    AppCheckbox,
    AppDatePicker,
    AppTextarea,
    AppTextField,
    TaskAutocomplete,
    UserAutocomplete,
    SelectTemplate
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    job: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const { $api } = useContext()

    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    const allowStartDate = computed(() => form.value.parentTask?.startDate)
    const currentPercent = form.value.totalAmountPercentage
    const maxPercent = props.job.unallocatedTotalAmountPercentage + currentPercent
    const currentAmount = form.value.totalAmountPercentage
    const maxAmount = (props.job.totalPrice * (100 - props.job.contractPrice.markupPercent)) / 100 + currentAmount
    const hasSubTasks = computed(() => form.value.template?.hasSubTasks)
    const disabledDuration = computed(() => form.value.subTasks?.length > 0)

    const optionReminder = ref([])
    useFetch(async () => {
      const { result } = await $api.task.getTaskEnums()
      optionReminder.value = (result || {}).timeUnit || []
    })

    watch(hasSubTasks, (val) => {
      if (val) {
        form.value.duration = null
      }
    })

    return {
      form,
      allowStartDate,
      currentPercent,
      maxPercent,
      maxAmount,
      hasSubTasks,
      disabledDuration,
      optionReminder
    }
  }
})
</script>
