const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentsRepository }) {
    this._commentsRepository = commentsRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    await this._commentsRepository.isCommentExist(
      deleteComment.threadId,
      deleteComment.commentId
    );
    await this._commentsRepository.verifyCommentByOwner(
      deleteComment.commentId,
      deleteComment.owner
    );
    await this._commentsRepository.deleteComment(deleteComment.commentId);
  }
}

module.exports = DeleteCommentUseCase;
