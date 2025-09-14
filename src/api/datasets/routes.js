const routes = (handler) => [
  {
    method: 'POST',
    path: '/datasets',
    handler: handler.postDatasetHandler,
    options: {
      payload: {
        output: 'file',
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024, // max 10 MB
      },
    },
  },
];

module.exports = routes;
