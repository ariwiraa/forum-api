const DeleteCommentUsecase = require('../commentsUseCase/DeleteCommentUseCase');
const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');

describe('delete comment', () => {
  it('should orchestrating de;ete commnet action correctly', async () => {
    // arragne
    const useCasePayload = {
      owner: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    // creating dependency of use case
    const mockCommentsRepository = new CommentsRepository();

    // mocking needed function
    mockCommentsRepository.verifyCommentByOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentsRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // creating use case instance
    const deleteCommentUseCase = new DeleteCommentUsecase({
      commentsRepository: mockCommentsRepository,
    });

    // action
    await deleteCommentUseCase.execute(useCasePayload);

    // assert
    expect(mockCommentsRepository.isCommentExist).toBeCalledWith(
      useCasePayload.threadId,
      useCasePayload.commentId
    );
    expect(mockCommentsRepository.verifyCommentByOwner).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(mockCommentsRepository.deleteComment).toBeCalledWith(
      useCasePayload.commentId
    );
  });
});
