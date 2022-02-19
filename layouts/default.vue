<template>
  <Nuxt />
</template>

<script lang="js">
import Vue from 'vue'
import {paperCupsLifeHook} from '~/utils/papercups'

export default Vue.extend({
    mounted: paperCupsLifeHook.unmounted,
})
</script>
