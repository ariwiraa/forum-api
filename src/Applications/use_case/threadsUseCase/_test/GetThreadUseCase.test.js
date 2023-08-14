const GetThreadUseCase = require('../GetThreadUseCase');
const DetailThread = require('../../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../../Domains/comments/entities/DetailComment');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentsRepository = require('../../../../Domains/comments/CommentsRepository');

describe('detail thread', () => {
  it('should orchestrating the detail thread action correctly', async () => {
    const useCaseParam = {
      threadId: 'thread-123',
    };

    const expectedThreadDetails = {
      id: 'thread-123',
      title: 'title ini',
      body: 'body',
      date: '2023-03-17T18:41:00',
      username: 'ariwiraa',
    };

    const comments = [
      new DetailComment({
        id: 'comment-123',
        content: 'komentar 1',
        date: '2023-03-17T18:41:00',
        username: 'dicoding',
        isDeleted: false,
      }),
      new DetailComment({
        id: 'comment-124',
        content: 'komentar 2',
        date: '2023-04-16T17:00:00.000Z',
        username: 'atmaja',
        isDeleted: true,
      }),
    ];

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentsRepository();

    // mocking needed function
    mockThreadRepository.findThreadById = jest.fn(() =>
      Promise.resolve(expectedThreadDetails)
    );
    mockCommentRepository.findAllCommentsByThreadId = jest.fn(() =>
      Promise.resolve(comments)
    );

    // creating use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const detailThread = await getThreadUseCase.execute(useCaseParam);

    // assert
    expect(detailThread).toEqual({
      ...expectedThreadDetails,
      comments,
    });
    expect(mockThreadRepository.findThreadById).toBeCalledWith(
      useCaseParam.threadId
    );
    expect(mockCommentRepository.findAllCommentsByThreadId).toBeCalledWith(
      useCaseParam.threadId
    );
  });
});
