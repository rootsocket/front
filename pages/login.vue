<template>
  <!-- component -->
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
    <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
      <root-socket-logo class="mb-5" />
      <div class="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
        <div class="px-5 py-7">
          <label class="font-semibold text-sm text-gray-600 pb-1 block"
            >E-mail</label
          >
          <input
            type="text"
            class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            placeholder="Enter your email address"
          />
          <label class="font-semibold text-sm text-gray-600 pb-1 block"
            >Password</label
          >
          <input
            type="text"
            class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            placeholder="Enter your password"
          />
          <button
            type="button"
            class="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
          >
            <span class="inline-block mr-2">Login</span>
          </button>
        </div>
        <div class="p-5">
          <button
            type="button"
            class="transition duration-200 border border-gray-200 text-gray-500 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-normal text-center inline-block"
            @click="$router.push(localePath('/register'))"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LoginPage',
})
</script>
