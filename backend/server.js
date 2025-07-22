require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

connectDB();
const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/budgets', (req, res) => {
  res.send('Working on budgets API');
}); 

const PORT = process.env.PORT || 8000;
console.log("About to start server...");
app.listen(PORT, () => {
  console.log(`Server is running on port www.localhost:${PORT}`)
});
