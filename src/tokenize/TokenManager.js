const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken(payload) {
    const fixedPayload = {
      ...payload,
      scope: Array.isArray(payload.scope) ? payload.scope : [payload.scope], // pastikan array
    };

    return Jwt.token.generate(fixedPayload, process.env.ACCESS_TOKEN_KEY);
  },
  generateRefreshToken(payload) {
    const fixedPayload = {
      ...payload,
      scope: Array.isArray(payload.scope) ? payload.scope : [payload.scope], // pastikan array
    };

    return Jwt.token.generate(fixedPayload, process.env.REFRESH_TOKEN_KEY);
  },
  verifyRefreshToken(refreshToken) {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
