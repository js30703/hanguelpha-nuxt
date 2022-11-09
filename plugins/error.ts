export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = async (error, context) => {
    console.log('errorHandler', error, context);
  }
});
