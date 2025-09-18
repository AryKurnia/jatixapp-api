/* eslint-disable no-underscore-dangle */

class DatasetsHandler {
  constructor(datasetsService, storageService, validator) {
    this._datasetsService = datasetsService;
    this._storageService = storageService;
    this._validator = validator;

    this.postDatasetHandler = this.postDatasetHandler.bind(this);
    this.getDatasetsHandler = this.getDatasetsHandler.bind(this);
    this.getDatasetByIdHandler = this.getDatasetByIdHandler.bind(this);
    this.deleteDatasetByIdHandler = this.deleteDatasetByIdHandler.bind(this);
  }

  async postDatasetHandler(request, h) {
    this._validator.validateDatasetPayload(request.payload);
    const file = request.payload.image; // Ambil gambar dari request
    const { classification } = request.payload;

    // Simpan gambar ke object storage
    const { name, fileUrl } = await this._storageService.storeImageDataset(file, classification);

    // Simpan informasi dataset ke database
    const { id: credentialId } = request.auth.credentials;
    const id = await this._datasetsService.addDataset(name, classification, fileUrl, credentialId);

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

  async getDatasetsHandler() {
    const datasets = await this._datasetsService.getDatasets();
    return {
      status: 'success',
      data: {
        datasets,
      },
    };
  }

  async getDatasetByIdHandler(request) {
    const { id } = request.params;

    const dataset = await this._datasetsService.getDatasetById(id);
    return {
      status: 'success',
      data: {
        dataset,
      },
    };
  }

  async deleteDatasetByIdHandler(request) {
    const { id } = request.params;

    // Hapus gambar dari object storage
    const dataset = await this._datasetsService.getDatasetById(id);
    const { classification, name: filename } = dataset;
    await this._storageService.deleteImageDataset(classification, filename);

    // Hapus informasi dataset dari database
    await this._datasetsService.deleteDatasetById(id);

    return {
      status: 'success',
      message: 'Dataset berhasil dihapus',
    };
  }
}

module.exports = DatasetsHandler;
