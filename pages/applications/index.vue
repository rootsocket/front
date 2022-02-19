<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <h1>{{ $t('applications') }}</h1>

      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet
      volutpat sapien. Integer pretium pellentesque lorem, at pellentesque arcu.
      Nam posuere arcu ac justo porta pellentesque. Aliquam imperdiet ultricies
      sapien quis blandit. Sed at augue gravida, sodales risus imperdiet,
      pulvinar nibh. Nunc lacinia arcu quam, vel efficitur ante egestas non. Sed
      ornare pellentesque luctus. Fusce quis euismod mauris.
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
      title: `${this.$t('applications')} - ${this.$config.projectTitle}`,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "applications": "Applications"
  },
  "es": {
    "applications": "Aplicaciones"
  }
}
</i18n>
