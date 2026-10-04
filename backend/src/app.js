const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Di balik Caddy/Nginx: pakai IP asli klien (untuk rem percobaan PIN).
app.set('trust proxy', 1);

// CORS
const origins = (process.env.CORS_ORIGIN || '*').split(',').map((s) => s.trim());
app.use(cors({ origin: origins.includes('*') ? true : origins }));

app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Health check
app.get('/healthz', (_req, res) =>
  res.json({ ok: true, service: 'mau-kemana-backend', time: new Date().toISOString() })
);

// API
app.use('/api', routes);

// Sajikan frontend statis (hasil build Vite) + fallback SPA.
// Struktur di server: backend/src -> ../../frontend/dist
const distPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(distPath));
app.get(/^\/(?!api\/).*/, (_req, res) => res.sendFile(path.join(distPath, 'index.html')));

// 404 + error handler (untuk /api yang tidak cocok)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
