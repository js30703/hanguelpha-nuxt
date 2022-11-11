import Client from '@axiomhq/axiom-node';
const client = new Client();

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error:any, context) => {
      if (error.name == 'AxiosError' && error.response.data.statusCode == 500 ) {
        delete error.response.data.stack
        process.env.NODE_ENV == 'production'? client.datasets.ingestEvents('vercel', {error:error.response.data}): null
      }
    }
  });
