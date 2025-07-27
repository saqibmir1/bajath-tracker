const db = require('../config/db');

class BudgetEntry {
  static async create({ userId, category, item, amount }) {
    const query = `
      INSERT INTO budget_entries (user_id, category, item, amount)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, category, item, amount, created_at, updated_at
    `;

    const values = [userId, category, item, amount];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId, limit = null, offset = 0) {
    let query = `
      SELECT id, category, item, amount, created_at, updated_at
      FROM budget_entries 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;

    const values = [userId];

    if (limit) {
      query += ` LIMIT $2 OFFSET $3`;
      values.push(limit, offset);
    }

    const result = await db.query(query, values);
    return result.rows;
  }

  static async findByUserIdAndCategory(userId, category, limit = null, offset = 0) {
    let query = `
      SELECT id, category, item, amount, created_at, updated_at
      FROM budget_entries 
      WHERE user_id = $1 AND category = $2 
      ORDER BY created_at DESC
    `;

    const values = [userId, category];

    if (limit) {
      query += ` LIMIT $3 OFFSET $4`;
      values.push(limit, offset);
    }

    const result = await db.query(query, values);
    return result.rows;
  }

  static async findById(id, userId) {
    const query = `
      SELECT id, category, item, amount, created_at, updated_at
      FROM budget_entries 
      WHERE id = $1 AND user_id = $2
    `;

    const result = await db.query(query, [id, userId]);
    return result.rows[0];
  }

  static async update(id, userId, { item, amount }) {
    const query = `
      UPDATE budget_entries 
      SET item = $3, amount = $4
      WHERE id = $1 AND user_id = $2
      RETURNING id, category, item, amount, created_at, updated_at
    `;

    const values = [id, userId, item, amount];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const query = 'DELETE FROM budget_entries WHERE id = $1 AND user_id = $2 RETURNING *';
    const result = await db.query(query, [id, userId]);
    return result.rows[0];
  }

  static async getTotalsByCategory(userId) {
    const query = `
      SELECT 
        category,
        SUM(amount) as total_amount,
        COUNT(*) as entry_count
      FROM budget_entries 
      WHERE user_id = $1 
      GROUP BY category
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async getMonthlyTotals(userId, year, month) {
    const query = `
      SELECT 
        category,
        SUM(amount) as total_amount,
        COUNT(*) as entry_count
      FROM budget_entries 
      WHERE user_id = $1 
        AND EXTRACT(YEAR FROM created_at) = $2
        AND EXTRACT(MONTH FROM created_at) = $3
      GROUP BY category
    `;

    const result = await db.query(query, [userId, year, month]);
    return result.rows;
  }

  static async deleteAllByUserId(userId) {
    const query = 'DELETE FROM budget_entries WHERE user_id = $1';
    const result = await db.query(query, [userId]);
    return result.rowCount;
  }
}

module.exports = BudgetEntry;
