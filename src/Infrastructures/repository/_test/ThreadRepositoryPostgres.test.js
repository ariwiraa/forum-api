const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('ThreadRepositoryPostgres', () => {
  describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
    });

    beforeAll(async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'ariwiraa',
        password: 'babababa',
        fullname: 'Ari Wira',
      });
    });

    afterAll(async () => {
      await UsersTableTestHelper.cleanTable();
      await pool.end();
    });

    const fakeIdGenerator = () => '123';
    const threadRepositoryPostgres = new ThreadRepositoryPostgres(
      pool,
      fakeIdGenerator
    );

    describe('addThreads function', () => {
      it('should persist add thread and return added thread correctly', async () => {
        const newThread = new NewThread({
          owner: 'user-123',
          title: 'ini adalah title',
          body: 'ini adalah body',
        });

        const addedThread = await threadRepositoryPostgres.addThread(newThread);

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
      it('should throw NotFoundError if no valid id', async () => {
        const threadId = 'thread-321';

        await expect(
          threadRepositoryPostgres.isThreadExist(threadId)
        ).rejects.toThrow(NotFoundError);
      });

      it('should not throw NotFoundError if valid id', async () => {
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });

        await expect(
          threadRepositoryPostgres.isThreadExist('thread-123')
        ).resolves.not.toThrow(NotFoundError);
      });
    });

    describe('get thread by id', () => {
      it('should return not found error when thread is not found', async () => {
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });

        await expect(
          threadRepositoryPostgres.findThreadById('thread-111')
        ).rejects.toThrowError(NotFoundError);
      });

      it('should not return not found error when thread is found', async () => {
        const date = new Date();
        await ThreadsTableTestHelper.addThread({ date });

        const thread = await threadRepositoryPostgres.findThreadById(
          'thread-123'
        );

        expect(thread.id).toBe('thread-123');
      });
    });
  });
});
