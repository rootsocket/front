<template>
  <div
    class="flex flex-wrap-reverse"
    @keydown.esc="
      () => {
        sendEvent.show && toggleShowSendEvent()
      }
    "
  >
    <AppPage :class="{ 'lg:w-3/4': isConnected }">
      <div class="flex flex-col md:flex-row justify-between md:items-center">
        <h1>{{ $t('debug') }}</h1>
        <ButtonPressable
          v-if="isConnected"
          class="mb-7"
          :class="{ 'animate-pulse': tutorialStart }"
          variant="outline"
          :value="$t('sendEvent')"
          @click="toggleShowSendEvent"
        />
      </div>

      <div v-if="!isConnected" class="w-full flex justify-center items-center">
        <div class="flex flex-col items-center mt-10 mb-20">
          <div
            class="rounded-full h-20 w-20 flex flex-row items-center justify-center text-primary-500 bg-primary-100 dark:text-gray-100 dark:bg-gray-700"
          >
            <IconBug class="h-14 w-14" />
          </div>
          <span class="my-4 w-60 text-center text-gray-600">
            {{ $t('debugWarning') }}
          </span>
          <ButtonPressable
            variant="outline"
            :value="$t('connectDebugger')"
            :loading="loading"
            @click="startDebugger"
          />
        </div>
      </div>
      <div v-else>
        <div
          v-if="logs.length === 0"
          class="w-full flex justify-center items-center"
        >
          <div class="flex flex-row items-center mt-10 mb-20">
            <span class="text-center text-gray-600">
              {{ $t('waitingDebugger') }}
            </span>
          </div>
        </div>
        <div v-else>
          <AppLog
            v-for="(log, idx) in filteredLogs || []"
            :key="idx"
            :log="log"
          />
        </div>
      </div>
    </AppPage>
    <AppToc v-if="isConnected" :title="$t('options')">
      <div
        class="w-full relative"
        @keydown.down="increment"
        @keydown.up="decrement"
        @keydown.enter="go"
      >
        <label for="search" class="sr-only">{{ $t('searchEvents') }}</label>
        <div class="relative">
          <input
            id="search"
            ref="search"
            v-model="search"
            class="block w-full py-2 px-3 truncate leading-5 placeholder-gray-500 border border-transparent text-gray-700 dark:text-white dark-focus:text-white focus:border-gray-300 dark-focus:border-gray-700 rounded-md focus:outline-none focus:bg-white dark-focus:bg-gray-900 bg-gray-50 dark:bg-gray-800"
            :placeholder="$t('searchEvents')"
            type="search"
            autocomplete="off"
          />
        </div>
      </div>
      <ButtonIcon
        :class="{ 'animate-pulse': tutorialStart }"
        :title="$t('channels')"
        @click="toggleShowSendChannel"
        ><IconWorkspace
      /></ButtonIcon>
      <ButtonIcon
        :title="$t(isPaused ? 'resumeLogs' : 'pauseLogs')"
        @click="togglePauseLogs"
        ><IconPlay v-if="isPaused" /><IconPause v-else
      /></ButtonIcon>
      <ButtonIcon :title="$t('clearLogs')" @click="deleteLogs"
        ><IconX
      /></ButtonIcon>
    </AppToc>

    <AppModal
      :show="sendEvent.show"
      :title="$t('sendEvent')"
      @close="toggleShowSendEvent"
    >
      <form @submit.prevent="sendEventForm">
        <TextLabel :value="$t('channel')" />
        <TextInput
          v-model="sendEvent.channel"
          :placeholder="$t('enterChannel')"
          type="text"
          margin
          required
        />
        <TextLabel :value="$t('data')" />
        <TextArea
          v-model="sendEvent.data"
          :placeholder="$t('enterData')"
          margin
          required
        />

        <div class="w-full flex justify-end mt-4">
          <ButtonPressable
            :value="$t('cancel')"
            variant="outline"
            class="mr-2"
            type="button"
            @click="toggleShowSendEvent"
          />
          <ButtonPressable
            :value="$t('sendEvent')"
            variant="primary"
            type="submit"
            :loading="sendEvent.loading"
          />
        </div>
      </form>
    </AppModal>

    <AppModal
      :show="sendChannel.show"
      :title="$t('channels')"
      @close="toggleShowSendChannel"
    >
      <div class="overflow-x w-full h-16 border-b border-t mb-4">
        <div
          v-if="subscriptions.length === 0"
          class="w-full text-center text-gray-600 dark:text-gray-300 h-16 flex justify-center items-center"
        >
          {{ $t('noSubs') }}
        </div>
        <div v-else class="flex flex-row overflow-x-auto">
          <ButtonIcon
            v-for="(s, idx) in subscriptions"
            :key="idx"
            :title="s"
            class="mr-2"
            @click="unsubscribe(s)"
            ><IconX
          /></ButtonIcon>
        </div>
      </div>
      <form @submit.prevent="subscribe">
        <TextLabel :value="$t('channel')" />
        <TextInput
          v-model="sendChannel.channel"
          :placeholder="$t('enterChannel')"
          type="text"
          margin
          required
        />

        <div class="w-full flex justify-end mt-4">
          <ButtonPressable
            :value="$t('cancel')"
            variant="outline"
            class="mr-2"
            type="button"
            @click="toggleShowSendChannel"
          />
          <ButtonPressable
            :value="$t('sendChannel')"
            variant="primary"
            type="submit"
          />
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script lang="ts">
import RootSocket, {
  SUBSCRIPTION_ADD,
  SUBSCRIPTION_REMOVE,
  ERROR,
  isError,
  stringToMessage,
} from 'rootsocketjs'
import Vue from 'vue'
import { getCurrentApplication } from '@/utils/application'
import { TokenType } from '~/types/application'
import { EventDirection } from '~/types/log'

