'use strict';

// Riwayat jadi dua jenis: 'done' (sudah pergi) dan 'planned' (rencana, tampil 📌 di kalender).
// Plus jurnal setelah pergi: rating 1-5, catatan (kolom note sudah ada), 1 foto.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('history', 'status', {
      type: Sequelize.STRING(16),
      allowNull: false,
      defaultValue: 'done',
    });
    await queryInterface.addColumn('history', 'planned_at', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn('history', 'rating', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('history', 'photo_url', {
      type: Sequelize.STRING(512),
      allowNull: false,
      defaultValue: '',
    });
    await queryInterface.addIndex('history', ['status', 'planned_at']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('history', ['status', 'planned_at']);
    await queryInterface.removeColumn('history', 'photo_url');
    await queryInterface.removeColumn('history', 'rating');
    await queryInterface.removeColumn('history', 'planned_at');
    await queryInterface.removeColumn('history', 'status');
  },
};
