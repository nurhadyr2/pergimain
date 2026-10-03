'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('places', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, defaultValue: '' },
      address: { type: Sequelize.STRING, defaultValue: '' },
      map_url: { type: Sequelize.STRING, defaultValue: '' },
      image_url: { type: Sequelize.STRING, defaultValue: '' },
      price_level: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });
    await queryInterface.addIndex('places', ['category_id']);
    await queryInterface.addIndex('places', ['is_active']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('places');
  },
};
