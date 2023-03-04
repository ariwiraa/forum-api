const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('comment repository postgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('add comment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'ariwiraa',
        password: 'babababa',
        fullname: 'Ari Wira',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'ini title',
        body: 'ini body',
        owner: 'user-123',
        date: '2023',
      });

      // Arrange
      const addComment = new AddComment({
        owner: 'user-123',
        content: 'komentar',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        addComment
      );

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(
        addedComment.id
      );

      expect(comment).toBeDefined();
    });
  });

  describe('delete comment', () => {
    it('should delete comment from database', async () => {
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: commentId });

      await commentRepositoryPostgres.deleteComment(commentId);

      const comment = await CommentsTableTestHelper.findCommentById(
        'comment-123'
      );
      expect(comment.is_deleted).toEqual(true);
    });
  });

  describe('verify comment by owner', () => {
    it('should not throw error if user has authorization', async () => {
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const payload = {
        owner: 'user-123',
        commentId: 'comment-123',
      };

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({
        id: payload.commentId,
        owner: payload.owner,
      });

      await expect(
        commentRepositoryPostgres.verifyCommentByOwner(
          payload.commentId,
          payload.owner
        )
      ).resolves.not.toThrow(AuthorizationError);
    });

    it('should throw error if user has not authorization', async () => {
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const payload = {
        owner: 'user-123',
        commentId: 'comment-123',
      };

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({
        id: payload.commentId,
        owner: payload.owner,
      });

      await expect(
        commentRepositoryPostgres.verifyCommentByOwner(
          payload.commentId,
          'user-111'
        )
      ).rejects.toThrow(AuthorizationError);
    });
  });

  describe('is comment exist', () => {
    const fakeIdGenerator = () => '123';

    it('should throw NotFoundError when thread comment not found', async () => {
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await expect(
        commentRepository.isCommentExist(threadId, commentId)
      ).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when thread comment exists', async () => {
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      await expect(
        commentRepository.isCommentExist(threadId, commentId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });
});
