/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const s3Client = require('./minioClient');

class MinioService {
  constructor() {
    this._bucketName = process.env.MINIO_BUCKET;
  }

  async storeImagePredict(file, classification) {
    const fileStream = fs.createReadStream(file.path);
    // const fileName = `predictions/${classification}/${nanoid(10)}-${file.filename}`;
    const fileName = `predictions/${classification}/${file.filename}`;

    await s3Client.send(new PutObjectCommand({
      Bucket: this._bucketName,
      Key: fileName,
      Body: fileStream,
      ContentType: file.headers['content-type'],
    }));

    // URL public hasil upload
    const fileUrl = `${process.env.MINIO_ENDPOINT}/${this._bucketName}/${fileName}`;
    return fileUrl;
  }

  async storeImageDataset(file, classification) {
    const fileStream = fs.createReadStream(file.path);

    const imageName = `${nanoid(3)}-${file.filename}`;
    const fileName = `dataset/${classification}/${imageName}`;
    // const fileName = `dataset/${classification}/${file.filename}`;

    await s3Client.send(new PutObjectCommand({
      Bucket: this._bucketName,
      Key: fileName,
      Body: fileStream,
      ContentType: file.headers['content-type'],
    }));

    // URL public hasil upload
    const fileUrl = `${process.env.MINIO_ENDPOINT}/${this._bucketName}/${fileName}`;
    return {
      name: imageName,
      fileUrl,
    };
  }

  // --- METHOD BARU UNTUK MENGHAPUS DATASET ---
  async deleteImageDataset(classification, filename) {
    // 1. Rekonstruksi path file (Key) yang akan dihapus
    const key = `dataset/${classification}/${filename}`;

    // 2. Buat perintah hapus (DeleteObjectCommand)
    const command = new DeleteObjectCommand({
      Bucket: this._bucketName,
      Key: key,
    });

    // 3. Kirim perintah ke Minio/S3
    await s3Client.send(command);
  }
  // --- AKHIR METHOD BARU ---
}

module.exports = MinioService;
