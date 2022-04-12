<template>
  <div
    class="flex flex-wrap-reverse"
    @keydown.esc="
      () => {
        addMember.show && toggleShowAddMember()
        removeMember.show && toggleShowRemoveMember()
      }
    "
  >
    <AppPage>
      <div class="flex flex-col md:flex-row justify-between md:items-center">
        <h1>{{ $t('members') }}</h1>
        <ButtonPressable
          v-if="application.members.length !== 0 && isApplicationOwner"
          class="mb-7"
          variant="outline"
          :value="$t('inviteMember')"
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
            :value="$t('inviteMember')"
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
                :value="$t(member.role === UserRole.owner ? 'owner' : 'normal')"
                :variant="member.role === UserRole.owner ? 'green' : 'default'"
                class="md:ml-2"
              />
              <AppBadge
                v-if="!member.accepted"
                :value="$t('pending')"
                variant="warning"
                class="md:ml"
              />
            </div>
            <ButtonPressable
              v-if="canRemoveMember(member)"
              variant="outline-red"
              :value="$t('remove')"
              @click="toggleShowRemoveMember(member.identifier, member.email)"
            />
          </div>
        </div>
      </div>
    </AppPage>

    <AppModal
      :show="addMember.show"
      :title="$t('inviteMember')"
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
            :value="$t('inviteMember')"
            variant="primary"
            type="submit"
            :loading="addMember.loading"
          />
        </div>
      </form>
    </AppModal>

    <AppModal
      :show="removeMember.show"
      :title="$t('removeMember')"
      @close="toggleShowRemoveMember"
    >
      <form @submit.prevent="removeMemberForm">
        <TextLabel :value="$t('email')" />
        <TextInput
          v-model="removeMember.email"
          :placeholder="$t('enterEmail')"
          type="email"
          margin
          required
          disabled
        />

        <div class="w-full flex justify-end mt-4">
          <ButtonPressable
            :value="$t('cancel')"
            variant="outline"
            class="mr-2"
            type="button"
            @click="toggleShowRemoveMember"
          />
          <ButtonPressable
            :value="$t('removeMember')"
            variant="red"
            type="submit"
            :loading="removeMember.loading"
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
import { getErrorMessage } from '~/utils/error'

export default Vue.extend({
  layout: 'application',
  data() {
    return {
      addMember: {
        email: '',
        show: false,
        loading: false,
      },
      removeMember: {
        identifier: '',
        email: '',
        show: false,
        loading: false,
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
      ).members?.some(
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
    toggleShowRemoveMember(identifier = '', email = '') {
      this.removeMember.identifier = identifier
      this.removeMember.email = email
      this.removeMember.show = !this.removeMember.show
    },
    async addMemberForm() {
      try {
        this.addMember.loading = true
        await this.$store.dispatch('application/inviteMember', {
          identifier: this.application.identifier,
          email: this.addMember.email,
        })
        this.$toast.show(this.$t('invited'))
        this.toggleShowAddMember()
      } catch (e) {
        this.$toast.show(getErrorMessage(e))
      } finally {
        this.addMember.loading = false
      }
    },
    async removeMemberForm() {
      try {
        this.removeMember.loading = true
        await this.$store.dispatch('application/deleteMember', {
          identifier: this.application.identifier,
          userIdentifier: this.removeMember.identifier,
        })
        if (this.removeMember.email === this.$auth.user?.email) {
          this.$router.push(this.localeLocation({ name: 'applications' }))
        }
        this.toggleShowRemoveMember()
      } catch (e) {
        this.$toast.show(getErrorMessage(e))
      } finally {
        this.removeMember.loading = false
      }
    },
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
      "inviteMember": "Invite member",
      "email": "Email",
      "enterEmail": "Enter email",
      "cancel": "Cancel",
      "owner": "Owner",
      "normal": "Normal",
      "remove": "Remove",
      "removeMember": "Remove member",
      "invited": "Invitation sent",
      "pending": "Pending"
  },
  "es": {
      "members": "Miembros",
      "membersWarning": "No hay ninguna otra cuenta relacionada con esta aplicación",
      "inviteMember": "Invitar miembro",
      "email": "Correo electrónico",
      "enterEmail": "Introduce un correo electrónico",
      "cancel": "Cancelar",
      "owner": "Proprietario",
      "normal": "Normal",
      "remove": "Eliminar",
      "removeMember": "Eliminar miembro",
      "invited": "Invitación enviada",
      "pending": "Pendiente"
  }
}
</i18n>
