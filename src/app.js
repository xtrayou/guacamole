const express = require('express');
const path = require('path');

const pagesRouter = require('./routes/pages');
const apiRouter = require('./routes/api');

const app = express();

// Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static assets
app.use(express.static(path.join(process.cwd(), 'public')));

// Routes
app.use('/', pagesRouter);
app.use('/api', apiRouter);

module.exports = app;
