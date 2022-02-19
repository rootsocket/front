<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <h1>{{ $t('keys') }}</h1>
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
      title: `${this.$t('keys')} - ${this.$config.projectTitle}`,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "keys": "Keys"
  },
  "es": {
    "keys": "Claves"
  }
}
</i18n>
