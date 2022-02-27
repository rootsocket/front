<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <div class="flex flex-col md:flex-row justify-between md:items-center">
        <h1>{{ $t('members') }}</h1>
        <ButtonPressable
          v-if="application.members.length !== 0"
          class="mb-8"
          variant="outline"
          :value="$t('addMember')"
          @click="toggleShowAddMember"
        />
      </div>
      <div
        v-if="application.members.length === 0"
        class="w-full flex justify-center items-center"
      >
        <div class="flex flex-col items-center mt-10 mb-20">
          <div
            class="rounded-full h-20 w-20 flex flex-row items-center justify-center text-primary-500 bg-primary-100 dark:text-gray-100 dark:bg-gray-700"
          >
            <IconGroup class="h-14 w-14" />
          </div>
          <span class="my-4 w-60 text-center text-gray-600">
            {{ $t('membersWarning') }}
          </span>
          <ButtonPressable
            variant="outline"
            :value="$t('addMember')"
            @click="toggleShowAddMember"
          />
        </div>
      </div>
    </AppPage>

    <AppModal
      :show="addMember.show"
      :title="$t('addMember')"
      @close="toggleShowAddMember"
    >
      <form @submit.prevent="addMemberForm">
        <TextLabel :value="$t('email')" />
        <TextInput
          v-model="addMember.email"
          :placeholder="$t('enterEmail')"
          type="email"
          margin
          required
        />

        <div class="w-full flex justify-end mt-4">
          <ButtonPressable
            :value="$t('cancel')"
            variant="outline"
            class="mr-2"
            type="button"
            @click="toggleShowAddMember"
          />
          <ButtonPressable
            :value="$t('addMember')"
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

export default Vue.extend({
  layout: 'application',
  data() {
    return {
      addMember: {
        email: '',
        show: false,
      },
    }
  },
  head() {
    return {
      title: `${this.$t('members')} - ${this.$config.projectTitle}`,
    }
  },
  computed: {
    application() {
      return getCurrentApplication(this.$store.state, this.$route.params.slug)
    },
  },
  methods: {
    toggleShowAddMember() {
      this.addMember.show = !this.addMember.show
      this.addMember.email = ''
    },
    addMemberForm() {},
  },
})
</script>

<i18n>
{
  "en": {
      "members": "Members",
      "membersWarning": "There are no other account related to this application",
      "addMember": "Add member",
      "email": "Email",
      "enterEmail": "Enter email",
      "cancel": "Cancel"
  },
  "es": {
      "members": "Miembros",
      "membersWarning": "No hay ninguna otra cuenta relacionada con esta aplicación",
      "addMember": "Añadir miembro",
      "email": "Correo electrónico",
      "enterEmail": "Introduce un correo electrónico",
      "cancel": "Cancelar"
  }
}
</i18n>
