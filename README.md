# Mau Kemana Hari Ini

Aplikasi buat kamu & pacar menentukan **mau pergi ke mana hari ini** dengan cara seru:
pilih kategori (makan, ngopi, main, jalan-jalan, taman, nonton, dll), tekan **SPIN**,
biar mesin yang mengacak satu tempat buat kalian.

## Arsitektur

```
React + Vite + Tailwind      Express + Sequelize           Supabase (Postgres)
      Frontend        ──────▶       Backend API      ──────▶      Database
   Vercel / server             server rumah kamu           cloud / self-host
```

- **Frontend** (`frontend/`) — React + Vite + Tailwind + Framer Motion + FontAwesome. Hanya bicara ke backend.
- **Backend** (`backend/`) — Express + Sequelize (ORM). Konek langsung ke Postgres Supabase.
- **Database** — Supabase Postgres. Skema & data awal dikelola lewat **migrations + seeders** Sequelize.

### Struktur backend (berlapis, siap dikembangkan)
```
backend/src/
  config/        koneksi DB (runtime & sequelize-cli)
  models/        model Sequelize + relasi
  services/      logika bisnis
  controllers/   handler request -> service
  routes/        definisi endpoint
  middlewares/   error handler, 404
  utils/         ApiError, asyncHandler
  database/
    migrations/  skema tabel
    seeders/     data contoh
  app.js         setup express
  server.js      entry point
```

### Struktur frontend
```
frontend/src/
  components/     UI (SpinMachine, ResultCard, CategoryPicker, dll)
    layout/
  hooks/          useCategories, useHistory
  lib/            api.js (fetch), icons.js (FontAwesome)
  App.jsx         orchestrator
  index.css       Tailwind + komponen util
```

## Menjalankan (development)

### 1. Database (Supabase)
1. Buat project di https://supabase.com (atau self-host).
2. Ambil **connection string** di Settings → Database (mode *Session*/direct, port `5432`).

### 2. Backend
```bash
cd backend
cp .env.example .env         # isi DATABASE_URL + APP_PIN (PIN buat buka aplikasi)
npm install
npm run db:migrate           # buat tabel
npm run db:seed              # isi kategori + tempat contoh
npm run dev                  # http://localhost:4000
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env         # VITE_API_URL=http://localhost:4000
npm install
npm run dev                  # http://localhost:5173
```

## Pasang di HP (PWA)
Buka website di Chrome HP → menu ⋮ → **Tambahkan ke layar utama** (iPhone: Safari → Bagikan → **Tambah ke Layar Utama**).
Aplikasi terbuka full-screen tanpa bar browser, selalu dalam tampilan HP, dan halamannya tetap terbuka saat offline
(data tetap butuh koneksi). File terkait: `frontend/public/manifest.webmanifest`, `frontend/public/sw.js`, `frontend/public/icons/`.

## Deploy
- **Frontend** → Vercel (atau build statis `npm run build` lalu serve `dist/`).
- **Backend** → server rumah kamu. Lihat [`backend/DEPLOY.md`](backend/DEPLOY.md).
- **Database** → Supabase cloud (atau Postgres self-host di server).

## Endpoint API
Semua endpoint selain `/api/auth/login` wajib header `Authorization: Bearer <token>`.
Token didapat dari login PIN (`APP_PIN` di `.env` backend). Salah 5x berturut-turut dari satu IP → tunggu 15 menit.

| Method | Path | Fungsi |
|--------|------|--------|
| POST | `/api/auth/login` | `{ pin }` → `{ token }` |
| GET | `/api/auth/me` | cek token masih berlaku |
| GET | `/api/categories` | daftar kategori |
| GET | `/api/places?categories=makan,ngopi` | daftar tempat (filter opsional) |
| GET | `/api/spin?categories=…` | pool kandidat + 1 pemenang acak |
| POST | `/api/places` | tambah tempat |
| PUT | `/api/places/:id` | ubah tempat |
| DELETE | `/api/places/:id` | hapus tempat |
| GET | `/api/history` | riwayat pilihan |
| POST | `/api/history` | simpan pilihan |
| DELETE | `/api/history/:id` | hapus riwayat |
