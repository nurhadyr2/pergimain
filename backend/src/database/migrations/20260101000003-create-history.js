'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('history', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      place_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'places', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      place_name: { type: Sequelize.STRING, allowNull: false },
      note: { type: Sequelize.TEXT, defaultValue: '' },
      spun_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });
    await queryInterface.addIndex('history', ['spun_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('history');
  },
};
