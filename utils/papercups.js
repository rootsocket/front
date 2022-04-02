export const paperCupsLifeHook = {
  unmounted() {
    // We only want to unmount Papercups on certain pages.
    window.Papercups = null
  },
  mounted() {
    // If Papercups is already mounted don't do it again because that will trigger a re-render.
    if (window.Papercups) {
      return
    }

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
        primaryColor: '#007fff',
        newMessagePlaceholder: 'Start typing...',
        showAgentAvailability: false,
        requireEmailUpfront: false,
        iconVariant: 'outlined',
        baseUrl: 'https://app.papercups.io',
        // Optionally include data about your customer here to identify them
        customer: {
          // name: __CUSTOMER__.name,
          email: this.$auth.user?.email ?? '',
          // external_id: __CUSTOMER__.id,
          // metadata: {
          //   plan: "premium"
          // }
        },
      },
    }
  },
}
