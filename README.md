# JatixApp
Merupakah RESTFul API yang dibangun menggunakan framework Hapi.js. API ini digunakan sebagai backend untuk sistem deteksi atau klasifikasi daun jati.
Project ini dibuat memenuhi tugas skripsi pendeteksi bibit jati.
___
## Services
Project ini memanfaatkan beberapa layanan sebagai berikut:
- Predict Jatix API (Backend for load model)
  - Project ini tdk bisa berjalan tanpa Predict Jatix API, karna Predict Jatix API dibangun menggunakan farmework Flask yang khusus meload model dan menangani prediction image (mendeteksi jenis jati apa berdasarkan daunnya).
  - Image IPI ini telah di push di docker hub, dan bisa diakses melalui URL: https://hub.docker.com/r/
  - JatixApp API tidak bisa berjalan dengan baik tampak Predict Jatix API.
- PostgreSQL (Database)
  - JatixApp API menggunakan PostgreSQL sebagai database.
  - Sebaiknya anda juga menggunakan Docker untuk menjalankan PostgreSQL agar lebih mudah.
- MinIO (Object Storrage)
  - JatixApp API menggunakan MinIO sebagai object storage.
  - Sebaiknya anda juga menggunakan Docker untuk menjalankan MinIO agar lebih mudah.
  - Kami menggunakan versi MinIO berikut: https://hub.docker.com/layers/minio/minio/RELEASE.2025-04-22T22-12-26Z-cpuv1. Kami menggunakan versi ini karna fiturnya lebih lengkap dibandingkan versi lainnya.
  - JatixApp API membutuhkan bucket dengan nama "**jatixapp**", tolong buat bucket ini terlebih dahulu sebelum menggunakan JatixApp API.

## Cara menjalankan JatixApp API
1. Untuk menjalankan JatixApp API, anda perlu menjalankan beberapa layanan sebagai berikut:
   - Predict Jatix API
   - PostgreSQL
   - MinIO

2. Ada beberapa environment variable yang perlu diatur pada `.env`.
3. Sebelum menjalankan program, anda perlu install dependency menggunakan perintah `npm install`.
4. Selanjutna, jalankan `npm run migrate` untuk membuat table pada database.
5. Untuk menjalankan program, anda perlu menjalankan perintah `npm start` atau `npm start-dev`(development).

## Documentation
Setelah berhasil menjalankan program, anda dapat mengakses dokumentasi API melalui route `/documentation`.
