/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'comment',
    owner = 'user-123',
    threadId = 'thread-123',
    isDeleted = false,
  }) {
    await pool.query({
      text: 'INSERT INTO comments (id, content, owner, thread_id, is_deleted) VALUES ($1, $2, $3,$4, $5)',
      values: [id, content, owner, threadId, isDeleted],
    });
  },

  async findCommentById(id = 'comment-123') {
    const result = await pool.query({
      text: 'SELECT id, is_deleted FROM comments WHERE id = $1',
      values: [id],
    });

    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
