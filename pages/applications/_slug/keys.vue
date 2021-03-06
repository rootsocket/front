<template>
  <div
    class="flex flex-wrap-reverse"
    @keydown.esc="
      () => {
        deleteKey.show && toggleShowDeleteKey()
        createKey.show && toggleShowCreateKey()
      }
    "
  >
    <AppPage>
      <div
        class="flex flex-col md:flex-row justify-between md:items-center mb-6"
      >
        <h1 class="text-4xl">{{ $t('keys') }}</h1>
        <ButtonPressable
          v-if="(application.keys || []).length !== 0"
          variant="outline"
          :value="$t('createKey')"
          @click="toggleShowCreateKey"
        />
      </div>
      <div
        v-if="(application.keys || []).length === 0"
        class="w-full flex justify-center items-center"
      >
        <div class="flex flex-col items-center mt-10 mb-20">
          <div
            class="rounded-full h-20 w-20 flex flex-row items-center justify-center text-primary-500 bg-primary-100 dark:text-gray-100 dark:bg-gray-700"
          >
            <IconKey class="h-14 w-14" />
          </div>
          <span class="my-4 w-60 text-center text-gray-600">
            {{ $t('noKeys') }}
          </span>
          <ButtonPressable
            variant="outline"
            :value="$t('createKey')"
            @click="toggleShowCreateKey"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="key in application.keys || []"
          :key="key.identifier"
          class="w-full border dark:border-gray-800 rounded-md hover:shadow-sm flex flex-col items-start divide-y dark:divide-gray-800"
        >
          <div
            class="flex flex-row justify-between items-center w-full p-2 px-4 py-3"
          >
            <div class="flex flex-wrap flex-row items-center">
              <span class="mr-2 text-ellipsis overflow-hidden break-all">{{
                key.name
              }}</span>
              <AppBadge
                :value="`${$t('expires')} ${new Date(
                  key.expiresAt
                ).toLocaleDateString($i18n.locale, {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}`"
                :variant="getKeyExpirationVariant(key.expiresAt)"
                class="mr-2 whitespace-nowrap"
              />
            </div>
            <AppDropdown class="ml-4">
              <template #trigger="{ open, toggle }">
                <button
                  class="rounded-md hover:text-primary-500 focus:outline-none"
                  :class="{ 'opacity-0': open }"
                  @touchstart.stop.prevent="toggle"
                >
                  <div class="inline-flex items-center">
                    <span>{{ $t('actions') }}</span>
                    <IconDropdown class="w-6 h-6" />
                  </div>
                </button>
              </template>

              <ul class="px-4">
                <span
                  class="flex text-red-400 items-center leading-8 whitespace-nowrap cursor-pointer"
                  @click="toggleShowDeleteKey(key.identifier)"
                >
                  {{ $t('deleteKey') }}
                </span>
                <span
                  class="flex items-center hover:text-primary-500 leading-8 whitespace-nowrap cursor-pointer"
                  @click="copyKey(key.identifier)"
                >
                  {{ $t('copyKey') }}
                </span>
                <span
                  class="flex items-center hover:text-primary-500 leading-8 whitespace-nowrap cursor-pointer"
                  @click="copyConfig(key.identifier)"
                >
                  {{ $t('copyConfig') }}
                </span>
              </ul>
            </AppDropdown>
          </div>
        </div>
      </div>
    </AppPage>
    <AppModal
      :show="deleteKey.show"
      :title="$t('deleteKeyTitle')"
      @close="toggleShowDeleteKey"
    >
      <span class="my-2">{{ $t('deleteKeyDescription') }}</span>
      <div class="w-full flex justify-end mt-4">
        <ButtonPressable
          :value="$t('cancel')"
          variant="outline"
          class="mr-2"
          type="button"
          @click="toggleShowDeleteKey"
        />
        <ButtonPressable
          :value="$t('deleteKey')"
          variant="red"
          type="button"
          :loading="deleteKey.loading"
          @click="deleteKeyForm"
        />
      </div>
    </AppModal>
    <AppModal
      :show="createKey.show"
      :title="$t('createKey')"
      @close="toggleShowCreateKey"
    >
      <form @submit.prevent="createKeyForm">
        <TextLabel :value="$t('name')" />
        <TextInput
          v-model="createKey.name"
          :placeholder="$t('enterName')"
          type="text"
          margin
          required
        />

        <TextLabel :value="$t('expires')" />
        <TextInput v-model="createKey.dateExpire" type="date" margin required />

        <div class="w-full flex justify-end mt-4">
          <ButtonPressable
            :value="$t('cancel')"
            variant="outline"
            class="mr-2"
            type="button"
            @click="toggleShowCreateKey"
          />
          <ButtonPressable
            :value="$t('createKey')"
            variant="primary"
            type="submit"
            :loading="createKey.loading"
          />
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getCurrentApplication } from '@/utils/application'
import { getErrorMessage } from '~/utils/error'

export default Vue.extend({
  layout: 'application',
  data() {
    return {
      deleteKey: {
        identifier: '',
        show: false,
        loading: false,
      },
      createKey: {
        name: '',
        dateExpire: undefined,
        show: false,
        loading: false,
      },
    }
  },
  head() {
    return {
      title: `${this.$t('keys')} - ${this.$config.projectTitle}`,
    }
  },
  computed: {
    application() {
      return getCurrentApplication(this.$store.state, this.$route.params.slug)
    },
  },
  methods: {
    getKeyExpirationVariant(expiresAt: number): string {
      const d = new Date(expiresAt).getTime()
      const n = new Date().getTime()
      const result = d - n
      const maxTime = 24 * 60 * 60 * 1000

      if (result <= 0) {
        return 'red'
      } else if (result <= maxTime) {
        return 'warning'
      } else {
        return 'default'
      }
    },
    toggleShowDeleteKey(identifier = '') {
      this.deleteKey.show = !this.deleteKey.show
      this.deleteKey.identifier = identifier
    },
    toggleShowCreateKey() {
      this.createKey.show = !this.createKey.show
      this.createKey.name = ''
    },
    copyKey(identifier: string) {
      navigator.clipboard.writeText(identifier)
      this.$toast.show(this.$t('copiedKey'))
    },
    copyConfig(identifier: string) {
      navigator.clipboard.writeText(
        `APPLICATION_IDENTIFIER=${this.application.identifier}\nKEY_TOKEN=${identifier}`
      )
      this.$toast.show(this.$t('copiedConfig'))
    },
    async createKeyForm() {
      try {
        this.createKey.loading = true
        await this.$store.dispatch('application/createKey', {
          identifier: this.application.identifier,
          expiresAt:
            this.createKey.dateExpire ??
            new Date(Date.UTC(9999, 1)).toISOString(),
          name: this.createKey.name,
        })
        this.toggleShowCreateKey()
        this.$toast.show(this.$t('keyCreated'))
      } catch (e) {
        this.$toast.show(getErrorMessage(e))
      } finally {
        this.createKey.loading = false
      }
    },
    async deleteKeyForm() {
      try {
        this.deleteKey.loading = true
        await this.$store.dispatch('application/deleteKey', {
          identifier: this.application.identifier,
          keyIdentifier: this.deleteKey.identifier,
        })
        this.toggleShowDeleteKey()
        this.$toast.show(this.$t('keyDeleted'))
      } catch (e) {
        this.$toast.show(getErrorMessage(e))
      } finally {
        this.deleteKey.loading = false
      }
    },
  },
})
</script>

<i18n>
{
  "en": {
    "cancel": "Cancel",
    "keys": "Keys",
    "name": "Name",
    "enterName": "Enter name",
    "expires": "Expires",
    "actions": "Actions",
    "deleteKey": "Delete key",
    "copyKey": "Copy key",
    "copyConfig": "Copy config",
    "deleteKeyTitle": "Confirm deletion",
    "deleteKeyDescription": "After you confirm this action, we won't be able to generate any more connection with this key. Takes up to 30 minutes to remove it from our system.",
    "createKey": "Create key",
    "copiedKey": "Copied key",
    "copiedConfig": "Copied application configuration",
    "noKeys": "There are no keys available for this application",
    "keyCreated": "Key created",
    "keyDeleted": "Key deleted"
  },
  "es": {
    "cancel": "Cancelar",
    "keys": "Claves",
    "name": "Nombre",
    "enterName": "Introduce un nombre",
    "expires": "Caduca",
    "actions": "Acciones",
    "deleteKey": "Eliminar clave",
    "copyKey": "Copiar clave",
    "copyConfig": "Copiar config",
    "deleteKeyTitle": "Confirmar eliminación",
    "deleteKeyDescription": "Después de confirmar esta acción, no se podrán generar más conexiones con esta clave. Puede tardar hasta 30 minutos en eliminarla de nuestro sistema.",
    "createKey": "Crear clave",
    "copiedKey": "Clave copiada con éxito",
    "copiedConfig": "Configuración de la aplicación copiada",
    "noKeys": "No hay claves disponibles para esta aplicación",
    "keyCreated": "Clave creada",
    "keyDeleted": "Clave eliminada"
  }
}
</i18n>
