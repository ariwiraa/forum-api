class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, username, date, isDeleted } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDeleted ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({ id, content, username, date, isDeleted }) {
    if (!id || !content || !username || !date) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      typeof content !== 'string'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
