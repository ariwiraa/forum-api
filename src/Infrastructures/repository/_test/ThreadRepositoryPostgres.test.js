const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

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
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: newThread.title,
          owner: newThread.owner,
        })
      );
    });
  });

  describe('is thread exist', () => {
    const fakeIdGenerator = () => '123';

    it('should throw NotFoundError if no valid id', async () => {
      const threadId = 'thread-321';

      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await expect(threadRepository.isThreadExist(threadId)).rejects.toThrow(
        NotFoundError
      );
    });

    it('should not throw NotFoundError if valid id', async () => {
      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      await expect(
        threadRepository.isThreadExist('thread-123')
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('get thread by id', () => {
    const fakeIdGenerator = () => '123';
    it('should return not found error when thread is not found', async () => {
      // arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      // action & assert
      await expect(
        threadRepositoryPostgres.findThreadById('thread-111')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not return not found error when thread is found', async () => {
      const addThread = {
        id: 'thread-123',
        title: 'title',
        body: 'body',
        date: '2023',
        owner: 'user-123',
      };

      const expectedThread = {
        id: 'thread-123',
        title: 'title',
        body: 'body',
        date: '2023',
        username: 'ariwiraa',
      };

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'ariwiraa',
      });
      await ThreadsTableTestHelper.addThread(addThread);

      // action
      const thread = await threadRepositoryPostgres.findThreadById(
        'thread-123'
      );

      // assert
      expect(thread).toStrictEqual(expectedThread);
    });
  });
});
