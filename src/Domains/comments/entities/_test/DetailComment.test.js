const DetailComment = require('../DetailComment');

describe('detail comment', () => {
  it('should throw error when payload is not contain property', () => {
    // arrange
    const payload = {
      id: 'comment-123',
      username: 'ariwiraa',
    };

    // action & assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_PROPERTY'
    );
  });

  it('should throw error when payload is not meet data type specification', () => {
    const payload = {
      id: 'thread-123',
      username: 'ariwiraa',
      content: 123,
      isDeleted: false,
    };

    // action & assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create detail comment object correctly when isDeleted is false', () => {
    const payload = {
      id: 'comment-123',
      username: 'ariwiraa',
      content: 'komentar',
      isDeleted: false,
    };

    const detailComment = new DetailComment(payload);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual(payload.content);
  });

  it('should create detail comment object correctly when isDeleted is true', () => {
    const payload = {
      id: 'comment-123',
      username: 'ariwiraa',
      content: 'komentar',
      isDeleted: true,
    };

    const detailComment = new DetailComment(payload);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual('**komentar telah dihapus**');
  });
});
