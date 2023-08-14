const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentsRepository');
const AddCommentUseCase = require('../commentsUseCase/AddCommentUseCase');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('Add comment', () => {
  it('should orchestrating add comment action correctly', async () => {
    // arrange

    const useCasePayload = {
      owner: 'user-123',
      content: 'komentar',
      threadId: 'thread-123',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    // creating dependecy of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockCommentRepository.addComment = jest.fn(() =>
      Promise.resolve(expectedAddedComment)
    );
    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve());

    // createing use case instance
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // assert
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: expectedAddedComment.id,
        content: expectedAddedComment.content,
        owner: expectedAddedComment.owner,
      })
    );
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        owner: useCasePayload.owner,
        content: useCasePayload.content,
        threadId: useCasePayload.threadId,
      })
    );
  });
});
