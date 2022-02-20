<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <h1>{{ $t('billing') }}</h1>
      <span>{{ $t('noBill') }}</span>
    </AppPage>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  layout: 'user',
  auth: false,
  head() {
    return {
      title: `${this.$t('billing')} - ${this.$config.projectTitle}`,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "billing": "Billing",
    "noBill": "We don't bill for connections or messages yet"
  },
  "es": {
    "billing": "Facturación",
    "noBill": "Aún no facturamos por las conexiones o mensajes"
  }
}
</i18n>
