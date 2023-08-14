/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'title',
    body = 'body',
    owner = 'user-123',
    date = '2023-03-17T18:41:00.000Z',
  }) {
    await pool.query({
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, owner, date],
    });
  },

  async findThreadById(id = 'thread-123') {
    const result = await pool.query({
      text: 'SELECT FROM threads WHERE id = $1',
      values: [id],
    });

    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
