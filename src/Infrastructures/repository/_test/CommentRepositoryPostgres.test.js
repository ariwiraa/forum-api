const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('comment repository postgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});

    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const fakeIdGenerator = () => '123'; // stub
  const commentRepositoryPostgres = new CommentRepositoryPostgres(
    pool,
    fakeIdGenerator
  );

  describe('add comment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        owner: 'user-123',
        content: 'komentar',
        threadId: 'thread-123',
      });

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        addComment
      );

      const comment = await CommentsTableTestHelper.findCommentById(
        addedComment.id
      );
      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          owner: addComment.owner,
          content: addComment.content,
        })
      );
      expect(comment).toBeDefined();
    });
  });

  describe('delete comment', () => {
    it('should delete comment from database', async () => {
      const commentId = 'comment-123';

      // await UsersTableTestHelper.addUser({});
      // await ThreadsTableTestHelper.addThread({});
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
      const payload = {
        owner: 'user-123',
        commentId: 'comment-123',
      };

      // await UsersTableTestHelper.addUser({});
      // await ThreadsTableTestHelper.addThread({});
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
      const payload = {
        owner: 'user-123',
        commentId: 'comment-123',
      };

      // await UsersTableTestHelper.addUser({});
      // await ThreadsTableTestHelper.addThread({});
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
    // const fakeIdGenerator = () => '123';

    it('should throw NotFoundError when thread comment not found', async () => {
      // const commentRepository = new CommentRepositoryPostgres(
      //   pool,
      //   fakeIdGenerator
      // );
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await expect(
        commentRepositoryPostgres.isCommentExist(threadId, commentId)
      ).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when thread comment exists', async () => {
      // const commentRepository = new CommentRepositoryPostgres(
      //   pool,
      //   fakeIdGenerator
      // );
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      // await UsersTableTestHelper.addUser({});
      // await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      await expect(
        commentRepositoryPostgres.isCommentExist(threadId, commentId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('find all comments by thread id', () => {
    it('should return all comments', async () => {
      const firstComment = {
        id: 'comment-123',
        content: 'komentar 1',
        isDeleted: false,
      };
      const secondComment = {
        id: 'comment-124',
        content: 'komentar 2',
        isDeleted: false,
      };

      await CommentsTableTestHelper.addComment({
        ...firstComment,
        owner: 'user-123',
        threadId: 'thread-123',
      });
      await CommentsTableTestHelper.addComment({
        ...secondComment,
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const comments =
        await commentRepositoryPostgres.findAllCommentsByThreadId('thread-123');

      expect(comments).toEqual([
        new DetailComment({ ...firstComment, username: 'dicoding' }),
        new DetailComment({ ...secondComment, username: 'dicoding' }),
      ]);
    });
  });
});
