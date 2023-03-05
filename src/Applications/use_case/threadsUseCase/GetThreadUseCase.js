class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;

    const detailThread = await this._threadRepository.findThreadById(threadId);
    detailThread.comments =
      await this._commentRepository.findAllCommentsByThreadId(threadId);

    return detailThread;
  }
}

module.exports = GetThreadUseCase;
