module.exports = (_req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan' });
};
