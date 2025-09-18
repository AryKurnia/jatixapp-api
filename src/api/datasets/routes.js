const { isAdmin } = require('../../policies/authorization');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/datasets',
    handler: handler.postDatasetHandler,
    options: {
      ...isAdmin, // hanya admin yang boleh mengakses
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
    path: '/datasets',
    handler: handler.getDatasetsHandler,
    options: {
      ...isAdmin, // hanya admin yang boleh mengakses
    },
  },
  {
    method: 'GET',
    path: '/datasets/{id}',
    handler: handler.getDatasetByIdHandler,
    options: {
      ...isAdmin, // hanya admin yang boleh mengakses
    },
  },
  {
    method: 'DELETE',
    path: '/datasets/{id}',
    handler: handler.deleteDatasetByIdHandler,
    options: {
      ...isAdmin, // hanya admin yang boleh mengakses
    },
  },
];

module.exports = routes;
