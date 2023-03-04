class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { owner, threadId, commentId } = payload;

    this.owner = owner;
    this.threadId = threadId;
    this.commentId = commentId;
  }

  _verifyPayload({ owner, threadId, commentId }) {
    if (!owner || !threadId || !commentId) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_DATA');
    }

    if (
      typeof owner !== 'string' ||
      typeof threadId !== 'string' ||
      typeof commentId !== 'string'
    ) {
      throw new Error('DELETE_COMMENT.NOT_CMEET_DATA_SPECIFICATION');
    }
  }
}

module.exports = DeleteComment;
