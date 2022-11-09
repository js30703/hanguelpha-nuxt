// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ["@/assets/scss/_base.scss"],
  vite: {
      css: {
          preprocessorOptions: {
              sass: {
                  additionalData: '@import "@/assets/styles/_variables.sass"',
              },
          },
      },
  },
})
