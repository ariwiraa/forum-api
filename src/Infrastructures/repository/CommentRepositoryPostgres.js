const CommentRepository = require('../../Domains/comments/CommentsRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(payload) {
    const { owner, content, threadId } = payload;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, threadId, content, owner],
    };

    const { rows } = await this._pool.query(query);

    return new AddedComment(rows[0]);
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = TRUE WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async verifyCommentByOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new AuthorizationError('anda tidak memiliki akses ke komentar ini');
    }
  }

  async isCommentExist(threadId, id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [id, threadId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async findAllCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.content, comments.date, comments.is_deleted, users.username 
      FROM comments 
      INNER JOIN users ON comments.owner = users.id 
      WHERE comments.thread_id = $1 
      ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows.map(
      (comments) =>
        new DetailComment({
          ...comments,
          isDeleted: comments.is_deleted,
          date: comments.date.toISOString(),
        })
    );
  }
}

module.exports = CommentRepositoryPostgres;
