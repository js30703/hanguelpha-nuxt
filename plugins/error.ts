import Client from '@axiomhq/axiom-node';
// const client = new Client(); TODO 왜 안돼지??

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error:any, context) => {
      if (process.env.NODE_ENV == "development") {
      console.log(error)
      return
      }
      if (error.name == 'AxiosError' && error.response.data.statusCode == 500 ) {
        delete error.response.data.stack
        // client.datasets.ingestEvents('vercel', {error:error.response.data})
      }
    }
  });
