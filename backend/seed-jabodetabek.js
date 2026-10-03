// Isi ulang kategori + tempat sesuai selera: tanpa kopi, tanpa junk food,
// fokus makanan Padang & Sulawesi + warteg, dan banyak museum, bioskop, hewan.
// Jalankan dari folder backend: node seed-jabodetabek.js
const { sequelize, Category, Place } = require('./src/models');

const maps = (name, area) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${area}`)}`;

// Kategori yang diinginkan (Ngopi dihapus; Museum & Hewan ditambah).
const desiredCats = [
  { slug: 'makan', name: 'Makan', icon: 'utensils', color: '#ef4444', sortOrder: 1 },
  { slug: 'nonton', name: 'Nonton', icon: 'film', color: '#ec4899', sortOrder: 2 },
  { slug: 'museum', name: 'Museum', icon: 'landmark', color: '#8b5cf6', sortOrder: 3 },
  { slug: 'hewan', name: 'Hewan', icon: 'paw', color: '#f59e0b', sortOrder: 4 },
  { slug: 'taman', name: 'Taman', icon: 'tree', color: '#22c55e', sortOrder: 5 },
  { slug: 'jalan', name: 'Jalan-jalan', icon: 'person-walking', color: '#0ea5e9', sortOrder: 6 },
  { slug: 'main', name: 'Main', icon: 'gamepad', color: '#22d3ee', sortOrder: 7 },
  { slug: 'belanja', name: 'Belanja', icon: 'bag-shopping', color: '#f59e0b', sortOrder: 8 },
  { slug: 'nongkrong', name: 'Nongkrong', icon: 'couch', color: '#14b8a6', sortOrder: 9 },
];

