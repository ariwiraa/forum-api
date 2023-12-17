class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;

    const detailThread = await this._threadRepository.findThreadById(threadId);
    const comments = await this._commentRepository.findAllCommentsByThreadId(
      threadId
    );

    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      content: comment.is_deleted
        ? '**komentar telah dihapus**'
        : comment.content,
      username: comment.username,
      date: comment.date,
    }));

    detailThread.comments = formattedComments;

    return detailThread;
  }
}

module.exports = GetThreadUseCase;
