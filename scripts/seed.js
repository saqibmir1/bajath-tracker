const db = require('../src/config/db');
const User = require('../src/models/User');
const BudgetEntry = require('../src/models/BudgetEntry');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if demo user already exists
    const existingUser = await User.findByEmail('demo@example.com');
    if (existingUser) {
      console.log('Demo user already exists. Skipping seed.');
      return;
    }

    // Create demo user
    const demoUser = await User.create({
      email: 'demo@example.com',
      password: 'demo123',
      firstName: 'Demo',
      lastName: 'User',
      totalIncome: 50000,
      needsPercentage: 50,
      wantsPercentage: 30,
      savingsPercentage: 20
    });

    console.log('✅ Demo user created');

    // Sample budget entries
    const sampleEntries = [
      // Needs
      { category: 'needs', item: 'Rent', amount: 15000 },
      { category: 'needs', item: 'Groceries', amount: 5000 },
      { category: 'needs', item: 'Electricity Bill', amount: 1200 },
      { category: 'needs', item: 'Mobile Bill', amount: 800 },
      { category: 'needs', item: 'Transportation', amount: 2000 },
      
      // Wants
      { category: 'wants', item: 'Dining Out', amount: 2500 },
      { category: 'wants', item: 'Netflix Subscription', amount: 499 },
      { category: 'wants', item: 'Coffee Shop', amount: 800 },
      { category: 'wants', item: 'Shopping', amount: 3000 },
      { category: 'wants', item: 'Movies', amount: 600 },
      
      // Savings
      { category: 'savings', item: 'Emergency Fund', amount: 5000 },
      { category: 'savings', item: 'Investment SIP', amount: 3000 },
      { category: 'savings', item: 'Fixed Deposit', amount: 2000 }
    ];

    // Add sample entries
    for (const entry of sampleEntries) {
      await BudgetEntry.create({
        userId: demoUser.id,
        category: entry.category,
        item: entry.item,
        amount: entry.amount
      });
    }

    console.log('✅ Sample budget entries created');
    console.log('\n📋 Demo Account Details:');
    console.log('   Email: demo@example.com');
    console.log('   Password: demo123');
    console.log('   Monthly Income: ₹50,000');
    console.log('   Distribution: 50% Needs, 30% Wants, 20% Savings');
    console.log('\n🎯 You can now log in with these credentials to explore the app!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedData;
