const NewThread = require('../NewThread');

describe('new threads', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'ini adalah title',
      owner: 'user-123',
    };

    // ACtion and Assert
    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREADS.NOT_CONTAIN_DATA'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 'ini adalah title',
      body: true,
      owner: 'user-123',
    };

    // ACtion and Assert
    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREADS.DATA_NOT_STRING'
    );
  });

  it('should create new threads object correctly', () => {
    const payload = {
      title: 'ini adalah title',
      body: 'ini adalah body',
      owner: 'user-123',
    };

    // Action
    const { title, body, owner } = new NewThread(payload);

    // assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
