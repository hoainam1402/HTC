<template>
  <v-card v-if="error.statusCode === 404" class="text-center error-page pa-3" flat>
    <v-img src="/images/illustrations/404-illustration.svg" max-height="400" contain />
    <div class="display-2 mt-10">How did you get here?</div>
    <div class="mt-3 mb-6">{{ pageNotFound }}</div>
    <v-btn :to="localePath('/')" block large color="primary">Send me Back</v-btn>
  </v-card>
  <v-card v-else class="text-center error-page pa-3" flat>
    <v-img src="/images/illustrations/500-illustration.svg" max-height="400" contain />
    <div class="display-2 mt-10">OOPS! Something went wrong here</div>
    <div class="mt-3 mb-10">{{ otherError }}</div>
    <v-btn :to="localePath('/')" block large color="primary">Send me back</v-btn>
  </v-card>
</template>

<script>
export default {
  layout: 'simple',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: 'Sorry we can not seem to find the page you are looking for.',
      otherError: 'Our experts are working to fix the issue.'
    }
  },
  head() {
    const title = this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>
