/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'comment',
    owner = 'user-123',
    date = '2023',
  }) {
    await pool.query({
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4)',
      values: [id, content, owner, date],
    });
  },

  async findCommentById(id = 'comment-123') {
    const result = await pool.query({
      text: 'SELECT FROM comments WHERE id = $1',
      values: [id],
    });

    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
