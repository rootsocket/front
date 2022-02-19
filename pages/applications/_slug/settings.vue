<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <h1>{{ $t('settings') }}</h1>
    </AppPage>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  layout: 'application',
  auth: false,
  head() {
    return {
      title: `${this.$t('settings')} - ${this.$config.projectTitle}`,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "settings": "Settings"
  },
  "es": {
    "settings": "Ajustes"
  }
}
</i18n>
