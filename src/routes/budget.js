const express = require('express');
const BudgetEntry = require('../models/BudgetEntry');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { budgetEntryValidation } = require('../middleware/validation');

const router = express.Router();

// Get budget summary
router.get('/summary', auth, async (req, res) => {
  try {
    const summary = await User.getBudgetSummary(req.user.id);
    res.json(summary);
  } catch (error) {
    console.error('Budget summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all entries for user
router.get('/entries', auth, async (req, res) => {
  try {
    const { category, limit = 50, offset = 0 } = req.query;
    
    let entries;
    if (category && ['needs', 'wants', 'savings'].includes(category)) {
      entries = await BudgetEntry.findByUserIdAndCategory(req.user.id, category, parseInt(limit), parseInt(offset));
    } else {
      entries = await BudgetEntry.findByUserId(req.user.id, parseInt(limit), parseInt(offset));
    }

    res.json({ entries });
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add entry to a category
router.post('/entries/:category', auth, budgetEntryValidation, async (req, res) => {
  try {
    const { category } = req.params;
    const { item, amount } = req.body;

    if (!['needs', 'wants', 'savings'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category. Must be needs, wants, or savings.' });
    }

    const entry = await BudgetEntry.create({
      userId: req.user.id,
      category,
      item,
      amount: parseFloat(amount)
    });

    // Get updated summary
    const summary = await User.getBudgetSummary(req.user.id);

    res.status(201).json({
      message: 'Entry added successfully',
      entry,
      summary
    });
  } catch (error) {
    console.error('Add entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an entry
router.put('/entries/:id', auth, budgetEntryValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const { item, amount } = req.body;

    // Check if entry exists and belongs to user
    const existingEntry = await BudgetEntry.findById(id, req.user.id);
    if (!existingEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    const updatedEntry = await BudgetEntry.update(id, req.user.id, {
      item,
      amount: parseFloat(amount)
    });

    // Get updated summary
    const summary = await User.getBudgetSummary(req.user.id);

    res.json({
      message: 'Entry updated successfully',
      entry: updatedEntry,
      summary
    });
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an entry
router.delete('/entries/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if entry exists and belongs to user
    const existingEntry = await BudgetEntry.findById(id, req.user.id);
    if (!existingEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    await BudgetEntry.delete(id, req.user.id);

    // Get updated summary
    const summary = await User.getBudgetSummary(req.user.id);

    res.json({
      message: 'Entry deleted successfully',
      summary
    });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get monthly totals
router.get('/monthly/:year/:month', auth, async (req, res) => {
  try {
    const { year, month } = req.params;
    const totals = await BudgetEntry.getMonthlyTotals(req.user.id, parseInt(year), parseInt(month));
    res.json({ totals });
  } catch (error) {
    console.error('Monthly totals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset all budget data (delete all entries)
router.delete('/reset', auth, async (req, res) => {
  try {
    const deletedCount = await BudgetEntry.deleteAllByUserId(req.user.id);
    
    // Get updated summary
    const summary = await User.getBudgetSummary(req.user.id);

    res.json({
      message: `Successfully deleted ${deletedCount} entries`,
      summary
    });
  } catch (error) {
    console.error('Reset budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
