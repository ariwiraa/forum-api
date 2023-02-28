const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ServerTableTestHelper = {
  async getAccessToken() {
    const userPayload = {
      id: 'user-123',
      username: 'ariwiraa',
    };

    await UsersTableTestHelper.addUser(userPayload);

    return Jwt.token.generate(userPayload, process.env.ACCESS_TOKEN_KEY);
  },
};

module.exports = ServerTableTestHelper;
