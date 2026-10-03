'use strict';

const now = new Date();

// Daftar tempat contoh per slug kategori
const bySlug = {
  makan: [
    ['Warung Nasi Sederhana', 'Nasi + lauk komplit, porsi mantap', 'Dekat rumah', 1],
    ['Bakso Favorit', 'Bakso urat + mie, kuah gurih', 'Pusat kota', 1],
    ['Restoran Jepang', 'Sushi & ramen buat spesial', 'Mall', 2],
    ['Seafood Tepi Pantai', 'Kerang, cumi, ikan bakar', 'Pinggir laut', 3],
  ],
  ngopi: [
    ['Kopi Senja', 'Kafe cozy buat ngobrol lama', 'Jalan utama', 2],
    ['Kedai Kopi Rumahan', 'Manual brew, tenang, murah', 'Gang kecil', 1],
    ['Rooftop Coffee', 'Pemandangan kota dari atas', 'Gedung tinggi', 2],
  ],
  main: [
    ['Arcade / Timezone', 'Main game, foto di photobox', 'Mall', 2],
    ['Bowling', 'Seru-seruan adu skor', 'Mall', 2],
    ['Karaoke', 'Nyanyi bareng sepuasnya', 'Pusat kota', 2],
  ],
  jalan: [
    ['Alun-alun Kota', 'Jalan santai sambil jajan', 'Pusat kota', 0],
    ['Pusat Kota Malam', 'Lampu kota & suasana rame', 'Downtown', 0],
    ['Pasar Malam', 'Jajanan & permainan', 'Lapangan', 1],
  ],
  taman: [
    ['Taman Kota', 'Duduk santai di rumput, piknik', 'Taman kota', 0],
    ['Taman Bunga', 'Spot foto, sejuk, instagramable', 'Pinggir kota', 1],
    ['Danau / Embung', 'Jalan mengelilingi danau', 'Pinggir kota', 0],
  ],
  nonton: [
    ['Bioskop', 'Nonton film terbaru', 'Mall', 2],
    ['Nonton di Rumah', 'Streaming + cemilan, hemat & cozy', 'Rumah', 0],
  ],
  belanja: [
    ['Thrift / Baju Bekas', 'Berburu baju unik murah', 'Pasar', 1],
    ['Window Shopping Mall', 'Keliling mall tanpa harus beli', 'Mall', 0],
  ],
  nongkrong: [
    ['Tongkrongan Senja', 'Duduk, ngobrol, lihat matahari', 'Bukit', 0],
    ['Angkringan', 'Nasi kucing + wedang jahe', 'Pinggir jalan', 1],
  ],
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const cats = await queryInterface.sequelize.query(
      'SELECT id, slug FROM categories',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const idOf = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

    const rows = [];
    for (const [slug, list] of Object.entries(bySlug)) {
      const categoryId = idOf[slug];
      if (!categoryId) continue;
      for (const [name, description, address, price_level] of list) {
        rows.push({
          category_id: categoryId,
          name,
          description,
          address,
          map_url: '',
          image_url: '',
          price_level,
          is_active: true,
          created_at: now,
          updated_at: now,
        });
      }
    }

    await queryInterface.bulkInsert('places', rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('places', null, {});
  },
};
