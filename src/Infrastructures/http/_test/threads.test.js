const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTableTestHelper = require('../../../../tests/ServerTableTestHelper');

describe('/threads endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /thread', () => {
    // it('should response with 401 when no access token provided', async () => {
    //   const requestPayload = {
    //     title: 'ini adalah title',
    //     body: 'ini adalah body',
    //   };

    //   const server = await createServer(container);

    //   // Action
    //   const response = await server.inject({
    //     method: 'POST',
    //     url: '/threads',
    //     payload: requestPayload,
    //     headers: {
    //       Authorization: 'Bearer invalid-token',
    //     },
    //   });

    //   // Assert
    //   const responseJson = JSON.parse(response.payload);
    //   expect(responseJson.statusCode).toEqual(401);
    //   expect(responseJson.error).toEqual('Unauthorized');
    //   expect(responseJson.message).toEqual('Missing Unauthorized');
    // });

    it('should response with 201 and persisted thread', async () => {
      const payload = {
        title: 'ini adalah ',
        body: 'ini adalah body',
      };

      const server = await createServer(container);
      const accessToken = await ServerTableTestHelper.getAccessToken();
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });
});
