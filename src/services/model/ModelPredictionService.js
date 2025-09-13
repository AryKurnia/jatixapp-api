/* eslint-disable no-underscore-dangle */

const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const InvariantError = require('../../exceptions/InvariantError');

class ModelPredictionService {
  constructor() {
    this._modelPredictionURL = process.env.PREDICT_API_URL;
  }

  async predictImage(file) {
    if (!file) {
      throw new InvariantError('Gambar tidak ditemukan');
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.path), file.filename);

    const responsePredictApi = await axios.post(this._modelPredictionURL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Ambil hasil prediksi dari API Flask
    const {
      predicted_class: classification, confidence, all_probabilities: probabilities,
    } = responsePredictApi.data;

    // Kembalikan object sesuai format
    return {
      classification,
      confidence,
      probabilities,
    };
  }
}

module.exports = ModelPredictionService;
