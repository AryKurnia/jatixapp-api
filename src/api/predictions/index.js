const PredictionsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'predictions',
  version: '1.0.0',
  register: async (server, {
    service, modelPredictionService, storageService, validator,
  }) => {
    const predictionsHandler = new PredictionsHandler({
      service, modelPredictionService, storageService, validator,
    });
    server.route(routes(predictionsHandler));
  },
};
