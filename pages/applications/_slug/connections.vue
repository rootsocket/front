<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <h1>{{ $t('connections') }}</h1>
      <span>{{ $t('unavailable') }}</span>
    </AppPage>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getCurrentApplication } from '@/utils/application'

export default Vue.extend({
  layout: 'application',
  auth: false,
  head() {
    return {
      title: `${this.$t('connections')} - ${this.$config.projectTitle}`,
    }
  },
  computed: {
    application() {
      return getCurrentApplication(this.$store.state, this.$route.params.slug)
    },
  },
})
</script>

<i18n>
{
  "en": {
    "connections": "Connections",
    "unavailable": "This section is currently unavailable"
  },
  "es": {
    "connections": "Conexiones",
    "unavailable": "Esta sección no está disponible ahora mismo"
  }
}
</i18n>
