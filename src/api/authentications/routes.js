const Joi = require('joi');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postAuthenticationHandler,
    options: {
      description: 'Membuat autentikasi',
      notes: 'Endpoint ini digunakan untuk membuat autentikasi',
      tags: ['api', 'authentications'],
      validate: {
        payload: Joi.object({
          username: Joi.string().required().example('jhondoe'),
          password: Joi.string().required().example('secretPassword123'),
        }),
      },
      response: {
        status: {
          201: Joi.object({
            status: Joi.string().example('success'),
            message: Joi.string().example('Authentication berhasil ditambahkan'),
            data: Joi.object({
              accessToken: Joi.string().example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'),
              refreshToken: Joi.string().example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'),
            }),
          }),
        },
      },
    },
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putAuthenticationHandler,
    options: {
      description: 'Memperbarui access token',
      notes: 'Endpoint ini digunakan untuk memperbarui access token menggunakan refresh token',
      tags: ['api', 'authentications'],
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string().required().example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'),
        }),
      },
      response: {
        status: {
          200: Joi.object({
            status: Joi.string().example('success'),
            message: Joi.string().example('Access Token berhasil diperbarui'),
            data: Joi.object({
              accessToken: Joi.string().example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'),
            }),
          }),
        },
      },
    },
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuthenticationHandler,
    options: {
      description: 'Menghapus refresh token',
      notes: 'Endpoint ini digunakan untuk menghapus refresh token',
      tags: ['api', 'authentications'],
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string().required().example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'),
        }),
      },
      response: {
        status: {
          200: Joi.object({
            status: Joi.string().example('success'),
            message: Joi.string().example('Refresh Token berhasil dihapus'),
          }),
        },
      },
    },
  },
];

module.exports = routes;
