const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThreads function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // pre-arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'ariwiraa',
        password: 'babababa',
        fullname: 'Ari Wira',
      });
      // Arrange
      const newThread = new NewThread({
        owner: 'user-123',
        title: 'ini adalah title',
        body: 'ini adalah body',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById(
        addedThread.id
      );
      expect(threads).toBeDefined();
    });
  });

  describe('Find thread by id', () => {
    it('should throw error when thread is not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        owner: 'user-123',
        insertedAt: '2023',
      });

      await expect(
        threadRepositoryPostgres.findThreadById('thread-x')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw not error when thread is found', async () => {
      const newThread = {
        id: 'thread-123',
        title: 'title',
        body: 'body',
        owner: 'user-123',
        insertedAt: '2023',
      };

      const expectedThread = {
        id: 'thread-123',
        title: 'title',
        body: 'body',
        date: '2023',
        username: 'ariwira',
      };

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: newThread.owner,
        username: expectedThread.username,
      });
      await ThreadsTableTestHelper.addThread(newThread);

      // action
      const getThread = await threadRepositoryPostgres.findThreadById(
        'thread-123'
      );

      // assert
      expect(getThread).toStrictEqual(expectedThread);
    });
  });
});