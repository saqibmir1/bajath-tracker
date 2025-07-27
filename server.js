const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize data.json if it doesn't exist
function initializeDataFile() {
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = {
            totalIncome: 18000,
            lastUpdated: null,
            categories: {
                needs: {
                    total: 9000,
                    spent: 0,
                    entries: []
                },
                wants: {
                    total: 5400,
                    spent: 0,
                    entries: []
                },
                savings: {
                    total: 3600,
                    saved: 0,
                    entries: []
                }
            }
        };
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
        console.log('✅ Created data.json with initial budget data');
    }
}

// Read data from file
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data.json:', error);
        throw new Error('Failed to read budget data');
    }
}

// Write data to file
function writeData(data) {
    try {
        data.lastUpdated = new Date().toISOString();
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing data.json:', error);
        throw new Error('Failed to save budget data');
    }
}

// API Routes

// Get all budget data
app.get('/api/budget', (req, res) => {
    try {
        const data = readData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add entry to a category
app.post('/api/budget/:category', (req, res) => {
    try {
        const { category } = req.params;
        const { item, amount } = req.body;
        
        if (!['needs', 'wants', 'savings'].includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }
        
        if (!item || !amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid item or amount' });
        }
        
        const data = readData();
        const entry = { item, amount: parseFloat(amount), date: new Date().toISOString() };
        
        data.categories[category].entries.push(entry);
        
        if (category === 'savings') {
            data.categories[category].saved += parseFloat(amount);
        } else {
            data.categories[category].spent += parseFloat(amount);
        }
        
        writeData(data);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize and start server
initializeDataFile();

app.listen(PORT, () => {
    console.log(`🚀 Budget Tracker running on http://localhost:${PORT}`);
    console.log(`📊 Data file: ${DATA_FILE}`);
});