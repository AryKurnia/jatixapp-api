/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class DatasetsService {
  constructor() {
    this._pool = new Pool();
  }

  async addDataset(name, classification, fileUrl, credentialId) {
    // Method ini untuk menambahkan catatan
    const id = nanoid(16);
    // const renamedFilename = `${id}-${filename}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO datasets VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, name, classification, fileUrl, createdAt, credentialId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Dataset gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getDatasets() {
    const query = {
      text: 'SELECT * FROM datasets',
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getDatasetById(id) {
    const query = {
      text: 'SELECT * FROM datasets WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Dataset tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteDatasetById(id) {
    const query = {
      text: 'DELETE FROM datasets WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Dataset gagal dihapus. Id tidak ditemukan');
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
