const Joi = require('joi');

const DatasetPayloadSchema = Joi.object({
  image: Joi.object({
    path: Joi.string().required(),
    filename: Joi.string().required(),
    bytes: Joi.number().required(),
    headers: Joi.object().required(),
  }).required(),
  classification: Joi.string()
    .valid('Biotrop', 'Gamelina', 'Salomon')
    .required(),
});

module.exports = { DatasetPayloadSchema };
