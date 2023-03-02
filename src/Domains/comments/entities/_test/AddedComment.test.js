const AddedComment = require('../AddedComment');

describe('add comment', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'ini adalah komentar',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_CONTAIN_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'ini adalah komentar',
      owner: 123,
      id: 'comment-123',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_MEET_DATA_SPECIFICATION'
    );
  });

  it('should create add comment object correctly', () => {
    const payload = {
      content: 'ini adalah komentar',
      owner: 'user-123',
      id: 'comment-123',
    };

    // action
    const { content, owner, id } = new AddedComment(payload);

    // assert
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(id).toEqual(payload.id);
  });
});
