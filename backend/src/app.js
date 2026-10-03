const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// CORS
const origins = (process.env.CORS_ORIGIN || '*').split(',').map((s) => s.trim());
app.use(cors({ origin: origins.includes('*') ? true : origins }));

app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Health check
app.get('/', (_req, res) =>
  res.json({ ok: true, service: 'mau-kemana-backend', time: new Date().toISOString() })
);

// API
app.use('/api', routes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
