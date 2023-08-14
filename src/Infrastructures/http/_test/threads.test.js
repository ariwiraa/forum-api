const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTableTestHelper = require('../../../../tests/ServerTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/threads endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /thread', () => {
    it('should response with 401 when no access token provided', async () => {
      const requestPayload = {
        title: 'ini adalah title',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: 'Bearer invalid-token',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        title: 'ini adalah title',
      };

      const server = await createServer(container);
      const accessToken = await ServerTableTestHelper.getAccessToken();

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('title dan body harus diisi');
    });
    it('should response 400 when request payload not meeet type data specification', async () => {
      const requestPayload = {
        title: 'ini adalah title',
        body: true,
      };

      const server = await createServer(container);
      const accessToken = await ServerTableTestHelper.getAccessToken();

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'title dan body harus bernilai string'
      );
    });

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

  describe('GET /thread/{threadId}', () => {
    it('should response with 200 and persisted thread with comments', async () => {
      const server = await createServer(container);
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'ariwiraa',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-111',
        username: 'dicoding',
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId,
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-111',
        threadId,
        owner: 'user-111',
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);
    });
    it('should response with 200 and persisted thread with comments', async () => {
      const server = await createServer(container);
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'ariwiraa',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-111',
        username: 'dicoding',
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(0);
    });
    it('should response with 200 and persisted thread with comments', async () => {
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
