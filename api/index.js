const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/db');
const expenseRoutes = require('./src/routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/expenses', expenseRoutes);

app.get('/', (req, res) => {
    res.send('Expense Tracker API is running');
});

// Export the Express API
module.exports = app;

// Only start the server if we aren't being imported (e.g. by Vercel)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
