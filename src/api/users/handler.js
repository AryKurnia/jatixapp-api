/* eslint-disable no-underscore-dangle */

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUsersHandler = this.getUsersHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.putUserByIdHandler = this.putUserByIdHandler.bind(this);
    this.deleteUserByIdHandler = this.deleteUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;

    const userId = await this._service.addUser({ username, password, fullname });

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUsersHandler() {
    const users = await this._service.getUsers();
    return {
      status: 'success',
      data: {
        users,
      },
    };
  }

  async getUserByIdHandler(request) {
    const { id } = request.params;

    const user = await this._service.getUserById(id);

    return {
      status: 'success',
      data: {
        user,
      },
    };
  }

  async putUserByIdHandler(request) {
    this._validator.validateUserPayload(request.payload);
    const { id } = request.params;

    await this._service.editUserById(id, request.payload);

    return {
      status: 'success',
      message: 'User berhasil diperbarui',
    };
  }

  async deleteUserByIdHandler(request) {
    const { id } = request.params;

    await this._service.deleteUserById(id);

    return {
      status: 'success',
      message: 'User berhasil dihapus',
    };
  }
}

module.exports = UsersHandler;
