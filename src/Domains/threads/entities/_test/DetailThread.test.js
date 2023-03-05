const DetailThread = require('../DetailThread');

describe('detail thread', () => {
  it('should throw error when payload is not contain property', () => {
    const payload = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2023',
    };

    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_CONTAIN_PROPERTY'
    );
  });

  it('should throw error when payload is not meet data type specification', () => {
    const payload = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2023',
      username: true,
      comments: [],
    };

    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECFICATION'
    );
  });

  it('should create detail thread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2023',
      username: 'ariwiraa',
      comments: [],
    };

    const { id, title, body, date, username, comments } = new DetailThread(
      payload
    );

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});
