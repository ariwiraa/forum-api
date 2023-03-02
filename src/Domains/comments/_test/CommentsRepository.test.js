const CommentsRepository = require('../CommentsRepository');

describe('Comment repository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const commentsRepository = new CommentsRepository();

    await expect(commentsRepository.addComment({})).rejects.toThrowError(
      'COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );

    await expect(
      commentsRepository.findAllCommentsByThreadId('')
    ).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(
      commentsRepository.verifyCommentByOwner('')
    ).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(commentsRepository.deleteComment('')).rejects.toThrowError(
      'COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
