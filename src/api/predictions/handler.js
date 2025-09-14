/* eslint-disable no-underscore-dangle */

class PredictionsHandler {
  constructor({
    service, modelPredictionService, storageService, validator,
  }) {
    this._service = service;
    this._modelPredictionService = modelPredictionService;
    this._storageService = storageService;
    this._validator = validator;

    this.postPredictionUmumHandler = this.postPredictionUmumHandler.bind(this);
    this.postPredictionHandler = this.postPredictionHandler.bind(this);
    this.getPredictionsHandler = this.getPredictionsHandler.bind(this);
    this.getPredictionByIdHandler = this.getPredictionByIdHandler.bind(this);
    this.deletePredictionByIdHandler = this.deletePredictionByIdHandler.bind(this);
  }

  async postPredictionUmumHandler(request, h) {
    this._validator.validatePredictionPayload(request.payload);

    const file = request.payload.image;

    // Ambil hasil prediksi dari API Flask
    const {
      classification, confidence, probabilities,
    } = await this._modelPredictionService.predictImage(file);

    // Simpan gambar ke object storage
    const fileUrl = await this._storageService.storeImage(file, classification);

    const response = h.response({
      status: 'success',
      message: 'Prediction berhasil',
      data: {
        classification,
        confidence,
        probabilities,
        fileUrl,
      },
    });
    response.code(201);
    return response;
  }

  async postPredictionHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    this._validator.validatePredictionPayload(request.payload);

    const file = request.payload.image;

    // Ambil hasil prediksi dari API Flask
    const {
      classification, confidence, probabilities,
    } = await this._modelPredictionService.predictImage(file);

    // Simpan gambar ke object storage
    const fileUrl = await this._storageService.storeImage(file, classification);

    const predictionId = await this._service.addPrediction({
      confidence, prediction: classification, fileUrl, owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Prediction berhasil',
      data: {
        predictionId,
        classification,
        confidence,
        probabilities,
        fileUrl,
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
