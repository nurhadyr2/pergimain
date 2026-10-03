'use strict';

const now = new Date();

const categories = [
  { slug: 'makan',     name: 'Makan',       icon: 'utensils',       color: '#ef4444', sort_order: 1 },
  { slug: 'ngopi',     name: 'Ngopi',       icon: 'mug-hot',        color: '#b45309', sort_order: 2 },
  { slug: 'main',      name: 'Main',        icon: 'gamepad',        color: '#8b5cf6', sort_order: 3 },
  { slug: 'jalan',     name: 'Jalan-jalan', icon: 'person-walking', color: '#0ea5e9', sort_order: 4 },
  { slug: 'taman',     name: 'Taman',       icon: 'tree',           color: '#22c55e', sort_order: 5 },
  { slug: 'nonton',    name: 'Nonton',      icon: 'film',           color: '#ec4899', sort_order: 6 },
  { slug: 'belanja',   name: 'Belanja',     icon: 'bag-shopping',   color: '#f59e0b', sort_order: 7 },
  { slug: 'nongkrong', name: 'Nongkrong',   icon: 'couch',          color: '#14b8a6', sort_order: 8 },
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'categories',
      categories.map((c) => ({ ...c, created_at: now, updated_at: now }))
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
