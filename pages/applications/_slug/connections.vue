<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <h1>{{ $t('connections') }}</h1>

      <div v-if="true" class="w-full flex justify-center items-center">
        <div class="flex flex-col items-center mt-10 mb-20">
          <div
            class="rounded-full h-20 w-20 flex flex-row items-center justify-center text-primary-500 bg-primary-100 dark:text-gray-100 dark:bg-gray-700"
          >
            <IconSensor class="h-14 w-14" />
          </div>
          <span class="my-4 w-60 text-center text-gray-600">
            {{ $t('noConnections') }}
          </span>
          <ButtonPressable variant="outline" :value="$t('readMore')" />
        </div>
      </div>
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
    "noConnections": "There are no connections available for this application",
    "readMore": "Read configuration steps"
  },
  "es": {
    "connections": "Conexiones",
    "noConnections": "No hay conexiones disponibles para esta aplicación",
    "readMore": "Leer pasos de configuración"
  }
}
</i18n>
