<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <h1>{{ $t('billing') }}</h1>
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
    "billing": "Billing"
  },
  "es": {
    "billing": "Facturación"
  }
}
</i18n>