// [nama, deskripsi, area, priceLevel]
const data = {
  makan: [
    ['RM Padang Sederhana', 'Masakan Padang komplit', 'Jakarta', 1],
    ['RM Sari Bundo', 'Nasi Padang legendaris', 'Jakarta Pusat', 2],
    ['Padang Pagi Sore', 'Rendang & gulai mantap', 'Jakarta', 2],
    ['Coto Makassar', 'Coto khas Sulawesi, kuah kacang gurih', 'Jakarta', 1],
    ['Konro Karebosi', 'Sop & konro bakar khas Makassar', 'Jakarta', 2],
    ['Sop Saudara Makassar', 'Sop daging khas Sulawesi', 'Jakarta', 2],
    ['Warteg Warmo Tebet', 'Warteg legendaris murah meriah', 'Tebet, Jakarta Selatan', 1],
    ['Warteg Kharisma Bahari', 'Warteg bersih di mana-mana', 'Jabodetabek', 1],
    ['Soto Betawi H. Maruf', 'Soto santan khas Betawi', 'Jakarta', 1],
    ['Nasi Uduk Kebon Kacang', 'Nasi uduk komplit sejak lama', 'Tanah Abang, Jakarta Pusat', 1],
    ['Gado-gado Bonbin', 'Gado-gado legendaris', 'Cikini, Jakarta Pusat', 1],
    ['Sate Khas Senayan', 'Sate ayam & kambing', 'Jakarta Pusat', 2],
  ],
  nonton: [
    ['Cinema XXI Grand Indonesia', 'Nonton film terbaru di pusat kota', 'Grand Indonesia, Jakarta Pusat', 2],
    ['CGV FX Sudirman', 'Bioskop nyaman di Sudirman', 'FX Sudirman, Jakarta Pusat', 2],
    ['Metropole XXI', 'Bioskop klasik bersejarah', 'Cikini, Jakarta Pusat', 2],
    ['IMAX Gandaria City', 'Layar IMAX besar', 'Gandaria City, Jakarta Selatan', 2],
    ['XXI Pondok Indah Mall', 'Bioskop nyaman di PIM', 'Pondok Indah, Jakarta Selatan', 2],
    ['CGV Pacific Place', 'Bioskop premium di SCBD', 'SCBD, Jakarta Selatan', 2],
  ],
  museum: [
    ['Museum Nasional (Museum Gajah)', 'Koleksi sejarah & budaya Nusantara', 'Gambir, Jakarta Pusat', 1],
    ['Museum MACAN', 'Seni rupa modern & kontemporer', 'Kebon Jeruk, Jakarta Barat', 2],
    ['Museum Sejarah Jakarta (Fatahillah)', 'Museum di jantung Kota Tua', 'Kota Tua, Jakarta Barat', 1],
    ['Museum Wayang', 'Koleksi wayang Nusantara', 'Kota Tua, Jakarta Barat', 1],
    ['Museum Bank Indonesia', 'Sejarah uang & perbankan, gratis', 'Kota Tua, Jakarta Barat', 0],
    ['Galeri Nasional Indonesia', 'Pameran seni rupa, sering gratis', 'Gambir, Jakarta Pusat', 0],
    ['Museum Tekstil', 'Koleksi kain & batik', 'Tanah Abang, Jakarta Pusat', 1],
    ['Museum Seni Rupa dan Keramik', 'Lukisan & keramik di Kota Tua', 'Kota Tua, Jakarta Barat', 1],
    ['Museum Satria Mandala', 'Museum sejarah TNI', 'Jakarta Selatan', 1],
  ],
  hewan: [
    ['Taman Margasatwa Ragunan', 'Kebun binatang luas & murah', 'Jakarta Selatan', 1],
    ['SeaWorld Ancol', 'Lihat biota laut dari dekat', 'Ancol, Jakarta Utara', 2],
    ['Jakarta Aquarium & Safari', 'Akuarium besar di dalam mall', 'Neo Soho, Jakarta Barat', 3],
    ['Faunaland Ancol', 'Taman satwa interaktif', 'Ancol, Jakarta Utara', 2],
    ['Taman Safari Bogor', 'Safari lihat satwa dari mobil', 'Cisarua, Bogor', 3],
    ['Scientia Square Park', 'Taman dengan area satwa', 'Gading Serpong, Tangerang', 2],
  ],
  taman: [
    ['Tebet Eco Park', 'Taman hijau kekinian buat piknik', 'Tebet, Jakarta Selatan', 0],
    ['Taman Suropati', 'Taman teduh di Menteng', 'Menteng, Jakarta Pusat', 0],
    ['Taman Menteng', 'Taman kota buat santai', 'Menteng, Jakarta Pusat', 0],
    ['Lapangan Banteng', 'Taman luas dengan air mancur', 'Jakarta Pusat', 0],
    ['Taman Langsat', 'Taman rindang dekat Barito', 'Kebayoran Baru, Jakarta Selatan', 0],
    ['Taman Ayodya', 'Taman danau kecil di Barito', 'Kebayoran Baru, Jakarta Selatan', 0],
    ['Hutan Kota by Plataran GBK', 'Hutan kota di tengah Senayan', 'Senayan, Jakarta Pusat', 0],
    ['Taman Waduk Pluit', 'Jalan santai pinggir waduk', 'Pluit, Jakarta Utara', 0],
    ['Taman Literasi Martha Tiahahu', 'Taman baca estetik di Blok M', 'Blok M, Jakarta Selatan', 0],
    ['Taman Mini Indonesia Indah', 'Taman budaya luas', 'Jakarta Timur', 1],
  ],
  jalan: [
    ['Kota Tua Jakarta', 'Jalan santai di bangunan tua', 'Jakarta Barat', 0],
    ['Sudirman Car Free Day', 'Jalan pagi bebas kendaraan', 'Sudirman, Jakarta Pusat', 0],
    ['Bundaran HI', 'Ikon kota, apalagi pas CFD', 'Jakarta Pusat', 0],
    ['Dukuh Atas', 'Spot nongkrong & orang kreatif', 'Dukuh Atas, Jakarta Pusat', 0],
    ['Thamrin 10', 'Food & ruang publik estetik', 'Thamrin, Jakarta Pusat', 1],
    ['Setu Babakan', 'Kampung budaya Betawi', 'Jagakarsa, Jakarta Selatan', 0],
    ['Jembatan Kota Intan', 'Jembatan tua bersejarah', 'Jakarta Barat', 0],
    ['Old Shanghai PIK', 'Area bernuansa oriental', 'PIK 2, Tangerang', 1],
  ],
  main: [
    ['Dunia Fantasi (Dufan)', 'Wahana seru seharian', 'Ancol, Jakarta Utara', 3],
    ['Waterbom PIK', 'Main air & seluncuran', 'PIK, Jakarta Utara', 3],
    ['KidZania Jakarta', 'Kota mini seru-seruan', 'Pacific Place, Jakarta Selatan', 3],
    ['Miniapolis', 'Playground indoor di mall', 'Kota Kasablanka, Jakarta Selatan', 2],
    ['Trans Studio Cibubur', 'Theme park indoor', 'Cibubur', 3],
    ['Timezone', 'Arcade & photobox di mall', 'Jabodetabek', 2],
  ],
  belanja: [
    ['Grand Indonesia', 'Mall besar buat window shopping', 'Jakarta Pusat', 2],
    ['Pasar Baru', 'Belanja tekstil & kuliner lawas', 'Jakarta Pusat', 1],
    ['Pasar Santa', 'Thrift, vinyl, barang unik', 'Jakarta Selatan', 1],
    ['Tanah Abang', 'Pusat grosir terbesar', 'Jakarta Pusat', 1],
    ['Blok M Square', 'Belanja & kuliner murah', 'Blok M, Jakarta Selatan', 1],
    ['Pasar Mayestik', 'Kain, jahit, kebutuhan harian', 'Kebayoran Baru, Jakarta Selatan', 1],
    ['Plaza Indonesia', 'Mall premium di pusat kota', 'Thamrin, Jakarta Pusat', 3],
    ['Mall Taman Anggrek', 'Mall besar di Jakarta Barat', 'Jakarta Barat', 2],
  ],
  nongkrong: [
    ['M Bloc Space', 'Kreatif hub & live music', 'Jakarta Selatan', 1],
    ['Sarinah', 'Gedung ikonik dengan food court', 'Thamrin, Jakarta Pusat', 1],
    ['Ashta District 8', 'Mall estetik buat foto', 'SCBD, Jakarta Selatan', 2],
    ['Senayan Park (SPARK)', 'Mall santai dengan taman', 'Senayan, Jakarta Pusat', 2],
    ['Pantai Indah Kapuk (PIK)', 'Deretan tempat makan & suasana malam', 'Jakarta Utara', 2],
    ['Gandaria City', 'Mall buat nongkrong santai', 'Jakarta Selatan', 2],
    ['Little Tokyo Melawai', 'Nuansa Jepang di Blok M', 'Melawai, Jakarta Selatan', 1],
  ],
};

async function run() {
  await sequelize.authenticate();

  // Kosongkan tempat dulu (FK), lalu rapikan kategori.
  await Place.destroy({ where: {}, truncate: false });
  await Category.destroy({ where: { slug: 'ngopi' } });
  for (const c of desiredCats) {
    const [row] = await Category.findOrCreate({ where: { slug: c.slug }, defaults: c });
    await row.update(c);
  }

  const cats = await Category.findAll();
  const idBySlug = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

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
  console.log(`Selesai. ${rows.length} tempat dimasukkan, kategori Ngopi dihapus, Museum & Hewan ditambah.`);
  await sequelize.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed gagal:', err);
  process.exit(1);
});
