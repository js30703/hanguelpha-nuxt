import Client from '@axiomhq/axiom-node';
const client = new Client();
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error:any, context) => {
      // console.log('hi', error,context)
      // TODO axios error 를 잡아서 보고하자.
      if (error.name == 'AxiosError' && error.response.data.statusCode == 500 ) {
        delete error.response.data.stack
        process.env.NODE_ENV == 'production'? client.datasets.ingestEvents('vercel', {error:error.response.data}): null
      }
    }
  });
