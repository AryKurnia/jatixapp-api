const Joi = require('joi');

const PredictionPayloadSchema = Joi.object({
  image: Joi.object({
    path: Joi.string().required(),
    filename: Joi.string().required(),
    bytes: Joi.number().required(),
    headers: Joi.object().required(),
  }).required(),
});

module.exports = { PredictionPayloadSchema };
