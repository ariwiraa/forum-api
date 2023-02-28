class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, owner } = payload;

    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload({ title, body, owner }) {
    if (!title || !body || !owner) {
      throw new Error('NEW_THREADS.NOT_CONTAIN_DATA');
    }

    if (
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('NEW_THREADS.DATA_NOT_STRING');
    }

    if (title.length > 50) {
      throw new Error('NEW_THREADS.TITLE_LIMIT_CHAR');
    }
  }
}

module.exports = NewThread;
