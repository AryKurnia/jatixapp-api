const PredictionsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'predictions',
  version: '1.0.0',
  register: async (server, { service, modelPredictionService, validator }) => {
    const predictionsHandler = new PredictionsHandler(service, modelPredictionService, validator);
    server.route(routes(predictionsHandler));
  },
};
