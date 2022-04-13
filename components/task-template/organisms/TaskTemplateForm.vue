<template>
  <v-row dense>
    <v-col cols="12">
      <v-row dense>
        <v-col cols="12">
          <v-row dense>
            <v-col cols="6">
              <app-text-field
                v-model="form.name"
                :label="$t('taskTemplate.model.name')"
                vid="name"
                rules="required|max:50"
              />
            </v-col>
            <v-col cols="6">
              <select-building-type
                v-model="form.buildingType"
                :label="$t('taskTemplate.model.buildingType')"
                vid="buildingType"
                rules="required"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-btn color="success" class="px-2" @click="onAddTask">
        {{ $t('taskTemplate.action.createTask') }}
      </v-btn>
      <v-row v-for="(task, index) in form.tasks" :key="index" dense>
        <v-col cols="6">
          <app-text-field
            v-model="task.name"
            :label="$t('taskTemplate.model.taskName')"
            vid="name"
            rules="required|max:50"
          />
        </v-col>
        <v-col cols="5">
          <app-text-field
            v-model="task.duration"
            :label="$t('taskTemplate.model.durationTask')"
            vid="duration"
            rules="required|numeric"
          />
        </v-col>
        <v-col cols="1">
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn v-bind="attrs" icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item class="success--text" dense @click="onAddSubTask(index)">
                <v-list-item-title>
                  <v-icon color="success" dense>mdi-plus-circle-outline</v-icon>
                  <span class="ml-1">{{ $t('taskTemplate.action.createSubTask') }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="error--text" dense @click="onRemoveTask(index)">
                <v-list-item-title>
                  <v-icon color="error" dense>mdi-delete-outline</v-icon>
                  <span class="ml-1">{{ $t('common.action.delete') }}</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col cols="12">
          <v-row v-for="(subTask, indexSubTask) in task.subTasks" :key="subTask.index" dense>
            <v-col cols="2" />
            <v-col cols="4">
              <app-text-field
                v-model="subTask.name"
                :label="$t('taskTemplate.model.subTaskName')"
                vid="name"
                rules="required|max:50"
              />
            </v-col>
            <v-col cols="4">
              <app-text-field
                v-model="subTask.duration"
                :label="$t('taskTemplate.model.durationSubTask')"
                vid="duration"
                rules="required|numeric"
              />
            </v-col>
            <v-col cols="2">
              <v-menu offset-y>
                <template #activator="{ on, attrs }">
                  <v-btn v-bind="attrs" icon v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item class="error--text" dense @click="onRemoveSubTask(index, indexSubTask)">
                    <v-list-item-title>
                      <v-icon color="error" dense>mdi-delete-outline</v-icon>
                      <span class="ml-1">{{ $t('common.action.delete') }}</span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import AppTextField from '~/components/atoms/global/AppTextField'
import SelectBuildingType from '~/components/lead/organisms/SelectBuildingType'

export default defineComponent({
  name: 'TaskTemplateForm',
  components: {
    AppTextField,
    SelectBuildingType
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

    const onAddTask = () => {
      form.value.tasks.push({
        stage: null,
        name: '',
        duration: '',
        subTasks: []
      })
    }

    const onRemoveTask = (id) => {
      form.value.tasks.splice(id, 1)
    }

    const onAddSubTask = (id) => {
      form.value.tasks[id].subTasks.push({
        stage: null,
        name: '',
        duration: ''
      })
    }

    const onRemoveSubTask = (id, subTaskId) => {
      form.value.tasks[id].subTasks.splice(subTaskId, 1)
    }

    return {
      form,
      onAddTask,
      onRemoveTask,
      onAddSubTask,
      onRemoveSubTask
    }
  }
})
</script>
