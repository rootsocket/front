<template>
  <div class="pt-16">
    <AppHeader />

    <main class="container mx-auto px-4 lg:px-8">
      <div class="flex flex-wrap relative">
        <AppNav />

        <Nuxt class="w-full lg:w-4/5" />
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script lang="js">
import Vue from 'vue'

export default Vue.extend({
  mounted() {
    const widgetScriptEl = document.createElement('script')

    widgetScriptEl.id = 'PapercupsWidgetScript'
    widgetScriptEl.type = 'text/javascript'
    widgetScriptEl.async = true
    widgetScriptEl.defer = true
    widgetScriptEl.src =
      (document.location.protocol === 'https:' ? 'https://' : 'http://') +
      'app.papercups.io/widget.js'

    const s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(widgetScriptEl, s)

    window.Papercups = {
      config: {
        token: '6b521793-2825-41f8-8d2b-2865dba5d8c0',
        inbox: '638acb58-c2ac-4f60-a34e-6945988836c0',
        title: 'Chat',
        subtitle: 'Any questions or feedback? ❤️',
        primaryColor: '#0073e6',
        newMessagePlaceholder: 'Start typing...',
        showAgentAvailability: false,
        requireEmailUpfront: false,
        iconVariant: 'outlined',
        baseUrl: 'https://app.papercups.io',
        // Optionally include data about your customer here to identify them
        // customer: {
        //   name: __CUSTOMER__.name,
        //   email: __CUSTOMER__.email,
        //   external_id: __CUSTOMER__.id,
        //   metadata: {
        //     plan: "premium"
        //   }
        // }
      },
    }
  },
})
</script>
