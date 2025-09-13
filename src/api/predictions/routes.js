const routes = (handler) => [
  {
    method: 'POST',
    path: '/predictions/umum',
    handler: handler.postPredictionUmumHandler,
    options: {
      payload: {
        output: 'file',
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024, // max 10 MB
      },
    },
  },
  {
    method: 'POST',
    path: '/predictions',
    handler: handler.postPredictionHandler,
    options: {
      auth: 'jatixapp_jwt',
      payload: {
        output: 'file',
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024, // max 10 MB
      },
    },
  },
  {
    method: 'GET',
    path: '/predictions',
    handler: handler.getPredictionsHandler,
    options: {
      auth: 'jatixapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/predictions/{id}',
    handler: handler.getPredictionByIdHandler,
    options: {
      auth: 'jatixapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/predictions/{id}',
    handler: handler.deletePredictionByIdHandler,
    options: {
      auth: 'jatixapp_jwt',
    },
  },
];

module.exports = routes;
