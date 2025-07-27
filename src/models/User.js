const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, firstName, lastName, totalIncome = 0, needsPercentage = 50, wantsPercentage = 30, savingsPercentage = 20 }) {
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, total_income, needs_percentage, wants_percentage, savings_percentage)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, first_name, last_name, total_income, needs_percentage, wants_percentage, savings_percentage, created_at
    `;

    const values = [email, passwordHash, firstName, lastName, totalIncome, needsPercentage, wantsPercentage, savingsPercentage];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT id, email, first_name, last_name, total_income, needs_percentage, wants_percentage, savings_percentage, created_at, updated_at 
      FROM users WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async updateProfile(id, { firstName, lastName, totalIncome, needsPercentage, wantsPercentage, savingsPercentage }) {
    const query = `
      UPDATE users 
      SET first_name = $2, last_name = $3, total_income = $4, needs_percentage = $5, wants_percentage = $6, savings_percentage = $7
      WHERE id = $1
      RETURNING id, email, first_name, last_name, total_income, needs_percentage, wants_percentage, savings_percentage, updated_at
    `;

    const values = [id, firstName, lastName, totalIncome, needsPercentage, wantsPercentage, savingsPercentage];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updatePassword(id, newPassword) {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    
    const query = 'UPDATE users SET password_hash = $2 WHERE id = $1';
    await db.query(query, [id, passwordHash]);
  }

  static async getBudgetSummary(id) {
    const userQuery = `
      SELECT total_income, needs_percentage, wants_percentage, savings_percentage 
      FROM users WHERE id = $1
    `;
    const userResult = await db.query(userQuery, [id]);
    const user = userResult.rows[0];

    if (!user) {
      throw new Error('User not found');
    }

    const entriesQuery = `
      SELECT 
        category,
        SUM(amount) as total_amount,
        COUNT(*) as entry_count
      FROM budget_entries 
      WHERE user_id = $1 
      GROUP BY category
    `;
    const entriesResult = await db.query(entriesQuery, [id]);

    const totals = {
      needs: { total: (user.total_income * user.needs_percentage / 100), spent: 0 },
      wants: { total: (user.total_income * user.wants_percentage / 100), spent: 0 },
      savings: { total: (user.total_income * user.savings_percentage / 100), saved: 0 }
    };

    entriesResult.rows.forEach(row => {
      if (row.category === 'savings') {
        totals[row.category].saved = parseFloat(row.total_amount);
      } else {
        totals[row.category].spent = parseFloat(row.total_amount);
      }
    });

    return {
      totalIncome: parseFloat(user.total_income),
      percentages: {
        needs: user.needs_percentage,
        wants: user.wants_percentage,
        savings: user.savings_percentage
      },
      categories: totals
    };
  }
}

module.exports = User;
