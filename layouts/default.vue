<template>
  <v-app>
    <div class="d-flex flex-grow-1">
      <!-- Navigation -->
      <v-navigation-drawer
        v-model="drawer"
        :light="menuTheme === 'light'"
        :dark="menuTheme === 'dark'"
        width="200"
        class="elevation-1"
        app
        floating
      >
        <!-- Navigation menu info -->
        <template #prepend>
          <div class="pa-2">
            <div class="title font-weight-bold text-uppercase primary--text">{{ product.name }}</div>
          </div>
        </template>

        <!-- Navigation menu -->
        <main-menu :menu="navigation.menu" />

        <!-- Navigation menu footer -->
        <template #append>
          <!-- Footer navigation links -->
          <div class="pa-1 text-center">
            <v-btn
              v-for="(item, index) in navigation.footer"
              :key="index"
              :href="item.href"
              :target="item.target"
              text
              small
            >
              {{ item.key ? $t(item.key) : item.text }}
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <!-- Toolbar -->
      <v-app-bar
        :flat="isToolbarDetached"
        :color="isToolbarDetached ? 'surface' : undefined"
        :light="toolbarTheme === 'light'"
        :dark="toolbarTheme === 'dark'"
        app
      >
        <v-card
          :flat="!isToolbarDetached"
          :class="[isToolbarDetached ? 'pa-1 mt-3 mx-1' : 'pa-0 ma-0']"
          class="flex-grow-1 d-flex"
        >
          <div class="d-flex flex-grow-1 align-center">
            <div class="d-flex flex-grow-1 align-center">
              <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

              <v-spacer />

              <div class="mr-1">
                <toolbar-notifications />
              </div>

              <toolbar-user />
            </div>
          </div>
        </v-card>
      </v-app-bar>

      <v-main>
        <v-container class="fill-height" :fluid="!isContentBoxed">
          <v-layout>
            <nuxt />
          </v-layout>
        </v-container>

        <v-footer app inset>
          <v-spacer />
          <div class="overline">
            Powered by
            <v-icon small color="primary">mdi-copyright</v-icon>
            <strong class="primary--text">HTC</strong>
            <small class="overline">v{{ product.version }}</small>
          </div>
        </v-footer>
      </v-main>
    </div>
    <atoms-right-drawer />

    <atoms-snackbar />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import MainMenu from '~/components/navigation/MainMenu'
import ToolbarUser from '~/components/toolbar/ToolbarUser'
import ToolbarNotifications from '~/components/toolbar/ToolbarNotifications'
import config from '@/configs'

export default {
  components: {
    MainMenu,
    ToolbarUser,
    ToolbarNotifications
  },
  data() {
    return {
      drawer: null,
      navigation: config.navigation
    }
  },
  computed: {
    ...mapState(['product', 'menuTheme', 'toolbarTheme', 'isToolbarDetached', 'isContentBoxed'])
  }
}
</script>
