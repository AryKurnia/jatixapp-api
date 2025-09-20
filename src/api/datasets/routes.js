const Joi = require('joi');
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
      description: 'Mengunggah dataset',
      notes: 'Endpoint ini digunakan untuk mengunggah dataset gambar beserta labelnya',
      tags: ['api', 'datasets'],
      plugins: {
        'hapi-swagger': {
          security: [{ Bearer: [] }],
        },
      },
      validate: {
        payload: Joi.object({
          image: Joi.any()
            .meta({ swaggerType: 'file' })
            .required()
            .description('File gambar'),
          classification: Joi.string()
            .required()
            .description('Label klasifikasi'),
        }),
      },
      response: {
        status: {
          201: Joi.object({
            status: Joi.string().example('success'),
            message: Joi.string().example('Unggah dataset berhasil'),
            data: Joi.object({
              id: Joi.string().example('npqKx_GlImxr4n'),
              classification: Joi.string().example('Biotrop'),
              fileUrl: Joi.string().example('https://example.com/image.jpg'),
            }),
          }),
        },
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
