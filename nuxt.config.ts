// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [ //instead of buildModules
  '@pinia/nuxt'
  ],
  css: ["@/assets/scss/global.scss"],
  vite: {
      css: {
          preprocessorOptions: {
              sass: {
                  additionalData: '@import "@/assets/styles/_base.sass"',
              },
          },
      },
  },
  components: [
    {
      path: '~/components', 
      pathPrefix: true,
    },
  ], 
})
