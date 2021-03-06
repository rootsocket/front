/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
const plugin = require('tailwindcss/plugin')
const defaultTheme = require('tailwindcss/defaultTheme')
const { getColors } = require('theme-colors')

// We need to respect breakpoints that match with docs & blog.
const containerScreens = Object.assign({}, defaultTheme.screens)
delete containerScreens['2xl']

module.exports = {
  darkMode: 'class',
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
        mono: ['DM Mono', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        primary: getColors('#007fff'),
        gray: {
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
      },
      maxHeight: {
        '(screen-16)': 'calc(100vh - 4rem)',
      },
      inset: {
        16: '4rem',
      },
      transitionProperty: {
        padding: 'padding',
      },
    },
    container: {
      screens: containerScreens,
    },
    typography: (theme) => ({
      default: {
        css: {
          a: {
            color: theme('colors.primary.500'),
          },
          h2: {
            paddingBottom: theme('padding.2'),
            borderBottomWidth: '1px',
            borderBottomColor: theme('colors.gray.200'),
          },
          h3: {
            paddingBottom: theme('padding.2'),
            borderBottomWidth: '1px',
            borderBottomColor: theme('colors.gray.200'),
          },
          blockquote: {
            fontWeight: '400',
            color: theme('colors.gray.600'),
            fontStyle: 'normal',
            quotes: '"\\201C""\\201D""\\2018""\\2019"',
          },
          'blockquote p:first-of-type::before': {
            content: '',
          },
          'blockquote p:last-of-type::after': {
            content: '',
          },
          code: {
            fontWeight: '400',
            backgroundColor: theme('colors.gray.100'),
            padding: theme('padding.1'),
            borderWidth: 1,
            borderColor: theme('colors.gray.200'),
            borderRadius: theme('borderRadius.default'),
          },
          'code::before': {
            content: '',
          },
          'code::after': {
            content: '',
          },
          'h3 code': {
            fontWeight: '600',
          },
          'pre code': {
            fontFamily: 'DM Mono',
          },
          'a code': {
            color: theme('colors.primary.500'),
          },
        },
      },
      dark: {
        css: {
          color: theme('colors.gray.300'),
          '[class~="lead"]': {
            color: theme('colors.gray.300'),
          },
          a: {
            color: theme('colors.primary.500'),
          },
          strong: {
            color: theme('colors.gray.100'),
          },
          'ol > li::before': {
            color: theme('colors.gray.400'),
          },
          'ul > li::before': {
            backgroundColor: theme('colors.gray.600'),
          },
          hr: {
            borderColor: theme('colors.gray.700'),
          },
          blockquote: {
            color: theme('colors.gray.400'),
            borderLeftColor: theme('colors.gray.700'),
          },
          h1: {
            color: theme('colors.gray.100'),
          },
          h2: {
            color: theme('colors.gray.100'),
            borderBottomColor: theme('colors.gray.800'),
          },
          h3: {
            color: theme('colors.gray.100'),
            borderBottomColor: theme('colors.gray.800'),
          },
          h4: {
            color: theme('colors.gray.100'),
          },
          'figure figcaption': {
            color: theme('colors.gray.400'),
          },
          code: {
            color: theme('colors.gray.100'),
            backgroundColor: theme('colors.gray.800'),
            borderWidth: 0,
          },
          'a code': {
            color: theme('colors.primary.500'),
          },
          thead: {
            color: theme('colors.gray.100'),
            borderBottomColor: theme('colors.gray.600'),
          },
          'tbody tr': {
            borderBottomColor: theme('colors.gray.700'),
          },
        },
      },
    }),
  },
  variants: {
    margin: ['responsive', 'last'],
    padding: ['responsive', 'hover'],
    backgroundColor: ['responsive', 'hover', 'focus', 'dark', 'dark-focus'],
    textColor: [
      'responsive',
      'hover',
      'focus',
      'dark',
      'dark-hover',
      'dark-focus',
    ],
    borderColor: ['responsive', 'hover', 'focus', 'dark', 'dark-focus'],
    borderWidth: ['responsive', 'first', 'last'],
    typography: ['responsive', 'dark'],
  },
  plugins: [
    plugin(function ({ addVariant, e }) {
      // WARNING: This part seems to override some weird stuff that Tailwind does by default and dark theme stops working
      // addVariant('dark', ({ modifySelectors, separator }) => {
      //   modifySelectors(({ selector }) => {
      //     return selectorParser((selectors) => {
      //       selectors.walkClasses((sel) => {
      //         sel.value = `dark${separator}${sel.value}`
      //         sel.parent.insertBefore(
      //           sel,
      //           selectorParser().astSync(prefix('.dark-mode '))
      //         )
      //       })
      //     }).processSync(selector)
      //   })
      // })

      addVariant('dark-hover', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.dark-mode .${e(`dark-hover${separator}${className}`)}:hover`
        })
      })

      addVariant('dark-focus', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.dark-mode .${e(`dark-focus${separator}${className}`)}:focus`
        })
      })
    }),
    require('@tailwindcss/typography'),
  ],
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    // purges dark theme in production, keeping all css for now until there is time to make it work.
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'content/**/*.md',
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js',
    ],
    options: {
      whitelist: ['dark-mode'],
    },
  },
}
