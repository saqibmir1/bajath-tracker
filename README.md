# Budget Tracker - Personal Finance Management

A comprehensive personal budget tracking application with user authentication, PostgreSQL database, and mobile-optimized interface.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based secure login and registration
- **Personal Budget Management**: Track income, expenses, and savings
- **Customizable Budget Distribution**: Set your own percentages for needs, wants, and savings (default: 50/30/20)
- **Real-time Data**: Persistent data storage with PostgreSQL
- **Mobile Optimized**: Responsive design that works on all devices

### Advanced Features
- **Editable Entries**: Edit and delete any budget entry
- **Visual Dashboard**: Interactive charts and progress indicators
- **Profile Management**: Update income and budget distribution anytime
- **Secure Data**: Individual user data isolation with JWT authentication
- **Real-time Updates**: Immediate UI updates after any changes

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: Vanilla JavaScript, TailwindCSS, Chart.js
- **Security**: Helmet, CORS, Rate Limiting, bcrypt password hashing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Setup Steps

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd bajath
   npm install
   ```

2. **Database Setup**
   ```bash
   # Create a PostgreSQL database
   createdb budget_tracker
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE budget_tracker;
   \q
   ```

3. **Environment Configuration**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your database credentials
   nano .env
   ```

   **Required Environment Variables:**
   ```env
   NODE_ENV=development
   PORT=3000
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=budget_tracker
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   JWT_EXPIRES_IN=7d
   ```

4. **Database Migration**
   ```bash
   # Run database migrations to create tables
   npm run db:migrate
   ```

5. **Start the Application**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the Application**
   Open your browser and go to `http://localhost:3000`

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique user email
- `password_hash` - Encrypted password
- `first_name`, `last_name` - User details
- `total_income` - Monthly income
- `needs_percentage`, `wants_percentage`, `savings_percentage` - Budget distribution
- `created_at`, `updated_at` - Timestamps

### Budget Entries Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `category` - 'needs', 'wants', or 'savings'
- `item` - Description of the entry
- `amount` - Amount spent/saved
- `created_at`, `updated_at` - Timestamps

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/verify` - Verify JWT token

### Budget Management
- `GET /api/budget/summary` - Get budget summary with totals
- `GET /api/budget/entries` - Get all user entries (with pagination)
- `POST /api/budget/entries/:category` - Add new entry to category
- `PUT /api/budget/entries/:id` - Update specific entry
- `DELETE /api/budget/entries/:id` - Delete specific entry
- `DELETE /api/budget/reset` - Reset all budget data

### Utility
- `GET /api/health` - Health check endpoint

## 🎯 Usage Guide

### First Time Setup
1. **Register**: Create your account with email and password
2. **Set Income**: Enter your monthly income
3. **Choose Distribution**: Set percentages for needs, wants, and savings (must total 100%)
4. **Start Tracking**: Begin adding your expenses and savings

### Daily Usage
1. **Add Entries**: Use the forms in each category to add expenses/savings
2. **Edit Entries**: Click "Edit" on any entry to modify it
3. **Delete Entries**: Click "Del" to remove entries
4. **Monitor Progress**: View real-time charts and remaining budgets
5. **Update Profile**: Adjust income or percentages as needed

### Tips for Effective Budgeting
- **50/30/20 Rule**: 50% needs, 30% wants, 20% savings (adjustable)
- **Needs**: Essential expenses (rent, groceries, utilities)
- **Wants**: Discretionary spending (entertainment, dining out)
- **Savings**: Emergency fund, investments, long-term goals

## 🔧 Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data (if implemented)

### Project Structure
```
bajath/
├── src/
│   ├── config/         # Database configuration
│   ├── models/         # Data models (User, BudgetEntry)
│   ├── routes/         # API routes (auth, budget)
│   ├── middleware/     # Auth, validation middleware
│   └── ...
├── public/             # Frontend files
├── scripts/            # Database scripts
├── server.js           # Main server file
└── package.json        # Dependencies and scripts
```

## 🚀 Deployment

### Production Environment
1. Set `NODE_ENV=production` in your environment
2. Use a production PostgreSQL database
3. Set a strong `JWT_SECRET`
4. Configure CORS for your domain
5. Use a process manager like PM2

### Example PM2 Configuration
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name "budget-tracker"

# Save PM2 configuration
pm2 save
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **CORS Protection**: Configurable allowed origins
- **Rate Limiting**: API call rate limiting
- **Input Validation**: Express-validator for all inputs
- **SQL Injection Protection**: Parameterized queries
- **Helmet**: Security headers

## 📱 Mobile Support

The application is fully responsive and optimized for:
- iOS Safari
- Android Chrome
- Mobile Chrome/Firefox
- Touch-friendly interface
- Optimized form inputs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
- Check PostgreSQL is running
- Verify database credentials in `.env`
- Ensure database exists

**JWT Token Issues**
- Clear browser localStorage
- Check JWT_SECRET is set
- Verify token hasn't expired

**Migration Fails**
- Check database permissions
- Verify PostgreSQL version compatibility
- Check for existing tables

### Getting Help
- Check the GitHub issues
- Review the API documentation
- Verify environment configuration

---

Built with ❤️ for personal finance management
