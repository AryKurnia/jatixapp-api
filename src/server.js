require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

// datasets
const datasets = require('./api/datasets');
const DatasetsService = require('./services/postgres/DatasetService');
const DatasetsValidator = require('./validator/datasets');

// predictions
const predictions = require('./api/predictions');
const PredictionsService = require('./services/postgres/PredictionsService');
const ModelPredictionService = require('./services/model/ModelPredictionService');
const MinioService = require('./services/storrage/MinioService');
const PredictionsValidator = require('./validator/predictions');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const predictionsService = new PredictionsService();
  const modelPredictionService = new ModelPredictionService();
  const storageService = new MinioService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const datasetsService = new DatasetsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Opsi untuk hapi-swagger
  const swaggerOptions = {
    info: {
      title: 'JatixApp API Sistem Deteksi Daun Jati',
      version: '1.0.0',
      description: 'Dokumentasi API untuk Sistem Deteksi Daun Jati menggunakan Hapi.js',
    },
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: "Masukkan token JWT dengan format 'Bearer {token}'",
      },
    },
  };

  // registrasi plugin eksternal
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('jatixapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        scope: artifacts.decoded.payload.scope,
      },
    }),
  });

  await server.register([
    {
      plugin: datasets,
      options: {
        datasetsService,
        storageService,
        validator: DatasetsValidator,
      },
    },
    {
      plugin: predictions,
      options: {
        service: predictionsService,
        modelPredictionService,
        storageService,
        validator: PredictionsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // Penanganan client error secara internal
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    // Tampilkan error detail saat development
    if (response.isBoom && process.env.NODE_ENV !== 'production') {
      console.error(response); // log detail ke console
    }

    return h.continue; // jika bukan ClientError, lanjutkan ke handler berikutnya
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
