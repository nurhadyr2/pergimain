// Isi ulang tabel places dengan tempat-tempat nyata di Jabodetabek,
// lengkap dengan link Google Maps yang bisa langsung dibuka.
// Jalankan dari folder backend: node seed-jabodetabek.js
const { sequelize, Category, Place } = require('./src/models');

const maps = (name, area) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${area}`)}`;

// [nama, deskripsi, area, priceLevel]
const data = {
  makan: [
    ['Sate Khas Senayan', 'Sate ayam & kambing legendaris', 'Jakarta Pusat', 2],
    ['Nasi Goreng Kambing Kebon Sirih', 'Nasgor kambing legendaris sejak lama', 'Kebon Sirih, Jakarta Pusat', 1],
    ['Bakmi GM', 'Bakmi & pangsit favorit keluarga', 'Jakarta', 1],
    ['RM Padang Sederhana', 'Masakan Padang komplit', 'Jabodetabek', 1],
    ['Mie Gacoan', 'Mie pedas hits buat mahasiswa', 'Jabodetabek', 1],
    ['Seafood Muara Karang', 'Aneka seafood segar malam hari', 'Muara Karang, Jakarta Utara', 2],
  ],
  ngopi: [
    ['Kopi Tuku', 'Es kopi susu tetangga yang ikonik', 'Cipete, Jakarta Selatan', 1],
    ['Tanamera Coffee', 'Specialty coffee buat ngobrol lama', 'Jakarta', 2],
    ['Fore Coffee', 'Kopi susu praktis di mana-mana', 'Jabodetabek', 1],
    ['Djournal Coffee', 'Kafe cozy buat nugas & ngopi', 'Jakarta', 2],
    ['Kopi Kenangan', 'Kopi susu favorit sejuta umat', 'Jabodetabek', 1],
  ],
  main: [
    ['Dunia Fantasi (Dufan)', 'Wahana seru seharian', 'Ancol, Jakarta Utara', 3],
    ['Trans Studio Cibubur', 'Theme park indoor', 'Cibubur', 3],
    ['Waterbom PIK', 'Main air & seluncuran', 'PIK, Jakarta Utara', 3],
    ['Timezone', 'Arcade & photobox di mall', 'Jabodetabek', 2],
    ['KidZania Jakarta', 'Kota mini buat seru-seruan', 'Pacific Place, Jakarta Selatan', 3],
  ],
  jalan: [
    ['Kota Tua Jakarta', 'Jalan santai di bangunan tua', 'Jakarta Barat', 0],
    ['Bundaran HI', 'Ikon kota, apalagi pas Car Free Day', 'Jakarta Pusat', 0],
    ['Alun-alun Kota Bogor', 'Nyantai & jajan di tengah kota', 'Bogor', 0],
    ['Jalan Jaksa', 'Suasana klasik & kuliner', 'Jakarta Pusat', 0],
    ['Old Shanghai PIK', 'Area estetik bernuansa oriental', 'PIK 2, Tangerang', 1],
  ],
  taman: [
    ['Tebet Eco Park', 'Taman hijau kekinian buat piknik', 'Tebet, Jakarta Selatan', 0],
    ['Taman Suropati', 'Taman teduh di Menteng', 'Menteng, Jakarta Pusat', 0],
    ['Kebun Raya Bogor', 'Jalan di antara pohon raksasa', 'Bogor', 1],
    ['Taman Mini Indonesia Indah', 'Taman budaya luas', 'Jakarta Timur', 1],
    ['Situ Gintung', 'Jalan mengelilingi danau', 'Tangerang Selatan', 0],
    ['Taman Literasi Martha Tiahahu', 'Taman baca estetik di Blok M', 'Blok M, Jakarta Selatan', 0],
  ],
  nonton: [
    ['Cinema XXI Grand Indonesia', 'Nonton film terbaru di pusat kota', 'Grand Indonesia, Jakarta Pusat', 2],
    ['CGV FX Sudirman', 'Bioskop nyaman di Sudirman', 'FX Sudirman, Jakarta Pusat', 2],
    ['XXI Plaza Senayan', 'Bioskop klasik yang nyaman', 'Plaza Senayan, Jakarta', 2],
  ],
  belanja: [
    ['Grand Indonesia', 'Mall besar buat window shopping', 'Jakarta Pusat', 2],
    ['Pasar Baru', 'Belanja tekstil & kuliner lawas', 'Jakarta Pusat', 1],
    ['Pasar Santa', 'Thrift, vinyl, kopi, barang unik', 'Jakarta Selatan', 1],
    ['ITC Mangga Dua', 'Grosir murah serba ada', 'Jakarta Utara', 1],
    ['Thamrin City', 'Pusat batik & oleh-oleh', 'Jakarta Pusat', 1],
  ],
  nongkrong: [
    ['M Bloc Space', 'Kreatif hub buat nongkrong & live music', 'Jakarta Selatan', 1],
    ['Sarinah', 'Gedung ikonik dengan food & ruang publik', 'Thamrin, Jakarta Pusat', 1],
    ['Pantai Indah Kapuk (PIK)', 'Deretan kafe & suasana malam', 'Jakarta Utara', 2],
    ['Blok M', 'Pusat nongkrong klasik anak muda', 'Jakarta Selatan', 1],
    ['Gandaria City', 'Mall buat nongkrong santai', 'Jakarta Selatan', 2],
  ],
};

async function run() {
  await sequelize.authenticate();
  const cats = await Category.findAll();
  const idBySlug = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

  // Hapus semua tempat lama (data contoh) lalu isi Jabodetabek.
  await Place.destroy({ where: {}, truncate: false });

  const rows = [];
  for (const [slug, places] of Object.entries(data)) {
    const categoryId = idBySlug[slug];
    if (!categoryId) {
      console.warn(`(lewati) kategori tidak ada: ${slug}`);
      continue;
    }
    for (const [name, description, address, priceLevel] of places) {
      rows.push({
        categoryId,
        name,
        description,
        address,
        mapUrl: maps(name, address),
        priceLevel,
        isActive: true,
      });
    }
  }

  await Place.bulkCreate(rows);
  console.log(`Selesai. ${rows.length} tempat Jabodetabek dimasukkan.`);
  await sequelize.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed gagal:', err);
  process.exit(1);
});
