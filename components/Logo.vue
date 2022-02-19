<template>
  <NuxtLink
    :to="localePath('/')"
    class="flex-shrink-0 flex-1 font-bold text-xl flex flex-row items-center"
    :aria-label="`${$config.projectTitle} Logo`"
  >
    <img src="/logo.png" class="h-6 max-w-full rounded-full" alt="Logo" />
    <h1 class="text-2xl ml-2">{{ $config.projectTitle }}</h1>
  </NuxtLink>
</template>
