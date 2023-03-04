const DeleteComment = require('../DeleteComment');

describe('delete comment', () => {
  it('should throw error when payload not contain property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
    };

    // Action and assert
    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_CONTAIN_DATA'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: true,
    };

    // Action and assert
    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_CMEET_DATA_SPECIFICATION'
    );
  });

  it('should create delete comment object correctly', () => {
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // Action
    const { owner, threadId, commentId } = new DeleteComment(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
  });
});
