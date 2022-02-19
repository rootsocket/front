<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <h1>{{ $t('debug') }}</h1>
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
      title: `${this.$t('debug')} - ${this.$config.projectTitle}`,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "debug": "Debug"
  },
  "es": {
    "debug": "Depurar"
  }
}
</i18n>
