const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('should throw error when payload did not contain property', () => {
    const payload = {
      id: 'thread=123',
      title: 'title',
    };

    expect(() => new AddedThread(payload)).toThrowError(
      'ADDED_THREAD.CONTAIN_NEEDED_PROPERTY'
    );
  });
  it('should throw error when payload did not meet data specification', () => {
    const payload = {
      id: 'thread=123',
      title: 'title',
      owner: true,
    };

    expect(() => new AddedThread(payload)).toThrowError(
      'ADDED_THREAD.NOT_MEET_DATA_SPECIFICATION'
    );
  });
  it('should create registeredUser object correctly', () => {
    const payload = {
      id: 'thread=123',
      title: 'title',
      owner: 'user-123',
    };

    const addedThread = new AddedThread(payload);

    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
