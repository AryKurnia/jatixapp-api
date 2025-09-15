const { isAdmin } = require('../../policies/authorization');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/datasets',
    handler: handler.postDatasetHandler,
    options: {
      ...isAdmin,
      auth: 'jatixapp_jwt',
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
