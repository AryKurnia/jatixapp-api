const DatasetsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'datasets',
  version: '1.0.0',
  register: async (server, { datasetsService, storageService, validator }) => {
    const datasetsHandler = new DatasetsHandler(datasetsService, storageService, validator);
    server.route(routes(datasetsHandler));
  },
};
