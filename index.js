'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'], // izinkan semua origin (untuk testing front-end)
      },
    },
  });

  await server.register(Inert);

  // Route untuk upload gambar dan forward ke API predict
  server.route({
    method: 'POST',
    path: '/api/classify',
    options: {
      payload: {
        output: 'file',
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024, // max 10 MB
      },
    },
    handler: async (request, h) => {
      const file = request.payload.image;

      if (!file) {
        return h.response({ error: 'Gambar tidak ditemukan' }).code(400);
      }

      try {
        // Kirim file ke API predict menggunakan axios dan FormData
        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.path), file.filename);

        const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
          headers: {
            ...formData.getHeaders(),
          },
        });

        // Ambil hasil prediksi dari API Flask
        const { predicted_class, confidence, all_probabilities } = response.data;

        return {
          class: predicted_class,
          confidence: confidence,
          all_probabilities: all_probabilities,
        };
      } catch (error) {
        console.error('Error memanggil API predict:', error.message);
        return h.response({ error: 'Gagal memproses gambar' }).code(500);
      }
    },
  });

  await server.start();
  console.log(`🚀 Server berjalan di: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
