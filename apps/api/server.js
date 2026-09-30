require('dotenv').config();

const cors = require('cors');
const express = require('express');
const { connectDatabase } = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', require('./routes'));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  connectDatabase(process.env.MONGODB_URI)
    .then(() => app.listen(process.env.PORT || 3000, () => console.log('API listening')))
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}

module.exports = app;
