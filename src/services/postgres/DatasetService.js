/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapDBToModel } = require('../../utils');

class DatasetsService {
  constructor() {
    this._pool = new Pool();
  }

  async addDataset(classification, fileUrl, credentialId) {
    // Method ini untuk menambahkan catatan
    const id = nanoid(16);
    // const renamedFilename = `${id}-${filename}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO datasets VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, classification, fileUrl, createdAt, credentialId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Dataset gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPredictions(owner) {
    const query = {
      text: 'SELECT * FROM predictions WHERE owner = $1',
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapDBToModel);
  }

  async getPredictionById(id) {
    const query = {
      text: 'SELECT * FROM predictions WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Prediksi tidak ditemukan');
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async deletePredictionById(id) {
    const query = {
      text: 'DELETE FROM predictions WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Prediksi gagal dihapus. Id tidak ditemukan');
    }
  }

  // Method ini untuk memverifikasi pemilik Prediksi
  async verifyPredictionOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM predictions WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Prediksi tidak ditemukan');
    }

    const note = result.rows[0];

    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = DatasetsService;
