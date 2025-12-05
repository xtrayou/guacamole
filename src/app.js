require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./db');

const pagesRouter = require('./routes/pages');
const apiRouter = require('./routes/api');

const app = express();

// If MySQL is enabled, test the connection on startup (non-blocking)
if (String(process.env.USE_MYSQL).toLowerCase() === 'true') {
	db.testConnection().then((ok) => {
		if (ok) console.log('MySQL connection: OK');
		else console.warn('MySQL connection: FAILED');
	});
}

// Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static assets
app.use(express.static(path.join(process.cwd(), 'public')));

// Routes
app.use('/', pagesRouter);
app.use('/api', apiRouter);

module.exports = app;
