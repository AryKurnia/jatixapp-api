/* eslint-disable no-underscore-dangle */

class DatasetsHandler {
  constructor(storageService, validator) {
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

    const response = h.response({
      status: 'success',
      message: 'Unggah dataset berhasil',
      data: {
        classification,
        fileUrl,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = DatasetsHandler;
