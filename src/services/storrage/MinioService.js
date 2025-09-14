/* eslint-disable no-underscore-dangle */
// const { nanoid } = require('nanoid');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
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
    // const fileName = `dataset/${classification}/${nanoid(10)}-${file.filename}`;
    const fileName = `dataset/${classification}/${file.filename}`;

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
}

module.exports = MinioService;
