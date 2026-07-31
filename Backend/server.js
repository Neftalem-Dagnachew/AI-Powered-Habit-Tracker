require('dotenv').config();
const express = require('express');
const db = require('./config/db');
const cors = require('cors');

const authRouter = require('./routes/authRouter');
const habitRouter = require('./routes/habitRouter');
const habitLogRouter = require('./routes/habitLogRouter');
const aiRouter = require('./routes/aiRouter');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/habits', habitRouter);
app.use('/api/habits', habitLogRouter);
app.use('/api/ai', aiRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});