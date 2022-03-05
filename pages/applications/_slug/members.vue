<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <div class="flex flex-col md:flex-row justify-between md:items-center">
        <h1>{{ $t('members') }}</h1>
        <ButtonPressable
          v-if="application.members.length !== 0 && isApplicationOwner"
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
            v-if="isApplicationOwner"
            variant="outline"
            :value="$t('addMember')"
            @click="toggleShowAddMember"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="member in application.members"
          :key="member.identifier"
          class="w-full border dark:border-gray-800 rounded-md hover:shadow-sm flex flex-col items-start divide-y dark:divide-gray-800"
        >
          <div
            class="flex flex-row justify-between items-center w-full py-2 px-4 h-16"
          >
            <div>
              <span>{{ member.email }}</span>
              <AppBadge
                :value="$t(member.role)"
                :variant="member.role === UserRole.owner ? 'green' : 'default'"
                class="md:ml-2"
              />
            </div>
            <ButtonPressable
              v-if="canRemoveMember(member)"
              variant="outline-red"
              :value="$t('remove')"
            />
          </div>
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
import { Member, UserRole } from '~/types/application'

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
    isApplicationOwner() {
      return getCurrentApplication(
        this.$store.state,
        this.$route.params.slug
      ).members.some(
        (i) => i.email === this.$auth.user?.email && i.role === UserRole.owner
      )
    },
    UserRole() {
      return UserRole
    },
  },
  methods: {
    toggleShowAddMember() {
      this.addMember.show = !this.addMember.show
      this.addMember.email = ''
    },
    addMemberForm() {},
    canRemoveMember(member: Member) {
      if (member.role === UserRole.owner) return false

      return this.isApplicationOwner || member.email === this.$auth.user?.email
    },
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
      "cancel": "Cancel",
      "owner": "Owner",
      "normal": "Normal",
      "remove": "Remove"
  },
  "es": {
      "members": "Miembros",
      "membersWarning": "No hay ninguna otra cuenta relacionada con esta aplicación",
      "addMember": "Añadir miembro",
      "email": "Correo electrónico",
      "enterEmail": "Introduce un correo electrónico",
      "cancel": "Cancelar",
      "owner": "Proprietario",
      "normal": "Normal",
      "remove": "Eliminar"
  }
}
</i18n>
