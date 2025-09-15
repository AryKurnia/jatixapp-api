/* eslint-disable no-underscore-dangle */

class DatasetsHandler {
  constructor(datasetsService, storageService, validator) {
    this._datasetsService = datasetsService;
    this._storageService = storageService;
    this._validator = validator;

    this.postDatasetHandler = this.postDatasetHandler.bind(this);
  }

  async postDatasetHandler(request, h) {
    this._validator.validateDatasetPayload(request.payload);
    const file = request.payload.image; // Ambil gambar dari request
    const { classification } = request.payload;

    // Simpan gambar ke object storage
    const fileUrl = await this._storageService.storeImageDataset(file, classification);

    // Simpan informasi dataset ke database
    const { id: credentialId } = request.auth.credentials;
    const id = await this._datasetsService.addDataset(classification, fileUrl, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Unggah dataset berhasil',
      data: {
        id,
        classification,
        fileUrl,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = DatasetsHandler;
