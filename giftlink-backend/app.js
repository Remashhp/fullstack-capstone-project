
/*jshint esversion: 8 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');
const pinoHttp = require('pino-http');

const connectToDatabase = require('./models/db');
const { loadData } = require('./util/import-mongo/index');

const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = 3060;

// Middleware
app.use(cors());
app.use(express.json());

// HTTP Logger
app.use(pinoHttp({ logger: pinoLogger }));

// Connect to MongoDB
connectToDatabase()
    .then(() => {
        pinoLogger.info('Connected to DB');
    })
    .catch((e) => {
        console.error('Failed to connect to DB', e);
    });

// Routes
app.use('/api/gifts', giftRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

// Server test
app.get('/', (req, res) => {
    res.send('Inside the server');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
