<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <h1>{{ $t('connections') }}</h1>
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
      title: `${this.$t('connections')} - ${this.$config.projectTitle}`,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "connections": "Connections"
  },
  "es": {
    "connections": "Conexiones"
  }
}
</i18n>
