<template>
  <div class="pt-16">
    <AppHeader />

    <main class="container mx-auto px-4 lg:px-8">
      <div class="flex flex-wrap relative">
        <AppNav />

        <Nuxt class="w-full lg:w-4/5 mx-auto" />
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script lang="js">
import Vue from 'vue'
import {paperCupsLifeHook} from '~/utils/papercups'

export default Vue.extend({
  mounted: paperCupsLifeHook.mounted,
})
</script>
