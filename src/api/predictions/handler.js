/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

class PredictionsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPredictionHandler = this.postPredictionHandler.bind(this);
    this.getPredictionsHandler = this.getPredictionsHandler.bind(this);
    this.getPredictionByIdHandler = this.getPredictionByIdHandler.bind(this);
    this.deletePredictionByIdHandler = this.deletePredictionByIdHandler.bind(this);
  }

  async postPredictionHandler(request, h) {
    this._validator.validatePredictionPayload(request.payload);

    const file = request.payload.image;

    if (!file) {
      return h.response({ error: 'Gambar tidak ditemukan' }).code(400);
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.path), file.filename);

    const responsePredictApi = await axios.post(process.env.PREDICT_API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Ambil hasil prediksi dari API Flask
    const { predicted_class: prediction, confidence } = responsePredictApi.data;

    const { id: credentialId } = request.auth.credentials;

    const predictionId = await this._service.addPrediction({
      confidence, prediction, owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Prediction berhasil',
      data: {
        predictionId,
        classification: responsePredictApi.data.predicted_class,
        confidence: responsePredictApi.data.confidence,
        all_probabilities: responsePredictApi.data.all_probabilities,
      },
    });
    response.code(201);
    return response;
  }

  async getPredictionsHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const predictions = await this._service.getPredictions(credentialId);
    return {
      status: 'success',
      data: {
        predictions,
      },
    };
  }

  async getPredictionByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPredictionOwner(id, credentialId);

    const prediction = await this._service.getPredictionById(id);

    return {
      status: 'success',
      data: {
        prediction,
      },
    };
  }

  async deletePredictionByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPredictionOwner(id, credentialId);

    await this._service.deletePredictionById(id);

    return {
      status: 'success',
      message: 'Prediction berhasil dihapus',
    };
  }
}

module.exports = PredictionsHandler;
