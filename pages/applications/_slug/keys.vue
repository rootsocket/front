<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <div class="flex flex-col md:flex-row justify-between md:items-center">
        <h1>{{ $t('keys') }}</h1>
        <ButtonPressable
          class="mb-8"
          variant="outline"
          :value="$t('createKey')"
          @click="toggleShowCreateKey"
        />
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="key in application.keys"
          :key="key.token"
          class="w-full p-4 pt-2 border dark:border-gray-800 rounded-md hover:shadow-sm flex flex-row justify-between items-center"
        >
          <div class="flex flex-row flex-wrap space-y-2">
            <div></div>
            <AppBadge
              :value="$t(key.type)"
              :variant="key.type === KeyType.private ? 'green' : 'default'"
              class="mr-2"
            />
            <AppBadge
              :value="`${$t('expires')} ${new Date(
                key.expires
              ).toLocaleDateString('default', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}`"
              variant="default"
              class="mr-2"
            />
            <AppBadge
              v-for="host in key.hosts"
              :key="host"
              :value="host"
              variant="default"
              class="mr-2"
            />
          </div>
          <AppDropdown class="inline-flex ml-4">
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
                @click="showDeleteToken(key.token)"
              >
                {{ $t('deleteKey') }}
              </span>
              <span
                class="flex items-center hover:text-primary-500 leading-8 whitespace-nowrap cursor-pointer"
                @click="copyKey(key.token)"
              >
                {{ $t('copyKey') }}
              </span>
              <span
                class="flex items-center hover:text-primary-500 leading-8 whitespace-nowrap cursor-pointer"
                @click="copyConfig(key.token)"
              >
                {{ $t('copyConfig') }}
              </span>
            </ul>
          </AppDropdown>
        </div>
      </div>
    </AppPage>
    <AppModal
      :show="selectedKey.show"
      :title="$t('deleteKeyTitle')"
      @close="toggleShowDeleteKey"
    >
      <span>{{ $t('deleteKeyDescription') }}</span>

      <div class="w-full flex justify-end mt-4">
        <ButtonPressable
          :value="$t('cancel')"
          variant="outline"
          class="mr-2"
          type="button"
          @click="toggleShowDeleteKey"
        />
        <ButtonPressable :value="$t('deleteKey')" variant="red" type="submit" />
      </div>
    </AppModal>
    <AppModal
      :show="createKey.show"
      :title="$t('createKey')"
      @close="toggleShowCreateKey"
    >
      <form @submit.prevent="createKeyForm">
        <TextLabel :value="$t('keyType')" />
        <TextSelect
          v-model="createKey.type"
          :options="[
            { value: KeyType.private, text: $t(KeyType.private) },
            { value: KeyType.public, text: $t(KeyType.public) },
          ]"
          required
        />
        <TextLabel :value="$t('expires')" />
        <TextInput
          v-model="createKey.dateExpire"
          :placeholder="$t('enterName')"
          type="date"
          margin
          required
        />

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
          />
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getCurrentApplication } from '@/utils/application'
import { KeyType } from '@/types/application'

export default Vue.extend({
  layout: 'application',
  auth: false,
  data() {
    return {
      selectedKey: {
        token: '',
        show: false,
      },
      createKey: {
        type: KeyType.private,
        dateExpire: '',
        show: false,
      },
    }
  },
  head() {
    return {
      title: `${this.$t('keys')} - ${this.$config.projectTitle}`,
    }
  },
  computed: {
    KeyType() {
      return KeyType
    },
    application() {
      return getCurrentApplication(this.$store.state, this.$route.params.slug)
    },
  },
  methods: {
    showDeleteKey(token: string) {
      this.selectedKey.token = token
      this.toggleShowDeleteKey()
    },
    toggleShowDeleteKey() {
      this.selectedKey.show = !this.selectedKey.show
      this.selectedKey.token = ''
    },
    toggleShowCreateKey() {
      this.createKey.show = !this.createKey.show
      this.createKey.type = KeyType.private
    },
    copyKey(token: string) {
      navigator.clipboard.writeText(token)
    },
    copyConfig(token: string) {
      navigator.clipboard.writeText(
        `APPLICATION_IDENTIFIER=${this.application.identifier}\nKEY_TOKEN=${token}`
      )
    },
    createKeyForm() {},
  },
})
</script>

<i18n>
{
  "en": {
    "cancel": "Cancel",
    "keys": "Keys",
    "expires": "Expires",
    "public": "Public",
    "private": "Private",
    "actions": "Actions",
    "deleteKey": "Delete key",
    "copyKey": "Copy key",
    "copyConfig": "Copy config",
    "deleteKeyTitle": "Confirm deletion",
    "deleteKeyDescription": "After you confirm this action, we won't be able to generate any more connection with this key. Takes up to 5 minutes to remove it from our system.",
    "createKey": "Create key",
    "keyType": "Key type",
    "public": "Public",
    "private": "Private"
  },
  "es": {
    "cancel": "Cancelar",
    "keys": "Claves",
    "expires": "Caduca",
    "public": "Pública",
    "private": "Privada",
    "actions": "Acciones",
    "deleteKey": "Eliminar clave",
    "copyKey": "Copiar clave",
    "copyConfig": "Copiar config",
    "deleteKeyTitle": "Confirmar eliminación",
    "deleteKeyDescription": "Después de confirmar esta acción, no se podrán generar más conexiones con esta clave. Puede tardar hasta 5 minutos en eliminarla de nuestro sistema.",
    "createKey": "Crear clave",
    "keyType": "Tipo de clave",
    "public": "Pública",
    "private": "Privada"
  }
}
</i18n>
