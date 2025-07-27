const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { registerValidation, loginValidation, profileUpdateValidation } = require('../middleware/validation');

const router = express.Router();

// Register
router.post('/register', registerValidation, async (req, res) => {
  try {
    const { email, password, firstName, lastName, totalIncome, needsPercentage, wantsPercentage, savingsPercentage } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      totalIncome: totalIncome || 0,
      needsPercentage: needsPercentage || 50,
      wantsPercentage: wantsPercentage || 30,
      savingsPercentage: savingsPercentage || 20
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        totalIncome: user.total_income,
        needsPercentage: user.needs_percentage,
        wantsPercentage: user.wants_percentage,
        savingsPercentage: user.savings_percentage
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        totalIncome: user.total_income,
        needsPercentage: user.needs_percentage,
        wantsPercentage: user.wants_percentage,
        savingsPercentage: user.savings_percentage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        totalIncome: user.total_income,
        needsPercentage: user.needs_percentage,
        wantsPercentage: user.wants_percentage,
        savingsPercentage: user.savings_percentage
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', auth, profileUpdateValidation, async (req, res) => {
  try {
    const { firstName, lastName, totalIncome, needsPercentage, wantsPercentage, savingsPercentage } = req.body;

    const updatedUser = await User.updateProfile(req.user.id, {
      firstName,
      lastName,
      totalIncome,
      needsPercentage,
      wantsPercentage,
      savingsPercentage
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        totalIncome: updatedUser.total_income,
        needsPercentage: updatedUser.needs_percentage,
        wantsPercentage: updatedUser.wants_percentage,
        savingsPercentage: updatedUser.savings_percentage
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token (for frontend to check if user is still authenticated)
router.get('/verify', auth, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
