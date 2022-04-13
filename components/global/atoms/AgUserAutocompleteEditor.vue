<template>
  <v-autocomplete
    ref="autocomplete"
    v-model="value"
    :search-input.sync="search"
    :items="items"
    :item-text="'name'"
    :item-value="'id'"
    hide-no-data
    persistent-hint
    return-object
    hide-details
    solo
    flat
    dense
  >
    <v-icon v-if="value" slot="append" small @click="value = null">mdi-close-circle-outline</v-icon>
  </v-autocomplete>
</template>

<script>
import _ from 'lodash'
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  data() {
    return {
      value: null,
      search: null,
      items: []
    }
  },
  watch: {
    search: _.debounce(function (keyword) {
      this.fetchUsers(keyword)
    }, 300)
  },
  mounted() {
    if (this.params.value) {
      this.items = [JSON.parse(JSON.stringify(this.params.value))]
    }

    this.value = this.params.value
    this.fetchUsers((this.params.value || {}).name || '')

    this.$nextTick(() => {
      this.$refs.autocomplete.focus()
      this.$refs.autocomplete.activateMenu()
    })
  },
  methods: {
    async fetchUsers(keyword) {
      try {
        const { result } = await this.$api.user.getUsers({
          filter: keyword
        })
        const resultItems = _.map((result || {}).items || [], (item) => item)
        if (resultItems.length === 0 && this.value) {
          this.items = [JSON.parse(JSON.stringify(this.value))]
          return
        }
        this.items = resultItems
      } catch (e) {
        window.console.error(e)
      }
    },
    getValue() {
      return this.value
    },
    isCancelBeforeStart() {
      return false
    },
    isCancelAfterEnd() {
      // editor will reject any value is null
      return !this.value
    }
  }
})
</script>