const isDev = process.env.NODE_ENV === 'development'

export default Vue.extend({
  layout: 'application',
  data(): {
    rootSocket?: RootSocket
    isConnected: boolean
    isPaused: boolean
    logs: Array<any>
    loading: boolean
    sendEvent: any
    sendChannel: any
    search: string
    subscriptions: Array<string>
  } {
    return {
      loading: false,
      rootSocket: undefined,
      isConnected: false,
      isPaused: false,
      logs: [],
      search: '',
      sendEvent: {
        show: false,
        channel: '',
        data: '',
        loading: false,
      },
      sendChannel: {
        show: false,
        channel: '',
      },
      subscriptions: [],
    }
  },
  head() {
    return {
      title: `${this.$t('debug')} - ${this.$config.projectTitle}`,
    }
  },
  computed: {
    application() {
      return getCurrentApplication(this.$store.state, this.$route.params.slug)
    },
    tutorialStart(): boolean {
      return !!(this.rootSocket && this.logs.length === 0)
    },
    EventDirection() {
      return EventDirection
    },
    filteredLogs(): Array<any> {
      return this.logs.filter((i) => {
        const item = JSON.parse(i.data)
        return (
          item.event.includes(this.search) ||
          (item.data.includes && item.data.includes(this.search))
        )
      })
    },
  },
  methods: {
    addLog(direction: EventDirection, data: string) {
      if (this.isPaused) return

      this.logs.unshift({
        direction,
        data,
        time: new Date().getTime(),
      })
    },
    deleteLogs() {
      this.logs = []
      this.$toast.show(this.$t('logsDeleted'))
    },
    async sendEventForm() {
      await this.rootSocket?.send(this.sendEvent.channel, this.sendEvent.data)
      this.addLog(
        EventDirection.send,
        JSON.stringify({
          event: this.sendEvent.channel,
          data: this.sendEvent.data,
        })
      )
      this.toggleShowSendEvent()
      this.$toast.show(this.$t('eventSent'))
    },
    toggleShowSendEvent() {
      this.sendEvent.show = !this.sendEvent.show
    },
    toggleShowSendChannel() {
      this.sendChannel.show = !this.sendChannel.show
      this.sendChannel.channel = ''
    },
    togglePauseLogs() {
      if (this.isPaused) {
        this.$toast.show(this.$t('logsResumed'))
      } else {
        this.$toast.show(this.$t('logsPaused'))
      }

      this.isPaused = !this.isPaused
    },
    getConnectionUrl(): string {
      // we need this because we want different structure locally in dev compared with prod
      const suffix = '/api/v1/connections/'
      const protocol = location.protocol
      if (isDev) {
        return `${protocol}//${process.env.wsDomain!}${suffix}`
      }

      return `${protocol}//${this.application.region}.${process.env
        .wsDomain!}${suffix}`
    },
    getServerUrl(): string {
      if (isDev) {
        return process.env.wsDomain!
      }

      return `${this.application.region}.${process.env.wsDomain!}`
    },
    async subscribe() {
      if (
        (this.rootSocket?.getSubscriptions() ?? []).find(
          (i: string) => i === this.sendChannel.channel
        )
      ) {
        // we don't want to register twice the same to the same channel, it would duplicate logs
        this.$toast.show(this.$t('alreadySubscribed'))
        return
      }

      // clone the string, it will save empty channels if we don't do this
      const channel = `${this.sendChannel.channel}`

      await this.rootSocket?.subscribe(this.sendChannel.channel, (d) => {
        if (this.isPaused) return

        // this handles messages we receive from subscribe
        this.addLog(
          EventDirection.receive,
          JSON.stringify({
            event: channel,
            data: d.raw,
          })
        )
      })

      this.addLog(
        EventDirection.send,
        JSON.stringify({
          event: SUBSCRIPTION_ADD,
          data: { channel: this.sendChannel.channel },
        })
      )

      this.subscriptions = this.rootSocket?.getSubscriptions() ?? []
      this.toggleShowSendChannel()
    },
    async unsubscribe(channel: string) {
      await this.rootSocket?.unsubscribeAll(channel)

      this.addLog(
        EventDirection.send,
        JSON.stringify({
          event: SUBSCRIPTION_REMOVE,
          data: { channel },
        })
      )

      this.subscriptions = this.rootSocket?.getSubscriptions() ?? []
    },
    async startDebugger() {
      this.loading = true

      try {
        const { token } = await this.$store.dispatch(
          'application/createToken',
          {
            action: TokenType.createConnection,
            identifier: this.application.identifier,
          }
        )

        this.rootSocket = new RootSocket({
          server: this.getServerUrl(),
          connectionUrl: this.getConnectionUrl(),
          fetchOptions: {
            headers: { Authorization: token },
          },
          debug: isDev,
          disableTLS: isDev,
        })
        this.rootSocket.onRawOpen = (ev: MessageEvent) => {
          this.isConnected = true
          this.loading = false
          this.rootSocket?.onMessageOpen(ev)
        }

        this.rootSocket.onRawClose = (ev: CloseEvent) => {
          this.isConnected = false
          this.loading = false
          this.$toast.show(ev.reason)
          this.rootSocket?.onMessageClose(ev)
          this.logs = []
          this.subscriptions = []
        }

        this.rootSocket.onRawError = (ev: MessageEvent) => {
          this.$toast.show(ev.data)
          this.rootSocket?.onMessageError(ev)
        }

        this.rootSocket.onRawReceive = (ev: MessageEvent) => {
          // we want to handle it asap or getSubscriptions will fail
          this.rootSocket?.onMessageReceive(ev)

          const msg = stringToMessage(ev.data)
          if (isError(msg)) {
            this.addLog(
              EventDirection.receive,
              JSON.stringify({
                event: ERROR,
                data: msg.data,
              })
            )

            // handles cases where a unsubscribe message comes
            this.subscriptions = this.rootSocket?.getSubscriptions() ?? []
          }
        }

        try {
          this.logs = []
          await this.rootSocket?.connect()
        } catch (e) {
          this.$toast.show(e)
          this.loading = false
        }
      } catch (e) {
        this.$toast.show(e)
      }
    },
  },
})
</script>

