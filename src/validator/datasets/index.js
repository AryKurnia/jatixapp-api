const InvariantError = require('../../exceptions/InvariantError');
const { DatasetPayloadSchema } = require('./schema');

const DatasetsValidator = {
  validateDatasetPayload: (payload) => {
    const validationResult = DatasetPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = DatasetsValidator;
