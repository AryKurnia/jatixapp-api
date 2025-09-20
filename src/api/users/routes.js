const { Joi, UserPayloadSchema } = require('../../validator/users/schema');
const { isAdmin } = require('../../policies/authorization');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/users/admin',
    handler: handler.postAdminUserHandler,
    options: {
      description: 'Membuat user admin',
      notes: 'Endpoint ini digunakan untuk membuat user dengan role admin',
      tags: ['api', 'users'],
      ...isAdmin,
      plugins: {
        'hapi-swagger': {
          security: [{ Bearer: [] }],
        },
      },
      validate: {
        payload: UserPayloadSchema,
      },
      response: {
        status: {
          201: Joi.object({
            status: Joi.string().example('success'),
            message: Joi.string().example('Admin berhasil ditambahkan'),
            data: Joi.object({
              userId: Joi.string().example('admin-123'),
            }),
          }),
        },
      },
    },
  },
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
    options: {
      description: 'Membuat user biasa',
      notes: 'Endpoint ini digunakan untuk membuat user dengan role biasa',
      tags: ['api', 'users'],
      validate: {
        payload: UserPayloadSchema,
      },
      response: {
        status: {
          201: Joi.object({
            status: Joi.string().example('success'),
            message: Joi.string().example('User berhasil ditambahkan'),
            data: Joi.object({
              userId: Joi.string().example('user-123'),
            }),
          }),
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUsersHandler,
    options: {
      description: 'Melihat daftar user',
      notes: 'Endpoint ini digunakan untuk melihat seluruh user yang terdaftar. Hanya bisa diakses oleh admin.',
      tags: ['api', 'users'],
      ...isAdmin,
      plugins: {
        'hapi-swagger': {
          security: [{ Bearer: [] }],
        },
      },
      response: {
        status: {
          200: Joi.object({
            status: Joi.string().example('success'),
            data: Joi.object({
              users: Joi.array().items(
                Joi.object({
                  id: Joi.string().example('user-123'),
                  username: Joi.string().example('johndoe'),
                  fullname: Joi.string().example('John Doe'),
                  scope: Joi.string().example('user'),
                }),
              ),
            }),
          }),
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler,
    options: {
      description: 'Melihat detail user',
      notes: 'Endpoint ini digunakan untuk melihat detail user berdasarkan id.',
      tags: ['api', 'users'],
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('ID user'),
        }),
      },
      response: {
        status: {
          200: Joi.object({
            status: Joi.string().example('success'),
            data: Joi.object({
              user: Joi.object({
                id: Joi.string().example('user-123'),
                username: Joi.string().example('johndoe'),
                fullname: Joi.string().example('John Doe'),
                scope: Joi.string().example('user'),
              }),
            }),
          }),
        },
      },
    },
  },
];

module.exports = routes;