<i18n>
{
  "en": {
    "debug": "Debug",
    "connectDebugger": "Connect debugger",
    "debugWarning": "You will be able to subscribe to channels, send and read messages",
    "createKey": "Create a debugger key",
    "waitingDebugger": "Subscribe to a channel or send an event to start",
    "options": "Options",
    "searchEvents": "Search events",
    "pauseLogs": "Pause logs",
    "resumeLogs": "Resume logs",
    "clearLogs": "Clear logs",
    "sendEvent": "Send event",
    "channels": "Channels",
    "logsDeleted": "Logs deleted",
    "logsPaused": "Logs paused",
    "logsResumed": "Logs resumed",
    "eventSent": "Event sent",
    "channel": "Channel",
    "enterChannel": "Enter channel",
    "cancel": "Cancel",
    "data": "Data",
    "enterData": "Enter data",
    "sendChannel": "Subscribe to channel",
    "noSubs": "No active subscriptions",
    "alreadySubscribed": "There is an active subscription for that channel"
  },
  "es": {
    "debug": "Depurar",
    "connectDebugger": "Conectar depurador",
    "debugWarning": "Podrás subsribirte a canales, recibir y enviar mensajes",
    "createKey": "Crea una clave depuradora",
    "waitingDebugger": "Suscríbete a un canal o envía un evento para empezar",
    "options": "Opciones",
    "searchEvents": "Buscar eventos",
    "pauseLogs": "Pausar logs",
    "resumeLogs": "Reanudar logs",
    "clearLogs": "Borrar logs",
    "sendEvent": "Enviar evento",
    "channels": "Canales",
    "logsDeleted": "Logs eliminados",
    "logsPaused": "Logs pausados",
    "logsResumed": "Logs resumidos",
    "eventSent": "Evento enviado",
    "channel": "Canal",
    "enterChannel": "Introduce canal",
    "cancel": "Cancelar",
    "data": "Datos",
    "enterData": "Introduce datos",
    "sendChannel": "Suscribirse al canal",
    "noSubs": "Ninguna suscripción activa",
    "alreadySubscribed": "Ya hay una suscripción activa para ese canal"
  }
}
</i18n>
