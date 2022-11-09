export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error, context) => {
      console.log("error\n",error)
      console.log("context\n",context)
    }
  })