const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().required().description('Username unik'),
  password: Joi.string().required().description('Password user'),
  fullname: Joi.string().required().description('Nama lengkap user'),
}).example({
  username: 'johndoe',
  password: 'passwordRahasia123',
  fullname: 'John Doe',
});

module.exports = { Joi, UserPayloadSchema };
