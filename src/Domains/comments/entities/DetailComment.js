class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, username, isDeleted, date } = payload;

    this.id = id;
    this.username = username;
    this.content = isDeleted ? '**komentar telah dihapus**' : content;
    this.date = date;
    this.is_deleted = isDeleted;
  }

  _verifyPayload({ id, content, username, date }) {
    if (!id || !content || !username) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof content !== 'string'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
