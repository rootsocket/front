<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <h1>{{ $t('debug') }}</h1>
      <div class="w-full flex justify-center items-center">
        <div class="flex flex-col items-center mt-10 mb-20">
          <div
            class="rounded-full h-20 w-20 flex flex-row items-center justify-center text-primary-500 bg-primary-100 dark:text-gray-100 dark:bg-gray-700"
          >
            <IconBug class="h-14 w-14" />
          </div>
          <span class="my-4 w-60 text-center text-gray-600">
            {{ $t('debugWarning') }}
          </span>
          <ButtonPressable variant="outline" :value="$t('connectDebugger')" />
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
  head() {
    return {
      title: `${this.$t('debug')} - ${this.$config.projectTitle}`,
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
    "debug": "Debug",
    "connectDebugger": "Connect debugger",
    "debugWarning": "You will receive all messages associated with this application"
  },
  "es": {
    "debug": "Depurar",
    "connectDebugger": "Conectar depurador",
    "debugWarning": "Recibirás todos los mensajes asociados a esta aplicación"
  }
}
</i18n>
