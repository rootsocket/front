<template>
  <div
    class="cursor-pointer mb-4 w-full border dark:border-gray-800 rounded-md hover:shadow-sm flex flex-col items-start divide-y dark:divide-gray-800"
  >
    <div
      class="flex flex-row justify-between items-center w-full p-2 px-4 py-3 select-none"
      @click="toggleShowFull"
    >
      <div>
        <AppBadge
          :value="
            $t(log.direction === EventDirection.receive ? 'received' : 'sent')
          "
          :variant="log.direction === EventDirection.receive ? 'red' : 'green'"
          class="mr"
        />
        <AppBadge :value="new Date(log.time).toLocaleTimeString()" class="mr" />
        <AppBadge
          :value="$t('eventData', { name: JSON.parse(log.data).event })"
          class="mr"
        />
        <AppBadge
          v-if="eventData"
          :value="
            $t('eventDataRaw', {
              data: `${eventData.slice(0, 10)}...`,
            })
          "
          class="mr"
        />
      </div>
      <div class="inline-flex items-center select-none">
        <span>{{ $t(showFull ? 'seeLess' : 'seeMore') }}</span>
        <IconDropdown
          class="w-6 h-6"
          :class="{ 'transform rotate-180': showFull }"
        />
      </div>
    </div>

    <span v-if="showFull" class="w-full p-4 select-all">{{ log.data }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { EventDirection } from '~/types/log'

export default Vue.extend({
  props: {
    log: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      showFull: false,
    }
  },
  computed: {
    EventDirection() {
      return EventDirection
    },
    eventData(): any {
      return JSON.stringify(JSON.parse(this.log.data).data)
    },
  },
  methods: {
    toggleShowFull() {
      this.showFull = !this.showFull
    },
  },
})
</script>

<i18n>
{
  "en": {
    "received": "Received",
    "sent": "Sent",
    "seeMore": "See more",
    "seeLess": "See less",
    "eventData": "Event: {name}",
    "eventDataRaw": "Data: {data}"
  },
  "es": {
    "received": "Recibido",
    "sent": "Enviado",
    "seeMore": "Ver más",
    "seeLess": "Ver menos",
    "eventData": "Evento: {name}",
    "eventDataRaw": "Datos: {data}"
  }
}
</i18n>
