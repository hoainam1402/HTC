<template>
  <v-dialog :value="isVisible" persistent>
    <molecules-form v-slot="{ handleSubmit, valid }">
      <v-card>
        <v-card-title>{{ $t('taxProfile.action.customize') }}</v-card-title>
        <v-card-text>
          <v-row v-if="taxProfileForm" dense>
            <v-col cols="12" sm="3">
              <molecules-form-item v-slot="{ errors }" vid="shortCode" :label="$t('taxProfile.model.shortCode')">
                <v-text-field
                  v-model="taxProfileForm.shortCode"
                  :error-messages="errors"
                  :disabled="loading"
                  :label="$t('taxProfile.model.shortCode')"
                />
              </molecules-form-item>
            </v-col>
            <v-col cols="12" sm="9">
              <molecules-form-item v-slot="{ errors }" vid="name" :label="$t('taxProfile.model.name')">
                <v-text-field
                  v-model="taxProfileForm.name"
                  :error-messages="errors"
                  :disabled="loading"
                  :label="$t('taxProfile.model.name')"
                />
              </molecules-form-item>
            </v-col>
            <v-col cols="12" sm="12">
              <v-simple-table>
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-left">{{ $t('taxItem.model.code') }}</th>
                      <th class="text-left">{{ $t('taxItem.model.description') }}</th>
                      <th class="text-left">{{ $t('taxItem.model.rate') }}Rate</th>
                      <th class="text-left">{{ $t('taxItem.model.exempt') }}</th>
                      <th class="text-left">{{ $t('taxItem.model.type') }}</th>
                      <th class="text-center">{{ $t('taxItem.model.material') }}</th>
                      <th class="text-center">{{ $t('taxItem.model.labour') }}</th>
                      <th class="text-center">{{ $t('taxItem.model.matLab') }}</th>
                      <th class="text-center">{{ $t('taxItem.model.equipment') }}</th>
                      <th class="text-center">{{ $t('taxItem.model.subcontractor') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in taxProfileForm.taxItems" :key="item.id">
                      <td class="text-no-wrap">{{ item.code }}</td>
                      <td>{{ item.description }}</td>
                      <td>
                        <molecules-form-item
                          v-slot="{ errors }"
                          vid="rate"
                          :label="$t('taxItem.model.rate')"
                          rules="required"
                        >
                          <v-text-field
                            v-model="item.rate"
                            type="number"
                            style="min-width: 64px"
                            class="text-center"
                            :error-messages="errors"
                            :disabled="loading"
                            required
                          />
                        </molecules-form-item>
                      </td>
                      <td class="text-center">
                        <molecules-form-item v-slot="{ errors }" vid="exempt" :label="$t('taxItem.model.exempt')">
                          <v-checkbox v-model="item.exempt" :error-messages="errors" :disabled="loading" label="" />
                        </molecules-form-item>
                      </td>
                      <td>{{ item.typeName }}</td>
                      <td class="text-center">
                        <molecules-form-item v-slot="{ errors }" vid="material" :label="$t('taxItem.model.material')">
                          <v-checkbox v-model="item.material" :error-messages="errors" :disabled="loading" label="" />
                        </molecules-form-item>
                      </td>
                      <td class="text-center">
                        <molecules-form-item v-slot="{ errors }" vid="labor" :label="$t('taxItem.model.labour')">
                          <v-checkbox v-model="item.labor" :error-messages="errors" :disabled="loading" label="" />
                        </molecules-form-item>
                      </td>
                      <td class="text-center">
                        <molecules-form-item v-slot="{ errors }" vid="matLab" :label="$t('taxItem.model.matLab')">
                          <v-checkbox v-model="item.matLab" :error-messages="errors" :disabled="loading" label="" />
                        </molecules-form-item>
                      </td>
                      <td class="text-center">
                        <molecules-form-item v-slot="{ errors }" vid="equipment" :label="$t('taxItem.model.equipment')">
                          <v-checkbox v-model="item.equipment" :error-messages="errors" :disabled="loading" label="" />
                        </molecules-form-item>
                      </td>
                      <td class="text-center">
                        <molecules-form-item
                          v-slot="{ errors }"
                          vid="subcontractor"
                          :label="$t('taxItem.model.subcontractor')"
                        >
                          <v-checkbox
                            v-model="item.subcontractor"
                            :error-messages="errors"
                            :disabled="loading"
                            label=""
                          />
                        </molecules-form-item>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="loading" text @click="dismissDialog">{{ $t('common.action.discard') }}</v-btn>
          <v-btn :disabled="!valid" :loading="loading" color="primary" @click="handleSubmit(submit)">
            {{ $t('common.action.update') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </molecules-form>
  </v-dialog>
</template>

<script>
import { defineComponent, reactive, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const isVisible = ref(false)
    const taxProfileForm = reactive({})

    return {
      isVisible,
      taxProfileForm
    }
  },
  methods: {
    openDialog(taxProfile) {
      this.taxProfileForm = taxProfile
      this.isVisible = true
    },
    dismissDialog() {
      this.isVisible = false
    },
    submit() {
      this.$emit('submit', this.taxProfileForm)
      this.isVisible = false
    }
  }
})
</script>

<!-- FIXME: 'scoped' attribute not working for items generated by v-for -->
<style lang="scss">
.text-center {
  .v-input__control {
    .v-input__slot {
      .v-text-field__slot {
        input {
          text-align: center;
        }
      }
    }
  }
}
td.text-center {
  .v-input--checkbox {
    .v-input__control {
      .v-input__slot {
        .v-input--selection-controls__input {
          margin: auto;
        }
      }
    }
  }
}
</style>
